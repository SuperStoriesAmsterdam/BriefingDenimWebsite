export type TeamId = "design" | "dev" | "ghl";

export type BlockType = "hero" | "grid" | "section" | "cta";

export type ViewMode = "wireframe" | "ghl" | "sitemap";

export type FilterTeam = "all" | TeamId;

export interface Annotation {
  team: TeamId;
  text: string;
}

export interface Block {
  type: BlockType;
  title: string;
  desc: string;
  content: string[];
  annotations: Annotation[];
}

export interface Page {
  id: string;
  label: string;
  nav: boolean;
  parent: string | null;
  blocks: Block[];
}

export interface GhlPipeline {
  n: string;
  t: string;
  a: string;
}

export interface GhlIntegration {
  s: string;
  d: string;
  p: string;
}
