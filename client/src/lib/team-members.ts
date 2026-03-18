/**
 * Team members are stored in localStorage so they can be
 * managed from the UI without redeploying.
 */
export interface TeamMember {
  name: string;
  role: string;
}

const STORAGE_KEY = "dc-prd-team-members";

export function getTeamMembers(): TeamMember[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as TeamMember[];
  } catch {}
  return [];
}

export function saveTeamMembers(members: TeamMember[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(members));
}

export function getTeamNames(): string[] {
  return getTeamMembers().map((m) => m.name);
}
