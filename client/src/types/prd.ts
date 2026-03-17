export type TeamId = "design" | "dev" | "ghl" | "copy";

export type BlockType = "hero" | "grid" | "section" | "cta";

export type ViewMode = "wireframe" | "ghl" | "sitemap";

export type FilterTeam = "all" | TeamId;

export type SchemaType = "FAQPage" | "Course" | "LocalBusiness" | "Event" | "Product" | "Article" | "Organization" | "Service" | "Place" | "none";

export interface BlockImage {
  id: string;
  data: string;
  name: string;
}

export interface Annotation {
  team: TeamId;
  text: string;
}

export interface QuestionItem {
  text: string;
  answered: boolean;
  answer: string;
}

export interface MoodImage {
  id: string;
  url: string;
  thumbUrl: string;
  name: string;
}

export interface Block {
  type: BlockType;
  title: string;
  desc: string;
  content: string[];
  annotations: Annotation[];
  images?: BlockImage[];
  docUrl?: string;
  schemaType?: SchemaType;
  llmParagraph?: string;
  questions?: QuestionItem[];
}

export interface Page {
  id: string;
  label: string;
  nav: boolean;
  parent: string | null;
  blocks: Block[];
  moodImages?: MoodImage[];
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
