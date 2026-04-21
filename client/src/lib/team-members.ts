/**
 * Team members are stored in the server database (persistent across deploys)
 * and mirrored to localStorage as a fast-read cache.
 */
export interface TeamMember {
  name: string;
  role: string;
}

import { PROJECT_ID } from "./project.config";

const STORAGE_KEY = `${PROJECT_ID}-prd-team-members`;

// ── localStorage (cache) ──────────────────────────────────────────────────────

export function getTeamMembers(): TeamMember[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as TeamMember[];
  } catch {}
  return [];
}

export function saveTeamMembers(members: TeamMember[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(members));
  } catch {}
}

export function getTeamNames(): string[] {
  return getTeamMembers().map((m) => m.name);
}

// ── Server (source of truth) ──────────────────────────────────────────────────

export async function loadTeamFromServer(): Promise<TeamMember[] | null> {
  try {
    const res = await fetch("/api/team", { cache: "no-store" });
    if (!res.ok) return null;
    const json = await res.json();
    return Array.isArray(json.data) ? (json.data as TeamMember[]) : null;
  } catch {
    return null;
  }
}

export async function saveTeamToServer(members: TeamMember[]): Promise<void> {
  try {
    await fetch("/api/team", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: members }),
    });
  } catch {}
}
