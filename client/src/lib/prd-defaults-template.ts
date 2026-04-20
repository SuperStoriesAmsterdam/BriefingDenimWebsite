/**
 * PRD DEFAULTS TEMPLATE
 *
 * Use this file as the starting point when setting up the briefing platform
 * for a new project. Copy this file to prd-defaults.ts and replace the
 * placeholder content with the real project structure.
 *
 * STRUCTURE
 * ─────────
 * Pages  → top-level nav items (e.g. Home, About, Store, Services)
 * Blocks → sections within a page (hero, grid, section, cta, card-list)
 * Annotations → team-specific notes per block (dev, ghl, copy, design)
 *
 * BLOCK TYPES
 * ───────────
 * hero       — full-width opening section, strong headline
 * grid       — grid of cards or items (courses, team members, products)
 * section    — standard text section with supporting content
 * cta        — conversion section (booking, contact, signup)
 * card-list  — categorised lists (e.g. brands, services grouped by type)
 *
 * GETTING STARTED
 * ───────────────
 * 1. Rename this file to prd-defaults.ts (keep the original as backup)
 * 2. Update project.config.ts: PROJECT_ID, PROJECT_NAME, PROJECT_VERSION
 * 3. Replace placeholder pages and blocks with the real site structure
 * 4. Add blocks as the Figma design becomes available
 * 5. Bump PROJECT_VERSION whenever you make significant structural changes
 */

import type { Page } from "@/types/prd";

export function defaults(): Page[] {
  return [
    {
      id: "home",
      label: "Home",
      nav: true,
      parent: null,
      blocks: [
        {
          type: "hero",
          title: "Hero Section",
          desc: "Opening section — the first thing visitors see. Establishes who this is for and what they can do here.",
          content: [
            "Headline: short, direct positioning statement",
            "Subline: supporting claim or tagline",
            "Visual: hero image or video",
            "Primary CTA: one action, clearly stated",
          ],
          annotations: [
            {
              team: "design",
              text: "Hero sets the tone for the entire site. Confirm visual direction before copy is written.",
            },
            {
              team: "copy",
              text: "Tone of voice TBD — add approved voice reference here once the calibration section is signed off.",
            },
          ],
        },
        {
          type: "section",
          title: "Introduction",
          desc: "What this organisation is, who it serves, and why it exists. The 'about in brief' section.",
          content: [
            "Who: one sentence on what this organisation is",
            "What: what you can do or get here",
            "Why: the underlying mission or belief",
          ],
          annotations: [
            {
              team: "copy",
              text: "Keep this to 3–4 sentences. This is not the About page — it's the hook that sends people to the right place.",
            },
          ],
        },
        {
          type: "cta",
          title: "Primary CTA",
          desc: "Main conversion action for this page.",
          content: [
            "CTA text: one verb + one object",
            "Supporting line: reduce friction, answer the obvious objection",
            "Link: form, booking, or contact",
          ],
          annotations: [
            {
              team: "ghl",
              text: "GHL FORM: Connect this CTA to the correct GHL pipeline. Tag all submissions with page origin.",
            },
            {
              team: "dev",
              text: "Webflow form → GHL webhook. Confirm field mapping before build.",
            },
            {
              team: "copy",
              text: "One primary action only. Secondary links belong in the navigation.",
            },
          ],
        },
      ],
    },
    {
      id: "about",
      label: "About",
      nav: true,
      parent: null,
      blocks: [
        {
          type: "hero",
          title: "About",
          desc: "Who is behind this and why does it exist.",
          content: [
            "Founding story or mission statement",
            "Key people or team",
            "Values or principles",
          ],
          annotations: [
            {
              team: "copy",
              text: "This is where the brand gets personal. Lead with belief, not credentials.",
            },
          ],
        },
        {
          type: "section",
          title: "Story",
          desc: "The longer narrative — origin, evolution, what matters and why.",
          content: [
            "Origin: how and why this started",
            "Evolution: how it has grown or changed",
            "Today: where it stands now",
          ],
          annotations: [
            {
              team: "copy",
              text: "Write this in first or third person depending on the brand voice. Confirm with Peter before drafting.",
            },
          ],
        },
        {
          type: "cta",
          title: "Get in Touch",
          desc: "Generic contact CTA for the About page.",
          content: [
            "CTA: 'Get in touch' or equivalent",
            "Short supporting line",
            "Contact form or email link",
          ],
          annotations: [
            {
              team: "ghl",
              text: "GHL FORM: General contact → Contact pipeline. Tag: source = about-page.",
            },
          ],
        },
      ],
    },
    {
      id: "contact",
      label: "Contact",
      nav: true,
      parent: null,
      blocks: [
        {
          type: "hero",
          title: "Contact",
          desc: "How to get in touch — one page, all options.",
          content: [
            "Primary contact method (form, phone, email)",
            "Location / address if physical",
            "Opening hours if relevant",
            "Response time expectation",
          ],
          annotations: [
            {
              team: "dev",
              text: "Schema.org LocalBusiness markup if this is a physical location. Google Maps embed if relevant.",
            },
            {
              team: "ghl",
              text: "GHL FORM: General contact form → Contact pipeline. All submissions tagged with contact-page origin.",
            },
            {
              team: "copy",
              text: "Make the response expectation explicit. 'We reply within 1 business day' removes anxiety from the submission.",
            },
          ],
        },
      ],
    },
  ];
}
