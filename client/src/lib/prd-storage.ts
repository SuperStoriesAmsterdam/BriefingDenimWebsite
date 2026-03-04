import type { Page, Block } from "@/types/prd";
import { STORE_KEY } from "./prd-constants";

export class StorageFullError extends Error {
  constructor() {
    super("Storage full! Remove some images to continue saving.");
    this.name = "StorageFullError";
  }
}

const DATA_KEY = "dc-prd-data";
const VERSION_KEY = "dc-prd-version";

/**
 * Merge user-edited pages with new defaults.
 * - Pages matched by id
 * - New pages from defaults are added
 * - Pages removed from defaults are kept (user may have created them)
 * - For matching pages: user's text edits (label, block titles, descriptions,
 *   content, annotations) are preserved. New blocks from defaults are appended.
 */
function mergePages(stored: Page[], fresh: Page[]): Page[] {
  const storedMap = new Map(stored.map((p) => [p.id, p]));
  const freshMap = new Map(fresh.map((p) => [p.id, p]));

  const merged: Page[] = [];

  // Walk through fresh defaults in order — this preserves the intended page order
  for (const freshPage of fresh) {
    const storedPage = storedMap.get(freshPage.id);
    if (storedPage) {
      // Page exists in both — merge blocks
      merged.push({
        ...freshPage,
        // Keep user's label if they changed it, otherwise use fresh
        label: storedPage.label,
        // Keep user's nav and parent settings
        nav: storedPage.nav,
        parent: storedPage.parent,
        // Merge blocks
        blocks: mergeBlocks(storedPage.blocks, freshPage.blocks),
      });
    } else {
      // New page from defaults — add as-is
      merged.push(freshPage);
    }
  }

  // Append any user-created pages (not in defaults) at the end
  for (const storedPage of stored) {
    if (!freshMap.has(storedPage.id)) {
      merged.push(storedPage);
    }
  }

  return merged;
}

/**
 * Merge blocks within a page.
 * - Match by index (blocks don't have stable ids)
 * - If user has fewer blocks: append new ones from defaults
 * - If user has more blocks (they added some): keep extras at the end
 * - For matching blocks: keep user's text edits
 */
function mergeBlocks(stored: Block[], fresh: Block[]): Block[] {
  const merged: Block[] = [];
  const maxShared = Math.min(stored.length, fresh.length);

  for (let i = 0; i < maxShared; i++) {
    // Keep user's edits for existing blocks
    merged.push(stored[i]);
  }

  // If defaults added new blocks beyond what user had, append them
  if (fresh.length > stored.length) {
    for (let i = stored.length; i < fresh.length; i++) {
      merged.push(fresh[i]);
    }
  }

  // If user added extra blocks, keep them
  if (stored.length > fresh.length) {
    for (let i = fresh.length; i < stored.length; i++) {
      merged.push(stored[i]);
    }
  }

  return merged;
}

export function loadPages(freshDefaults: Page[]): Page[] {
  try {
    const storedVersion = localStorage.getItem(VERSION_KEY);
    const raw = localStorage.getItem(DATA_KEY);

    if (!raw) {
      // No saved data at all — use defaults
      return freshDefaults;
    }

    const stored = JSON.parse(raw) as Page[];

    if (storedVersion === STORE_KEY) {
      // Same version — return stored data as-is (user's edits preserved)
      return stored;
    }

    // Version changed — merge user edits with new defaults
    const merged = mergePages(stored, freshDefaults);
    // Save merged result under new version
    localStorage.setItem(DATA_KEY, JSON.stringify(merged));
    localStorage.setItem(VERSION_KEY, STORE_KEY);
    return merged;
  } catch {
    return freshDefaults;
  }
}

export function savePages(pages: Page[]): void {
  try {
    localStorage.setItem(DATA_KEY, JSON.stringify(pages));
    localStorage.setItem(VERSION_KEY, STORE_KEY);
  } catch (e) {
    if (e instanceof DOMException && e.name === "QuotaExceededError") {
      throw new StorageFullError();
    }
  }
}

/** Load PRD data from the server database */
export async function loadFromServer(): Promise<{ data: Page[] | null; version: string | null }> {
  try {
    const res = await fetch("/api/prd");
    if (!res.ok) return { data: null, version: null };
    const json = await res.json();
    return { data: json.data as Page[] | null, version: json.version };
  } catch {
    return { data: null, version: null };
  }
}

/** Save PRD data to the server database */
export async function saveToServer(pages: Page[]): Promise<boolean> {
  try {
    const res = await fetch("/api/prd", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: pages, version: STORE_KEY }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
