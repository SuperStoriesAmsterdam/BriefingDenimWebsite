import type { TeamId, BlockType } from "@/types/prd";

export const STORE_KEY = "dc-prd-v13";

export const TEAM_COLORS: Record<TeamId, { bg: string; border: string; badge: string; text: string }> = {
  design: {
    bg: "bg-violet-500/5",
    border: "border-l-violet-500",
    badge: "bg-violet-500",
    text: "text-violet-500",
  },
  dev: {
    bg: "bg-blue-500/5",
    border: "border-l-blue-500",
    badge: "bg-blue-500",
    text: "text-blue-500",
  },
  ghl: {
    bg: "bg-orange-600/5",
    border: "border-l-orange-600",
    badge: "bg-orange-600",
    text: "text-orange-600",
  },
};

export const TEAM_LABELS: Record<TeamId, string> = {
  design: "DESIGNER",
  dev: "DEVELOPER",
  ghl: "GHL",
};

export const BLOCK_TYPES: BlockType[] = ["hero", "grid", "section", "cta"];

export const BLOCK_TYPE_STYLES: Record<BlockType, { border: string; bg: string; label: string }> = {
  hero: {
    border: "border-t-[hsl(213,65%,12%)]",
    bg: "bg-[#f8f9fb]",
    label: "hero",
  },
  grid: {
    border: "border-t-[hsl(211,55%,23%)]",
    bg: "bg-[#f5f7fa]",
    label: "grid",
  },
  section: {
    border: "border-t-[hsl(210,50%,36%)]",
    bg: "bg-[#fafbfc]",
    label: "section",
  },
  cta: {
    border: "border-t-[hsl(41,47%,56%)]",
    bg: "bg-[#fdf9f0]",
    label: "cta",
  },
};
