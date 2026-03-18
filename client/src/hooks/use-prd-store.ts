import { useState, useEffect, useCallback, useRef } from "react";
import type { Page, PageQuestion, ViewMode, FilterTeam, Block, MoodImage, AnnotationReply } from "@/types/prd";
import { loadPages, savePages, saveToServer, loadFromServer, StorageFullError } from "@/lib/prd-storage";
import { defaults } from "@/lib/prd-defaults";
import { STORE_KEY } from "@/lib/prd-constants";

export function usePrdStore() {
  const [pages, setPages] = useState<Page[] | null>(null);
  const [activePage, setActivePage] = useState("home");
  const [viewMode, setViewMode] = useState<ViewMode>("wireframe");
  const [showAnnotations, setShowAnnotations] = useState(true);
  const [filterTeam, setFilterTeam] = useState<FilterTeam>("all");
  const [saveStatus, setSaveStatus] = useState("");

  // Drag state
  const [dragBlock, setDragBlock] = useState<number | null>(null);
  const [overBlock, setOverBlock] = useState<number | null>(null);
  const [dragPage, setDragPage] = useState<string | null>(null);
  const [overPage, setOverPage] = useState<string | null>(null);

  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Keep a ref to the latest pages so mutations never read stale closures
  const pagesRef = useRef<Page[] | null>(null);

  // Load on mount — try server first, fall back to localStorage, then defaults
  useEffect(() => {
    async function init() {
      const freshDefaults = defaults();

      // Load from both sources
      const server = await loadFromServer();
      const local = loadPages(freshDefaults);

      // Pick whichever is most recent — server is authoritative,
      // but localStorage has the latest if a debounced server save hasn't fired yet
      let currentPages: Page[];
      if (server.data && Array.isArray(server.data) && server.data.length > 0) {
        // Both exist — use server data, but prefer localStorage if it has user-created
        // pages that server doesn't (user edited between saves)
        const serverPages = server.data as Page[];
        const localHasExtra = local.some((lp) => !serverPages.some((sp) => sp.id === lp.id));
        currentPages = localHasExtra ? local : serverPages;
      } else {
        // No server data — use localStorage/defaults
        currentPages = local;
      }

      // Restore any missing default pages
      const missingDefaults = freshDefaults.filter(
        (dp) => !currentPages.some((p) => p.id === dp.id)
      );
      if (missingDefaults.length > 0) {
        currentPages = [...currentPages, ...missingDefaults];
      }

      pagesRef.current = currentPages;
      setPages(currentPages);
      try { savePages(currentPages); } catch {}
      // Always sync to server on init to ensure consistency
      saveToServer(currentPages);
    }
    init();
  }, []);

  // Flush pending saves on beforeunload so edits aren't lost
  useEffect(() => {
    const flush = () => {
      if (timer.current && pagesRef.current) {
        clearTimeout(timer.current);
        timer.current = null;
        try { savePages(pagesRef.current); } catch {}
        // Use fetch with keepalive (supports PUT, unlike sendBeacon which is POST-only)
        fetch("/api/prd", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: pagesRef.current, version: STORE_KEY }),
          keepalive: true,
        }).catch(() => {});
      }
    };
    window.addEventListener("beforeunload", flush);
    return () => window.removeEventListener("beforeunload", flush);
  }, []);

  // Persist — localStorage immediately, server debounced
  const persist = useCallback((p: Page[]) => {
    pagesRef.current = p;
    setPages(p);
    // Save to localStorage immediately so refreshes never lose data
    try {
      savePages(p);
    } catch (e) {
      if (e instanceof StorageFullError) {
        setSaveStatus("Storage full!");
        return;
      }
    }
    // Debounce server sync
    if (timer.current) clearTimeout(timer.current);
    setSaveStatus("...");
    timer.current = setTimeout(async () => {
      try {
        const serverOk = await saveToServer(p);
        setSaveStatus(serverOk ? "Synced" : "Saved locally");
        setTimeout(() => setSaveStatus(""), 1500);
      } catch {
        setSaveStatus("Save error");
      }
    }, 500);
  }, []);

  // Derived
  const currentPage = pages?.find((p) => p.id === activePage) ?? null;
  const topLevelPages = pages?.filter((p) => !p.parent) ?? [];
  const childrenOf = useCallback(
    (parentId: string) => pages?.filter((p) => p.parent === parentId) ?? [],
    [pages]
  );

  // Mutations — all read from pagesRef to avoid stale-closure bugs
  const renamePage = useCallback(
    (id: string, newLabel: string) => {
      const cur = pagesRef.current;
      if (!cur) return;
      persist(cur.map((p) => (p.id === id ? { ...p, label: newLabel } : p)));
    },
    [persist]
  );

  const unnestPage = useCallback(
    (id: string) => {
      const cur = pagesRef.current;
      if (!cur) return;
      persist(cur.map((p) => (p.id === id ? { ...p, parent: null } : p)));
    },
    [persist]
  );

  const nestPage = useCallback(
    (sourceId: string, targetId: string) => {
      const cur = pagesRef.current;
      if (!cur || sourceId === targetId) return;
      persist(cur.map((p) => (p.id === sourceId ? { ...p, parent: targetId } : p)));
    },
    [persist]
  );

  const toggleNav = useCallback(
    (id: string) => {
      const cur = pagesRef.current;
      if (!cur) return;
      persist(cur.map((p) => (p.id === id ? { ...p, nav: !p.nav } : p)));
    },
    [persist]
  );

  const addPage = useCallback(() => {
    const cur = pagesRef.current;
    if (!cur) return;
    const id = "page-" + Date.now();
    persist([
      ...cur,
      {
        id,
        label: "New Page",
        nav: true,
        parent: null,
        blocks: [
          {
            type: "section",
            title: "First Section",
            desc: "Description...",
            content: ["Content..."],
            annotations: [],
          },
        ],
      },
    ]);
    setActivePage(id);
  }, [persist]);

  const deletePage = useCallback(
    (id: string) => {
      const cur = pagesRef.current;
      if (!cur) return;
      const updated = cur
        .filter((p) => p.id !== id)
        .map((p) => (p.parent === id ? { ...p, parent: null } : p));
      persist(updated);
      setActivePage((prev) => prev === id ? (updated[0]?.id ?? "home") : prev);
    },
    [persist]
  );

  const updateBlock = useCallback(
    (pageId: string, blockIndex: number, newBlock: Block | null) => {
      const cur = pagesRef.current;
      if (!cur) return;
      persist(
        cur.map((p) => {
          if (p.id !== pageId) return p;
          if (newBlock === null) {
            return { ...p, blocks: p.blocks.filter((_, j) => j !== blockIndex) };
          }
          return { ...p, blocks: p.blocks.map((b, j) => (j === blockIndex ? newBlock : b)) };
        })
      );
    },
    [persist]
  );

  const dropBlock = useCallback(
    (toIndex: number) => {
      const cur = pagesRef.current;
      if (dragBlock === null || dragBlock === toIndex || !cur) return;
      const page = cur.find((p) => p.id === activePage);
      if (!page) return;
      const blocks = [...page.blocks];
      const [moved] = blocks.splice(dragBlock, 1);
      blocks.splice(toIndex, 0, moved);
      persist(cur.map((p) => (p.id === page.id ? { ...p, blocks } : p)));
      setDragBlock(null);
      setOverBlock(null);
    },
    [dragBlock, activePage, persist]
  );

  const addBlock = useCallback(
    (pageId: string) => {
      const cur = pagesRef.current;
      if (!cur) return;
      persist(
        cur.map((p) =>
          p.id === pageId
            ? {
                ...p,
                blocks: [
                  ...p.blocks,
                  {
                    type: "section" as const,
                    title: "New Section",
                    desc: "Description...",
                    content: ["Content..."],
                    annotations: [],
                  },
                ],
              }
            : p
        )
      );
    },
    [persist]
  );

  const moveBlockUp = useCallback(
    (pageId: string, blockIndex: number) => {
      const cur = pagesRef.current;
      if (!cur || blockIndex <= 0) return;
      persist(
        cur.map((p) => {
          if (p.id !== pageId) return p;
          const blocks = [...p.blocks];
          [blocks[blockIndex - 1], blocks[blockIndex]] = [blocks[blockIndex], blocks[blockIndex - 1]];
          return { ...p, blocks };
        })
      );
    },
    [persist]
  );

  const moveBlockDown = useCallback(
    (pageId: string, blockIndex: number) => {
      const cur = pagesRef.current;
      if (!cur) return;
      persist(
        cur.map((p) => {
          if (p.id !== pageId) return p;
          if (blockIndex >= p.blocks.length - 1) return p;
          const blocks = [...p.blocks];
          [blocks[blockIndex], blocks[blockIndex + 1]] = [blocks[blockIndex + 1], blocks[blockIndex]];
          return { ...p, blocks };
        })
      );
    },
    [persist]
  );

  const moveBlockToPage = useCallback(
    (fromPageId: string, blockIndex: number, toPageId: string) => {
      const cur = pagesRef.current;
      if (!cur || fromPageId === toPageId) return;
      const sourcePage = cur.find((p) => p.id === fromPageId);
      if (!sourcePage || blockIndex < 0 || blockIndex >= sourcePage.blocks.length) return;
      const block = sourcePage.blocks[blockIndex];
      persist(
        cur.map((p) => {
          if (p.id === fromPageId) {
            return { ...p, blocks: p.blocks.filter((_, j) => j !== blockIndex) };
          }
          if (p.id === toPageId) {
            return { ...p, blocks: [...p.blocks, block] };
          }
          return p;
        })
      );
    },
    [persist]
  );

  const reorderPage = useCallback(
    (sourceId: string, targetId: string, position: "before" | "after") => {
      const cur = pagesRef.current;
      if (!cur || sourceId === targetId) return;
      const updated = cur.filter((p) => p.id !== sourceId);
      const sourcePage = cur.find((p) => p.id === sourceId);
      if (!sourcePage) return;
      const targetIndex = updated.findIndex((p) => p.id === targetId);
      if (targetIndex === -1) return;
      const insertAt = position === "before" ? targetIndex : targetIndex + 1;
      updated.splice(insertAt, 0, sourcePage);
      persist(updated);
    },
    [persist]
  );

  const updateMoodImages = useCallback(
    (pageId: string, moodImages: MoodImage[]) => {
      const cur = pagesRef.current;
      if (!cur) return;
      persist(
        cur.map((p) =>
          p.id === pageId ? { ...p, moodImages } : p
        )
      );
    },
    [persist]
  );

  const moveContentBetweenBlocks = useCallback(
    (fromPageId: string, fromBlockIndex: number, contentIndex: number,
     toPageId: string, toBlockIndex: number, insertIndex: number) => {
      const cur = pagesRef.current;
      if (!cur) return;
      // Find the content item text
      const fromPage = cur.find((p) => p.id === fromPageId);
      if (!fromPage) return;
      const fromBlock = fromPage.blocks[fromBlockIndex];
      if (!fromBlock || contentIndex < 0 || contentIndex >= fromBlock.content.length) return;
      const item = fromBlock.content[contentIndex];
      // Remove from source, add to target
      persist(
        cur.map((p) => {
          const newBlocks = p.blocks.map((b, bi) => {
            // Remove from source block
            if (p.id === fromPageId && bi === fromBlockIndex) {
              return { ...b, content: b.content.filter((_, ci) => ci !== contentIndex) };
            }
            // Add to target block
            if (p.id === toPageId && bi === toBlockIndex) {
              const newContent = [...b.content];
              newContent.splice(insertIndex, 0, item);
              return { ...b, content: newContent };
            }
            return b;
          });
          if (p.id === fromPageId || p.id === toPageId) {
            return { ...p, blocks: newBlocks };
          }
          return p;
        })
      );
    },
    [persist]
  );

  const addPageQuestion = useCallback(
    (pageId: string, question: PageQuestion) => {
      const cur = pagesRef.current;
      if (!cur) return;
      persist(
        cur.map((p) =>
          p.id === pageId
            ? { ...p, questions: [...(p.questions || []), question] }
            : p
        )
      );
    },
    [persist]
  );

  const replyToPageQuestion = useCallback(
    (pageId: string, questionId: string, reply: AnnotationReply) => {
      const cur = pagesRef.current;
      if (!cur) return;
      persist(
        cur.map((p) => {
          if (p.id !== pageId) return p;
          return {
            ...p,
            questions: (p.questions || []).map((q) =>
              q.id === questionId ? { ...q, replies: [...q.replies, reply] } : q
            ),
          };
        })
      );
    },
    [persist]
  );

  const resetToDefaults = useCallback(async () => {
    const d = defaults();
    pagesRef.current = d;
    setPages(d);
    savePages(d);
    await saveToServer(d);
    setActivePage("home");
  }, []);

  return {
    // State
    pages,
    activePage,
    setActivePage,
    viewMode,
    setViewMode,
    showAnnotations,
    setShowAnnotations,
    filterTeam,
    setFilterTeam,
    saveStatus,

    // Drag state
    dragBlock,
    setDragBlock,
    overBlock,
    setOverBlock,
    dragPage,
    setDragPage,
    overPage,
    setOverPage,

    // Derived
    currentPage,
    topLevelPages,
    childrenOf,

    // Mutations
    persist,
    renamePage,
    unnestPage,
    nestPage,
    toggleNav,
    addPage,
    deletePage,
    updateBlock,
    dropBlock,
    addBlock,
    moveBlockUp,
    moveBlockDown,
    moveBlockToPage,
    moveContentBetweenBlocks,
    reorderPage,
    updateMoodImages,
    addPageQuestion,
    replyToPageQuestion,
    resetToDefaults,
  };
}

export type PrdStore = ReturnType<typeof usePrdStore>;
