export type TeamId = "design" | "dev" | "ghl" | "copy";

export type BlockType = "hero" | "grid" | "section" | "cta" | "card-list";

export interface CardItem {
  title: string;
  items: string[];
}

export type ViewMode = "wireframe" | "ghl" | "sitemap" | "shopping-list" | "team" | "tasks";

export type FilterTeam = "all" | TeamId;

export type SchemaType = "FAQPage" | "Course" | "LocalBusiness" | "Event" | "Product" | "Article" | "Organization" | "Service" | "Place" | "none";

export interface BlockImage {
  id: string;
  data: string;
  name: string;
}

export interface AnnotationReply {
  author: string;
  text: string;
  timestamp: string;
}

export interface Annotation {
  team: TeamId;
  text: string;
  author?: string;
  to?: string;
  timestamp?: string;
  replies?: AnnotationReply[];
  done?: boolean;
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
  cards?: CardItem[];
  annotations: Annotation[];
  images?: BlockImage[];
  docUrl?: string;
  schemaType?: SchemaType;
  llmParagraph?: string;
  questions?: QuestionItem[];
}

export interface PageQuestion {
  id: string;
  text: string;
  author: string;
  to?: string;
  timestamp: string;
  replies: AnnotationReply[];
}

export interface Page {
  id: string;
  label: string;
  nav: boolean;
  parent: string | null;
  blocks: Block[];
  moodImages?: MoodImage[];
  questions?: PageQuestion[];
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
