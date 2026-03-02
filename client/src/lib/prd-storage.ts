import type { Page } from "@/types/prd";
import { STORE_KEY } from "./prd-constants";

export function loadPages(): Page[] | null {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Page[];
  } catch {
    return null;
  }
}

export function savePages(pages: Page[]): void {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(pages));
  } catch {
    // silently fail
  }
}
