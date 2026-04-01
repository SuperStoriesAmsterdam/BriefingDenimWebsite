import type { TeamId, BlockType, SchemaType } from "@/types/prd";
import { PROJECT_ID, PROJECT_VERSION } from "./project.config";

export const STORE_KEY = `${PROJECT_ID}-prd-${PROJECT_VERSION}`;

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
  copy: {
    bg: "bg-emerald-500/5",
    border: "border-l-emerald-500",
    badge: "bg-emerald-500",
    text: "text-emerald-500",
  },
};

export const TEAM_LABELS: Record<TeamId, string> = {
  design: "DESIGNER",
  dev: "DEVELOPER",
  ghl: "GHL",
  copy: "COPY",
};

export const BLOCK_TYPES: BlockType[] = ["hero", "grid", "section", "cta"];

export const SCHEMA_TYPES: SchemaType[] = ["none", "FAQPage", "Course", "LocalBusiness", "Event", "Product", "Article", "Organization", "Service", "Place"];

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
