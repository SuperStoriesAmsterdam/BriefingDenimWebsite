import { useState, useEffect, useCallback, useRef } from "react";
import type { Page, ViewMode, FilterTeam, Block } from "@/types/prd";
import { loadPages, savePages, saveToServer, loadFromServer, StorageFullError } from "@/lib/prd-storage";
import { defaults } from "@/lib/prd-defaults";

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

  // Load on mount — try server first, fall back to localStorage, then defaults
  useEffect(() => {
    async function init() {
      const freshDefaults = defaults();
      const server = await loadFromServer();
      if (server.data && Array.isArray(server.data) && server.data.length > 0) {
        // Server has data — use it, then restore any missing default pages
        // and fix the parent of any default pages that have drifted
        let currentPages = loadPages(server.data);
        const missingDefaults = freshDefaults.filter(
          (dp) => !currentPages.some((p) => p.id === dp.id)
        );
        if (missingDefaults.length > 0) {
          currentPages = [...currentPages, ...missingDefaults];
        }
        // Correct parent field for any existing default pages that have drifted
        let parentFixed = false;
        currentPages = currentPages.map((p) => {
          const def = freshDefaults.find((d) => d.id === p.id);
          if (def && p.parent !== def.parent) {
            parentFixed = true;
            return { ...p, parent: def.parent };
          }
          return p;
        });
        setPages(currentPages);
        try { savePages(currentPages); } catch {}
        if (missingDefaults.length > 0 || parentFixed) saveToServer(currentPages);
      } else {
        // No server data — use localStorage/defaults, then seed the server
        const local = loadPages(freshDefaults);
        setPages(local);
        saveToServer(local);
      }
    }
    init();
  }, []);

  // Persist with debounce — saves to both localStorage and server
  const persist = useCallback((p: Page[]) => {
    setPages(p);
    if (timer.current) clearTimeout(timer.current);
    setSaveStatus("...");
    timer.current = setTimeout(async () => {
      try {
        savePages(p);
        const serverOk = await saveToServer(p);
        setSaveStatus(serverOk ? "Synced" : "Saved locally");
        setTimeout(() => setSaveStatus(""), 1500);
      } catch (e) {
        if (e instanceof StorageFullError) {
          setSaveStatus("Storage full!");
        } else {
          setSaveStatus("Save error");
        }
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

  // Mutations
  const renamePage = useCallback(
    (id: string, newLabel: string) => {
      if (!pages) return;
      persist(pages.map((p) => (p.id === id ? { ...p, label: newLabel } : p)));
    },
    [pages, persist]
  );

  const unnestPage = useCallback(
    (id: string) => {
      if (!pages) return;
      persist(pages.map((p) => (p.id === id ? { ...p, parent: null } : p)));
    },
    [pages, persist]
  );

  const nestPage = useCallback(
    (sourceId: string, targetId: string) => {
      if (!pages || sourceId === targetId) return;
      persist(pages.map((p) => (p.id === sourceId ? { ...p, parent: targetId } : p)));
    },
    [pages, persist]
  );

  const toggleNav = useCallback(
    (id: string) => {
      if (!pages) return;
      persist(pages.map((p) => (p.id === id ? { ...p, nav: !p.nav } : p)));
    },
    [pages, persist]
  );

  const addPage = useCallback(() => {
    if (!pages) return;
    const id = "page-" + Date.now();
    persist([
      ...pages,
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
  }, [pages, persist]);

  const deletePage = useCallback(
    (id: string) => {
      if (!pages) return;
      // Also unnest children
      const updated = pages
        .filter((p) => p.id !== id)
        .map((p) => (p.parent === id ? { ...p, parent: null } : p));
      persist(updated);
      if (activePage === id) {
        setActivePage(updated[0]?.id ?? "home");
      }
    },
    [pages, persist, activePage]
  );

  const updateBlock = useCallback(
    (pageId: string, blockIndex: number, newBlock: Block | null) => {
      if (!pages) return;
      persist(
        pages.map((p) => {
          if (p.id !== pageId) return p;
          if (newBlock === null) {
            return { ...p, blocks: p.blocks.filter((_, j) => j !== blockIndex) };
          }
          return { ...p, blocks: p.blocks.map((b, j) => (j === blockIndex ? newBlock : b)) };
        })
      );
    },
    [pages, persist]
  );

  const dropBlock = useCallback(
    (toIndex: number) => {
      if (dragBlock === null || dragBlock === toIndex || !currentPage || !pages) return;
      const blocks = [...currentPage.blocks];
      const [moved] = blocks.splice(dragBlock, 1);
      blocks.splice(toIndex, 0, moved);
      persist(pages.map((p) => (p.id === currentPage.id ? { ...p, blocks } : p)));
      setDragBlock(null);
      setOverBlock(null);
    },
    [dragBlock, currentPage, pages, persist]
  );

  const addBlock = useCallback(
    (pageId: string) => {
      if (!pages) return;
      persist(
        pages.map((p) =>
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
    [pages, persist]
  );

  const moveBlockUp = useCallback(
    (pageId: string, blockIndex: number) => {
      if (!pages || blockIndex <= 0) return;
      persist(
        pages.map((p) => {
          if (p.id !== pageId) return p;
          const blocks = [...p.blocks];
          [blocks[blockIndex - 1], blocks[blockIndex]] = [blocks[blockIndex], blocks[blockIndex - 1]];
          return { ...p, blocks };
        })
      );
    },
    [pages, persist]
  );

  const moveBlockDown = useCallback(
    (pageId: string, blockIndex: number) => {
      if (!pages) return;
      persist(
        pages.map((p) => {
          if (p.id !== pageId) return p;
          if (blockIndex >= p.blocks.length - 1) return p;
          const blocks = [...p.blocks];
          [blocks[blockIndex], blocks[blockIndex + 1]] = [blocks[blockIndex + 1], blocks[blockIndex]];
          return { ...p, blocks };
        })
      );
    },
    [pages, persist]
  );

  const moveBlockToPage = useCallback(
    (fromPageId: string, blockIndex: number, toPageId: string) => {
      if (!pages || fromPageId === toPageId) return;
      const sourcePage = pages.find((p) => p.id === fromPageId);
      if (!sourcePage || blockIndex < 0 || blockIndex >= sourcePage.blocks.length) return;
      const block = sourcePage.blocks[blockIndex];
      persist(
        pages.map((p) => {
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
    [pages, persist]
  );

  const reorderPage = useCallback(
    (sourceId: string, targetId: string, position: "before" | "after") => {
      if (!pages || sourceId === targetId) return;
      const updated = pages.filter((p) => p.id !== sourceId);
      const sourcePage = pages.find((p) => p.id === sourceId);
      if (!sourcePage) return;
      const targetIndex = updated.findIndex((p) => p.id === targetId);
      if (targetIndex === -1) return;
      const insertAt = position === "before" ? targetIndex : targetIndex + 1;
      updated.splice(insertAt, 0, sourcePage);
      persist(updated);
    },
    [pages, persist]
  );

  const resetToDefaults = useCallback(async () => {
    const d = defaults();
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
    reorderPage,
    resetToDefaults,
  };
}

export type PrdStore = ReturnType<typeof usePrdStore>;
