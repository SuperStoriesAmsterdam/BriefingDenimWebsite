# Wholeness Work Website — Briefing Platform PRD

## Fork & Reconfiguration Spec for Claude Code

**Source repo:** This repo (PRD/briefing platform, originally built for "Denim City")
**Target:** Reconfigure the fork into the **briefing platform for the Wholeness Work website rebuild** — the full design & development brief translated into an interactive, team-navigable build spec with page-by-page wireframe briefs, copy requirements, CRM integration specs, SEO/content strategy, conversion requirements, and team coordination.
**Date:** 2026-03-17

---

## 1. What This Fork Becomes

This tool is being forked to become the **central briefing platform for the Wholeness Work website rebuild**. It translates the complete WW Design & Development Brief (February 2026, prepared for Connirae Andreas) into an interactive build spec that the entire team works from.

Every page of the WW website gets its own entry with wireframe briefs, copy requirements, design annotations, developer specs, GHL/CRM integration notes, and SEO requirements. The build team (PM, designer, developer, copywriter, GHL/CRM specialist) uses this as the single source of truth throughout the project — from brief approval through launch.

The existing codebase is already built for exactly this purpose. The fork needs:
1. New branding/theming (Wholeness Work colors and identity)
2. New default content (all pages, blocks, and annotations populated from the WW brief)
3. Adjusted team roles (same 4 teams but relabeled if needed)
4. New view modes where applicable (GHL overview reconfigured for WW integrations)
5. Removal of Denim City-specific content and references

---

## 2. Files to Modify (Ordered by Priority)

### 2.1 `client/src/lib/prd-defaults.ts` — FULL REWRITE

This is the most important file. Replace the entire `defaults()` return value with the Wholeness Work site structure. Every page and block below should be pre-populated.

**IMPORTANT:** Increment the version key in `prd-constants.ts` (see 2.2) when changing defaults so existing localStorage data gets merged.

#### Page Structure

Each page object follows this shape:
```typescript
{
  id: string,        // kebab-case unique ID
  label: string,     // Display name in sidebar
  nav: boolean,      // true = main nav, false = footer-only
  parent: string | null,  // parent page ID for nesting
  blocks: Block[]    // array of content blocks
}
```

#### BRIEFINGS & STRATEGY PAGES (parent: "briefings")

**Page: "briefings"**
- id: `"briefings"`
- label: `"Briefings & Strategy"`
- nav: false, parent: null
- blocks: empty (container page)

**Page: "project-overview"**
- id: `"project-overview"`
- label: `"Project Overview"`
- parent: `"briefings"`
- blocks:
  - **hero** — "Wholeness Work Website Rebuild"
    - desc: "Complete website rebuild on Webflow for Connirae Andreas's Wholeness Work method. Multi-channel growth strategy with ICP-specific landing pages, coach directory, training pathway, and HighLevel CRM integration."
    - content:
      - "Platform: Webflow (CMS or Business plan)"
      - "CRM: HighLevel (existing infrastructure)"
      - "Domain: wholenesswork.org"
      - "Stakeholders: Connirae Andreas, Peter (PM), Designer, Developer, Duff (GHL/Marketing)"
    - annotations:
      - { team: "dev", text: "Webflow build — designer can edit directly post-launch, reducing ongoing dev dependency" }
      - { team: "ghl", text: "HighLevel already in place — all forms feed into GHL via native integration or Zapier" }
  - **section** — "Build Phases"
    - desc: "Sequential process: Brief Approval → Copy Writing → Wireframes → Wireframe Approval → Design → Design Approval → Development → QA → Launch"
    - content:
      - "Phase 1: Brief & Copy — Review brief, confirm budget, write all page copy, get approval"
      - "Phase 2: Wireframes & Design — Figma wireframes, full design, mobile-first, approval cycles"
      - "Phase 3: Development & Launch — Webflow build, CMS setup, GHL integration, content population, QA, launch"
      - "Copy must be written BEFORE wireframes begin — design must accommodate actual content, not placeholders"
    - annotations:
      - { team: "copy", text: "Copy inventory identified: 14 core pages, 5 comparison pages, 4 ICP landing pages, plus conversion copy elements" }
  - **section** — "Ongoing Costs"
    - content:
      - "Webflow Hosting (CMS plan): $29/month"
      - "Webflow Business plan: $49/month (if advanced features needed)"
      - "Domain renewal: ~$15/year"
      - "HighLevel CRM: Already covered under existing marketing infrastructure"
  - **section** — "Learnings from CT Site"
    - desc: "Issues to fix from the Core Transformation WordPress site"
    - content:
      - "Coach carousel dominates above-fold — visitors see faces before understanding the method → Lead with 'What is WW?' section"
      - "Competing CTAs create decision paralysis → Single primary CTA: Free Intro"
      - "Dated popup still showing → No popups, or exit-intent only with current offers"
      - "Stats showing 0/0/0 → QA checklist before launch; dynamic content testing"
      - "Pricing invisible on training pages → Show 'Starting at X' on cards"
      - "Mobile coach carousel issues → Responsive grid, mobile-first"
      - "Newsletter CTA is generic → Specific value: 'Get the free WW meditation guide'"
      - "No research/credibility on homepage → Add 'Research-backed' badge"
      - "Long Free Intro page with CTA only at bottom → Add short-form signup at top AND bottom"
    - annotations:
      - { team: "design", text: "Mobile-first in Figma. Touch targets min 44x44px. Coach grid: 2-col tablet, 1-col mobile." }

**Page: "brand-architecture"**
- id: `"brand-architecture"`
- label: `"Brand Architecture"`
- parent: `"briefings"`
- blocks:
  - **section** — "Property Voice & Purpose"
    - content:
      - "Substack (Connirae Andreas, personal voice): Thought leadership, relationship building"
      - "WholenessWork.org (Wholeness Work, method voice): Information, training, conversion"
      - "Substack builds the brand. Website converts the traffic. No duplication."
  - **section** — "Cross-Site Ecosystem"
    - desc: "Three sites: coretransformation.org, wholenesswork.org, andreasnlp.com — consistent navigation, distinct brand identities"
    - content:
      - "Substack → Website: Articles link to ICP landing pages, Free Intro CTA, bio links to WholenessWork.org"
      - "Website → Substack: About Connirae page links to Substack, blog references essays, footer includes link"
      - "Substack subscribers sync to HighLevel CRM with UTM tracking"
    - annotations:
      - { team: "ghl", text: "Tag Substack-origin leads in HighLevel. UTM tracking on all Substack→website links." }
  - **section** — "HQ vs Regional Sites"
    - content:
      - "WholenessWork.org = headquarters and source of truth"
      - "Regional sites (e.g., wholenesswork.eu) = Official Partners, not competing properties"
      - "Regional sites should display: 'Official European Partner of TheWholenessWork.org' badge"
      - "Regional sites link to HQ for: method definition, live training with Connirae, certification standard"
  - **section** — "Certification Flexibility"
    - content:
      - "Two certification paths exist: Connirae's (launching now) and EU association"
      - "Website must be flexible to add badge system later"
      - "For now: neutral framing — 'Wholeness Work Coaches' without specifying certification source"

**Page: "content-strategy"**
- id: `"content-strategy"`
- label: `"Content & SEO Strategy"`
- parent: `"briefings"`
- blocks:
  - **section** — "LLM SEO Strategy"
    - desc: "LLMs (ChatGPT, Claude, Perplexity) are how people discover methods like WW. Site must be a trusted source AI systems cite."
    - content:
      - "Clear, authoritative definitions: Key concepts need crisp, quotable definitions in first paragraph"
      - "Structured Data / Schema Markup: FAQ, HowTo, Person (Connirae), Organization schemas"
      - "Entity establishment: 'Wholeness Work' as distinct entity, created by 'Connirae Andreas', related to but distinct from 'Core Transformation' and 'NLP'"
      - "Comparison content: 'Wholeness Work vs X' pages help LLMs understand relationships"
      - "Research citations: Link peer-reviewed research — LLMs weight academic sources heavily"
      - "FAQ sections on every major page — #1 content type LLMs extract"
    - annotations:
      - { team: "dev", text: "Implement FAQ schema, HowTo schema, Person schema (Connirae), Organization schema on relevant pages" }
      - { team: "copy", text: "Every key concept needs a crisp, quotable definition in first paragraph — this is what LLMs extract" }
  - **section** — "Traditional SEO: Problem-Aware Content (Top of Funnel)"
    - desc: "Blog articles capturing people searching for symptoms, not solutions. 19 articles identified across 4 ICPs."
    - content:
      - "ICP 1 (NLP Legacy): 'Why NLP Stopped Working For Me', 'The Cognitive Trap', 'Beyond Reframing', 'What Comes After NLP?'"
      - "ICP 2 (Non-Dual Seekers): 'The Dark Night of the Soul', 'Why Awakening Fades', 'Spiritual Bypassing', 'Non-Duality Beyond the Cushion', 'When Meditation Makes Things Worse'"
      - "ICP 3 (Gentle Professionals): 'Trauma Therapy Without Re-Traumatization', 'When IFS Isn't Enough', 'The Somatic Therapy Landscape', 'Effective AND Gentle', 'Working With Clients Who Are Stuck'"
      - "ICP 4 (People in Transition): 'Identity Crisis', 'The Space Between', 'Anxiety That Won't Quit', 'Finding Ground', 'Grief Beyond Death'"
  - **section** — "Solution-Aware Content (Mid/Bottom Funnel)"
    - content:
      - "Pillar (2000+ words): 'What is Wholeness Work? Complete Guide', 'WW vs Meditation', 'Parts Work Without Parts', 'Effortless Change', 'Awakening That Lasts', 'Gentle Trauma Resolution'"
      - "Supporting (800-1500 words): 'How to Find the I', 'WW for Anxiety', 'CT vs WW', '5 Signs Meditation Isn't Enough', 'The Body Doesn't Need Your Story', 'What Happens in a WW Session?'"
  - **section** — "Traffic Strategy"
    - desc: "Cold Traffic (Paid) → ICP Landing Page → Free Intro Signup → HighLevel Nurture → Training Purchase"
    - content:
      - "Primary: Meta Lead Ads targeting each ICP segment to their specific landing page. Target $0.50-$1.50 CPL."
      - "Secondary: Organic SEO — compounding traffic over 6-18 months, reduces paid dependence"
      - "Bridge: Substack articles and email sequences warm audiences, direct to landing pages"
      - "ICP landing pages are the conversion hub. Everything else drives traffic toward them."
    - annotations:
      - { team: "ghl", text: "Meta Pixel required for retargeting. Lookalike audiences from Substack subscribers + existing customers." }

**Page: "conversion-elements"**
- id: `"conversion-elements"`
- label: `"Conversion & UX Elements"`
- parent: `"briefings"`
- blocks:
  - **section** — "Objection Handling"
    - desc: "Common concerns addressed explicitly across FAQ, training pages, and Free Intro page"
    - content:
      - "'How is this different from meditation?' → WW works with the structure of 'I', not just attention (FAQ, Comparison, Free Intro)"
      - "'How long until results?' → Many notice shifts in first session; depth builds over time (FAQ, Training pages)"
      - "'What if I've tried everything?' → WW works differently — not adding, but dissolving (FAQ, ICP pages)"
      - "'Is this therapy? Do I need to believe anything?' → Not therapy, no belief required, experiential method (FAQ, About WW)"
      - "'Is this safe for trauma?' → Gentle approach, no reliving required, go at your own pace (FAQ, Safety section)"
      - "'Do I need background or experience?' → No prerequisites for personal use; professional track has pathway (FAQ, Training)"
      - "'What if it doesn't work for me?' → Risk reversal / guarantee policy (FAQ, Training)"
    - annotations:
      - { team: "copy", text: "These objections come from Connirae's real-world experience. Use her actual language where possible." }
  - **section** — "'Is This For Me?' Section"
    - desc: "Self-qualification content for Homepage and Free Intro page"
    - content:
      - "You've tried meditation but feel like something is missing"
      - "You've had glimpses of peace or awakening but can't sustain them"
      - "You're a therapist or coach looking for gentler, deeper methods"
      - "You're navigating a major life transition and need ground"
      - "You want transformation without force or struggle"
  - **section** — "Results Timeline"
    - desc: "Reduces 'is this working?' anxiety. FAQ and training pages."
    - content:
      - "What to expect in first session"
      - "What to expect after a week of practice"
      - "What deeper shifts look like over months"
      - "Not promises — realistic orientation"
  - **section** — "Safety & Trauma Messaging"
    - desc: "Critical for ICP 3 (Gentle Professionals) and ICP 4 (People in Transition)"
    - content:
      - "'You are always in control of the pace'"
      - "'No need to relive or retell trauma'"
      - "'Gentle approach — nothing is forced'"
      - "'If you have a trauma history, WW can be used alongside professional support'"
    - annotations:
      - { team: "copy", text: "Safety language must be explicit and prominent, not buried in footnotes" }
  - **section** — "Success Stories Structure"
    - content:
      - "Before: What was the struggle?"
      - "Journey: What did they experience with WW?"
      - "After: What changed in their life?"
      - "Goal: One case study per ICP, so each audience sees themselves"
  - **section** — "Risk Reversal / Guarantee"
    - content:
      - "Needs policy decision from Connirae"
      - "Option: Money-back guarantee on trainings ('If no value in first session, full refund')"
      - "Option: Satisfaction policy on digital products"
      - "Whatever the policy — display prominently on training and store pages"
    - questions:
      - { text: "What is Connirae's guarantee/refund policy for trainings?", answered: false, answer: "" }
      - { text: "What is the satisfaction policy for digital products (store)?", answered: false, answer: "" }

---

#### CORE WEBSITE PAGES

**Page: "homepage"**
- id: `"homepage"`
- label: `"Homepage"`
- nav: true, parent: null
- blocks:
  - **hero** — "Hero Section"
    - desc: "First thing visitors see. Single clear value proposition."
    - content:
      - "Logo + minimal nav (About, Trainings, Coaches, Practice Groups, Resources, Contact)"
      - "Hero: Clear value proposition — what WW does for the visitor"
      - "Sub-headline: One sentence explaining the method"
      - "Single CTA: [Start Free Intro] — one action, no choice paralysis"
      - "Trust badge: 'Research-backed' indicator linking to studies"
    - annotations:
      - { team: "design", text: "Priority: Logo, nav, hero headline, sub-headline, single CTA button, research badge. Nothing else above fold." }
      - { team: "copy", text: "Hero must answer: 'What does this do for ME?' Not 'What is this method?' — benefit-first." }
      - { team: "dev", text: "Sticky header with hamburger on mobile. CTA button should be high-contrast, persistent." }
    - schemaType: "Organization"
  - **section** — "What is Wholeness Work"
    - desc: "Video + brief explanation. Answers the first question for newcomers."
    - content:
      - "Short introductory video (no autoplay — thumbnail + click to load)"
      - "2-3 paragraph explanation of the method"
      - "LLM-optimized: Clear, quotable definition in first paragraph"
    - annotations:
      - { team: "dev", text: "Video: no autoplay, thumbnail + click-to-load. Lazy load for page speed." }
  - **section** — "Training Pathway"
    - desc: "Visual progression Level I → IV with prices. This is the product."
    - content:
      - "Level I: Entry training — title, brief desc, price ('Starting at $X')"
      - "Level II: Advanced — title, brief desc, price"
      - "Level III: Deepest — title, brief desc, price"
      - "Level IV: Highest level — title, brief desc, price"
      - "CTA: [View All Trainings]"
    - annotations:
      - { team: "design", text: "Visual cards showing progression. Price visible on cards — don't hide pricing." }
    - schemaType: "Course"
  - **grid** — "Wholeness Work Coaches"
    - desc: "Uniform grid, randomized, all coaches. Bookable = revenue."
    - content:
      - "Randomized load order — every page load shuffles coach display"
      - "Uniform card size — no hierarchy, equal visual weight"
      - "Show 8-12 coaches initially with 'View All Coaches' button"
      - "CTA: [Find a Coach]"
    - annotations:
      - { team: "dev", text: "CMS-driven with randomization. Each coach = CMS entry (name, photo, bio, link). New coaches auto-enter rotation." }
      - { team: "design", text: "Identical card sizes — grid layout. Sacrifices 'artful montage' for fairness and maintainability." }
  - **section** — "Practice Groups"
    - desc: "Community proof — active practitioners worldwide."
    - content:
      - "List/map of active practice groups"
      - "CTA: [Find a Practice Group]"
  - **section** — "'Is This For Me?' Section"
    - desc: "Self-qualification content (see Conversion Elements page for full copy)"
    - content:
      - "Checklist of who WW is for — helps right people say yes, wrong people self-select out"
  - **cta** — "Footer"
    - content:
      - "Cross-site links (coretransformation.org, andreasnlp.com)"
      - "Substack link"
      - "Legal pages"
      - "Social media links"
    - annotations:
      - { team: "design", text: "NO testimonials on homepage. Testimonials belong on training pages and Success Stories page." }

**Page: "about-ww"**
- id: `"about-ww"`
- label: `"About / What is WW"`
- nav: true, parent: null
- blocks:
  - **hero** — "What is Wholeness Work?"
    - desc: "Method explanation, differentiation from CT. Primary CTA: Start Free Intro."
    - content:
      - "Clear, authoritative definition of Wholeness Work (2-3 sentences, LLM-optimizable)"
      - "How it works — experiential, not cognitive"
      - "What makes it different from meditation, therapy, NLP"
      - "Relationship to Core Transformation (evolved from, distinct method)"
    - annotations:
      - { team: "copy", text: "First paragraph MUST contain a crisp, quotable definition — this is what LLMs will extract and cite." }
    - schemaType: "Article"
  - **section** — "LLM-Optimized FAQ"
    - desc: "Structured Q&A for the What is WW page — primary LLM SEO target"
    - content:
      - "What is Wholeness Work? [Clear 2-3 sentence definition]"
      - "Who created Wholeness Work? [Connirae Andreas bio + authority]"
      - "How is Wholeness Work different from meditation? [Distinct comparison]"
      - "What can Wholeness Work help with? [List of applications]"
      - "Is Wholeness Work backed by research? [Link to research page]"
      - "How do I learn Wholeness Work? [Training pathway overview]"
    - annotations:
      - { team: "dev", text: "Implement FAQPage schema markup on this section" }
    - schemaType: "FAQPage"

**Page: "about-connirae"**
- id: `"about-connirae"`
- label: `"About Connirae Andreas"`
- nav: true, parent: null
- blocks:
  - **hero** — "Connirae Andreas"
    - desc: "Creator authority, story, credentials, trust. CTA: Start Free Intro."
    - content:
      - "Bio: Creator of Wholeness Work and co-creator of Core Transformation"
      - "Credentials and background in NLP, therapy, personal development"
      - "Story: How Wholeness Work emerged from decades of exploration"
      - "Link to Substack for thought leadership content"
    - annotations:
      - { team: "dev", text: "Implement Person schema markup for Connirae" }
    - schemaType: "Organization"

**Page: "research"**
- id: `"research"`
- label: `"Research"`
- nav: true, parent: null
- blocks:
  - **section** — "Scientific Backing"
    - desc: "Credibility page. Links to peer-reviewed research. CTA: View Trainings."
    - content:
      - "Peer-reviewed studies on Wholeness Work"
      - "Research methodology and findings"
      - "Academic citations (LLMs weight these heavily)"
      - "Link to full papers/abstracts"
    - annotations:
      - { team: "copy", text: "Research citations are critical for LLM SEO — format for easy extraction" }

**Page: "faq"**
- id: `"faq"`
- label: `"FAQ"`
- nav: true, parent: null
- blocks:
  - **section** — "FAQ Page"
    - desc: "Serves three purposes: (1) Conversion — handles objections, (2) LLM SEO — structured Q&A is #1 content type AIs extract, (3) Self-qualification."
    - content:
      - "Content source: Connirae's most common real-world questions and issues"
      - "Include all 7 objection-handling questions (see Conversion Elements page)"
      - "Include ICP-specific LLM questions (see Content Strategy page)"
      - "Structured Q&A format for maximum LLM extractability"
    - annotations:
      - { team: "dev", text: "Implement FAQPage schema on this entire page" }
      - { team: "copy", text: "Use Connirae's actual real-world questions as source — not guessed questions" }
    - schemaType: "FAQPage"
    - questions:
      - { text: "Has Connirae provided the list of most common questions people bring to her?", answered: false, answer: "" }

**Page: "success-stories"**
- id: `"success-stories"`
- label: `"Success Stories"`
- nav: true, parent: null
- blocks:
  - **section** — "Transformation Case Studies"
    - desc: "Structured narratives, not just testimonial quotes. CTA: Start Free Intro."
    - content:
      - "Structure: Before (struggle) → Journey (WW experience) → After (what changed)"
      - "Goal: One case study per ICP so each audience sees themselves"
      - "ICP 1: NLP practitioner story"
      - "ICP 2: Meditation/seeker story"
      - "ICP 3: Therapist/coach story"
      - "ICP 4: Life transition story"
    - annotations:
      - { team: "copy", text: "These are structured narratives, not pull-quotes. Full Before → Journey → After arc." }

**Page: "free-intro"**
- id: `"free-intro"`
- label: `"Free Intro (Lead Magnet)"`
- nav: true, parent: null
- blocks:
  - **hero** — "Free Intro Landing Page"
    - desc: "Email capture, first experience. This is the #1 conversion point for the entire site."
    - content:
      - "Short-form signup at TOP (not just bottom — CT site had CTA only at bottom)"
      - "Clear value proposition for the free intro"
      - "Video or guided experience"
      - "Safety & trauma messaging"
      - "'Is This For Me?' checklist"
      - "Second signup form at bottom"
    - annotations:
      - { team: "design", text: "Two signup forms: top AND bottom. CT site had CTA only at bottom — lost high-intent visitors." }
      - { team: "ghl", text: "Form feeds directly to HighLevel. Triggers WW-specific nurture sequence. Tag by entry point (ICP page, organic vs paid)." }
      - { team: "dev", text: "UTM parameter tracking — know which ICP page or ad sent them here" }
    - schemaType: "Course"

**Page: "trainings-overview"**
- id: `"trainings-overview"`
- label: `"Trainings Overview"`
- nav: true, parent: null
- blocks:
  - **section** — "Training Pathway Orientation"
    - desc: "Shows the full training progression. CTA: Choose Training Level."
    - content:
      - "Visual pathway: Level I → Level II → Level III → Level IV → Certification"
      - "Each level: Brief description + 'Starting at $X' price"
      - "Clear progression logic — why each level matters"
    - annotations:
      - { team: "design", text: "Visual pathway/progression diagram. Prices visible on cards — don't hide pricing (CT site issue)." }
    - schemaType: "Course"

**Page: "training-level-1"**
- id: `"training-level-1"`
- label: `"WW Level 1"`
- nav: true, parent: `"trainings-overview"`
- blocks:
  - **section** — "Level 1 Training Details"
    - desc: "Entry training. Full details + pricing. CTA: Register / Inquire."
    - content:
      - "What you'll learn"
      - "Who this is for"
      - "Format (online/in-person, duration, schedule)"
      - "Full pricing (not hidden)"
      - "Results timeline: What to expect in first session, first week, over months"
      - "Guarantee/risk reversal (pending Connirae's policy decision)"
      - "Testimonials from Level 1 graduates"
    - annotations:
      - { team: "ghl", text: "Register/Inquire form → HighLevel pipeline. Tag as Level 1 inquiry." }

**Page: "training-level-2"**
- id: `"training-level-2"`
- label: `"WW Level 2"`
- nav: true, parent: `"trainings-overview"`
- blocks:
  - **section** — "Level 2 Training Details"
    - desc: "Advanced training. CTA: Register / Inquire."
    - content:
      - "Prerequisites: Level 1 completion"
      - "What you'll learn at this depth"
      - "Format, pricing, schedule"
      - "Testimonials from Level 2 graduates"

**Page: "training-level-3"**
- id: `"training-level-3"`
- label: `"WW Level 3"`
- nav: true, parent: `"trainings-overview"`
- blocks:
  - **section** — "Level 3 Training Details"
    - desc: "Deepest training. CTA: Register / Inquire."
    - content:
      - "Prerequisites: Level 2 completion"
      - "What this level offers beyond Level 2"
      - "Format, pricing, schedule"
      - "Testimonials from Level 3 graduates"

**Page: "training-level-4"**
- id: `"training-level-4"`
- label: `"WW Level 4"`
- nav: true, parent: `"trainings-overview"`
- blocks:
  - **section** — "Level 4 Training Details"
    - desc: "Highest level. CTA: Register / Inquire."
    - content:
      - "Prerequisites: Level 3 completion"
      - "What this level offers"
      - "Format, pricing, schedule"

**Page: "coach-certification"**
- id: `"coach-certification"`
- label: `"Coach Certification"`
- nav: true, parent: `"trainings-overview"`
- blocks:
  - **section** — "Professional Pathway"
    - desc: "CTA: Apply / Learn More"
    - content:
      - "Certification requirements and process"
      - "What certification enables (listing in directory, use of branding)"
      - "Neutral framing — 'Wholeness Work Coaches' without specifying certification source"
      - "Must be flexible to add badge system later"

**Page: "find-a-coach"**
- id: `"find-a-coach"`
- label: `"Find a Coach"`
- nav: true, parent: null
- blocks:
  - **grid** — "Coach Directory"
    - desc: "Randomized grid with booking. CTA: Book Session."
    - content:
      - "Uniform card: Photo, name, location, brief specialty, booking button"
      - "Randomized load order — no coach permanently first or last"
      - "Filter/search: By location, language, specialty, availability"
      - "Booking: Calendly embed, external booking link, or contact form per coach"
    - annotations:
      - { team: "dev", text: "CMS fields: name, photo, bio, location, languages, specialties, booking_url, active (yes/no). Randomize on each page load." }
      - { team: "design", text: "Uniform card size. Grid: 3-4 col desktop, 2-col tablet, 1-col mobile. 'View All Coaches' if >12." }

**Page: "store"**
- id: `"store"`
- label: `"Store"`
- nav: true, parent: null
- blocks:
  - **section** — "Books, Videos, Audios"
    - desc: "Digital and physical products. CTA: Purchase."
    - content:
      - "Product grid with pricing"
      - "Guarantee/satisfaction policy displayed prominently"
    - schemaType: "Product"

**Page: "blog"**
- id: `"blog"`
- label: `"Blog / Articles"`
- nav: true, parent: null
- blocks:
  - **section** — "SEO Content Hub"
    - desc: "SEO content, thought leadership. CTA: Subscribe / Free Intro."
    - content:
      - "CMS-driven blog with categories"
      - "Problem-aware content (top of funnel)"
      - "Solution-aware content (mid/bottom funnel)"
      - "Each article structured for LLM citation (quotable definitions in first paragraph)"
    - annotations:
      - { team: "dev", text: "Blog via Webflow CMS. Article schema markup on each post." }
    - schemaType: "Article"

**Page: "contact"**
- id: `"contact"`
- label: `"Contact"`
- nav: true, parent: null
- blocks:
  - **section** — "General Inquiries"
    - desc: "CTA: Submit Form."
    - content:
      - "Contact form → HighLevel"
      - "General inquiry handling"
    - annotations:
      - { team: "ghl", text: "Contact form feeds to HighLevel. Tag as general inquiry." }

---

#### COMPARISON PAGES (SEO + Conversion)

**Page: "comparisons"**
- id: `"comparisons"`
- label: `"Comparison Pages"`
- nav: false, parent: null
- blocks: empty (container)

**Page: "ww-vs-meditation"**
- id: `"ww-vs-meditation"`
- label: `"WW vs Meditation"`
- parent: `"comparisons"`
- blocks:
  - **section** — "Wholeness Work vs Meditation"
    - desc: "Target: 'wholeness work meditation', 'beyond meditation'. Captures meditation seekers."
    - content:
      - "Clear comparison structure — what's similar, what's different"
      - "LLM-optimized: quotable distinction in first paragraph"
      - "CTA: Free Intro"
    - schemaType: "FAQPage"

**Page: "ww-vs-ifs"**
- id: `"ww-vs-ifs"`
- label: `"WW vs IFS"`
- parent: `"comparisons"`
- blocks:
  - **section** — "Wholeness Work vs IFS"
    - desc: "Target: 'wholeness work IFS', 'parts work alternatives'. Captures IFS-curious professionals."
    - content:
      - "Comparison for practitioners familiar with IFS/parts work"
      - "Respectful positioning — not 'better than', but 'different approach'"
      - "CTA: Free Intro"

**Page: "ww-vs-therapy"**
- id: `"ww-vs-therapy"`
- label: `"WW vs Therapy"`
- parent: `"comparisons"`
- blocks:
  - **section** — "Wholeness Work vs Therapy"
    - desc: "Target: 'is wholeness work therapy', 'wholeness work vs counseling'. Clarifies positioning."
    - content:
      - "Clear: WW is NOT therapy. Experiential method, no diagnosis, no treatment."
      - "Can complement therapy, used alongside professional support"
      - "CTA: Free Intro"

**Page: "ww-vs-ct"**
- id: `"ww-vs-ct"`
- label: `"WW vs Core Transformation"`
- parent: `"comparisons"`
- blocks:
  - **section** — "Wholeness Work vs Core Transformation"
    - desc: "Target: 'wholeness work vs core transformation'. Clarifies relationship between methods."
    - content:
      - "Both created by Connirae Andreas"
      - "CT: Structured process working with parts"
      - "WW: Works with the structure of 'I' itself"
      - "Evolution, not replacement"

**Page: "ww-vs-mindfulness"**
- id: `"ww-vs-mindfulness"`
- label: `"WW vs Mindfulness"`
- parent: `"comparisons"`
- blocks:
  - **section** — "Wholeness Work vs Mindfulness"
    - desc: "Target: 'wholeness work mindfulness', 'MBSR alternative'."
    - content:
      - "Comparison for mindfulness/MBSR practitioners"
      - "CTA: Free Intro"

---

#### ICP LANDING PAGES

**Page: "icp-landing-pages"**
- id: `"icp-landing-pages"`
- label: `"ICP Landing Pages"`
- nav: false, parent: null
- blocks: empty (container)

**Page: "for-nlp-practitioners"**
- id: `"for-nlp-practitioners"`
- label: `"ICP 1: NLP Legacy"`
- parent: `"icp-landing-pages"`
- blocks:
  - **hero** — "/for-nlp-practitioners"
    - desc: "Headline: 'Beyond Technique: The Evolution of Change Work'"
    - content:
      - "Pain point: Tools work but feel cold, cognitive, effort-driven"
      - "Connirae angle: From mental reprogramming to organic integration"
      - "Hooks: NLP evolution, beyond techniques, heart + precision"
      - "CTA: Free Intro (positioned as 'the next evolution')"
    - annotations:
      - { team: "ghl", text: "Meta Ad targeting: NLP interests, Tony Robbins, coaching certifications → this page. Tag leads as ICP1-NLP." }
      - { team: "copy", text: "SEO targets: 'NLP evolution', 'beyond NLP', 'NLP limitations'" }

**Page: "beyond-meditation"**
- id: `"beyond-meditation"`
- label: `"ICP 2: Non-Dual Seekers"`
- parent: `"icp-landing-pages"`
- blocks:
  - **hero** — "/beyond-meditation"
    - desc: "Headline: 'Why Awakening Doesn't Stick (And What Does)'"
    - content:
      - "Pain point: Glimpses fade, awakening feels accidental or teacher-dependent"
      - "Connirae angle: Awakening as accessible by choice via precise inner mechanics"
      - "Hooks: Stabilizing awakening, embodied spirituality, practical non-duality"
      - "CTA: Free Intro (positioned as 'awakening you can practice')"
    - annotations:
      - { team: "ghl", text: "Meta Ad targeting: Meditation apps, Eckhart Tolle, Sam Harris, retreat interests → this page. Tag as ICP2-Seeker." }
      - { team: "copy", text: "SEO targets: 'why meditation isn't enough', 'stabilize awakening', 'meditation plateau'" }

**Page: "for-therapists"**
- id: `"for-therapists"`
- label: `"ICP 3: Gentle Professionals"`
- parent: `"icp-landing-pages"`
- blocks:
  - **hero** — "/for-therapists"
    - desc: "Headline: 'Deep Change Without Retraumatization'"
    - content:
      - "Pain point: Doubt that gentleness can be effective; fear 'soft' means 'slow'"
      - "Connirae angle: Surgical gentleness — deep, fast change without force"
      - "Hooks: Trauma-informed without catharsis, effective AND gentle"
      - "CTA: Free Intro + 'Learn to Guide WW' pathway"
    - annotations:
      - { team: "ghl", text: "Meta Ad targeting: Therapist/coach job titles, IFS interests, trauma training → this page. Tag as ICP3-Professional." }
      - { team: "copy", text: "SEO targets: 'gentle trauma therapy', 'parts work for therapists', 'trauma without catharsis'" }

**Page: "life-transitions"**
- id: `"life-transitions"`
- label: `"ICP 4: People in Transition"`
- parent: `"icp-landing-pages"`
- blocks:
  - **hero** — "/life-transitions"
    - desc: "Headline: 'Finding Ground When Everything is Shifting'"
    - content:
      - "Pain point: Identity vertigo, groundlessness, old self gone / new self not yet formed"
      - "Connirae angle: Ground and regulation without requiring clarity"
      - "Hooks: Navigating liminal space, presence without pressure"
      - "CTA: Free Intro (positioned as 'find your ground')"
    - annotations:
      - { team: "ghl", text: "Meta Ad targeting: Life coaching interests, career change, relationship status changes → this page. Tag as ICP4-Transition." }
      - { team: "copy", text: "SEO targets: 'identity crisis help', 'groundedness practice', 'navigating life transitions'" }

---

#### QUESTIONS PAGES

**Page: "questions-to-client"**
- id: `"questions-to-client"`
- label: `"Questions to Connirae"`
- nav: false, parent: null
- blocks:
  - **section** — "Open Questions for Connirae"
    - questions:
      - { text: "What is the refund/guarantee policy for trainings?", answered: false, answer: "" }
      - { text: "What is the satisfaction policy for digital products (store)?", answered: false, answer: "" }
      - { text: "Can you provide the list of most common questions people bring to you? (For FAQ page)", answered: false, answer: "" }
      - { text: "Are there 4 success stories we can use (one per ICP)?", answered: false, answer: "" }
      - { text: "What is the current pricing for Level 1-4 trainings?", answered: false, answer: "" }
      - { text: "Confirm: Webflow CMS or Business plan?", answered: false, answer: "" }
      - { text: "What practice groups exist and where?", answered: false, answer: "" }
      - { text: "What video/intro content exists for the Free Intro lead magnet?", answered: false, answer: "" }
      - { text: "How should the EU certification path be referenced vs. Connirae's certification?", answered: false, answer: "" }

**Page: "questions-from-client"**
- id: `"questions-from-client"`
- label: `"Questions from Connirae"`
- nav: false, parent: null
- blocks:
  - **section** — "Connirae's Questions & Feedback"
    - desc: "Track questions and feedback from Connirae during the build process"

---

### 2.2 `client/src/lib/prd-constants.ts` — UPDATE

```typescript
// Change version key to force fresh defaults on existing installs
export const STORE_KEY = "ww-prd-v1";

// Team labels — keep same 4 teams, update label if desired
export const TEAM_LABELS: Record<TeamId, string> = {
  design: "DESIGNER",
  dev: "DEVELOPER",
  ghl: "GHL",
  copy: "COPY",
};

// Team colors — keep as-is (violet, blue, orange, emerald)
// These are functionally good. No change needed.

// Block types — keep as-is (hero, grid, section, cta)
// These map well to the WW site structure.

// Schema types — keep as-is
// All relevant: FAQPage, Course, Product, Article, Organization, Person, Service
```

### 2.3 `client/src/components/prd/prd-sidebar.tsx` — UPDATE

Changes needed:
1. **Title:** Change `"Denim City"` to `"Wholeness Work"`
2. **Subtitle/context:** Change any "PM Team Resources" or project-specific text
3. **Customer Journey link:** Remove or replace the `/customer-journey.html` link (or create a WW-specific standalone page if needed)
4. **Quick links section:** Update to reference WW-relevant resources

### 2.4 `client/src/index.css` — UPDATE THEME

Update CSS custom properties for Wholeness Work brand. The WW brand should feel:
- Warm, grounded, spacious (not clinical or corporate)
- Colors suggesting natural warmth and depth
- Clean and modern but not cold

Suggested palette (adjust to match actual WW branding):
```css
:root {
  /* Warm, grounded palette for Wholeness Work */
  --background: 30 25% 97%;        /* Warm off-white */
  --foreground: 220 20% 18%;       /* Deep warm charcoal */
  --primary: 220 20% 18%;          /* Deep charcoal */
  --primary-foreground: 30 25% 97%;
  --accent: 25 60% 50%;            /* Warm amber/terracotta */
  --sidebar: 220 20% 15%;          /* Dark warm tone */
  --sidebar-primary: 25 60% 55%;   /* Warm gold */
  --sidebar-accent: 220 15% 22%;
}
```

**Note:** If Wholeness Work has established brand colors, use those instead of suggestions above.

### 2.5 `client/src/components/prd/ghl-overview.tsx` — UPDATE

Replace hardcoded GHL pipeline/integration data with WW-specific integrations:

**Pipelines:**
- Free Intro Funnel (Lead → Watched Intro → Nurture → Training Inquiry)
- Training Sales Pipeline (Inquiry → Consultation → Registered → Completed)
- Coach Booking Pipeline (if GHL handles bookings)

**Integrations:**
- Webflow Forms → HighLevel (native or Zapier)
- Meta Pixel → HighLevel (ad tracking)
- Substack → HighLevel (subscriber sync)
- Calendly → HighLevel (coach bookings, if applicable)

**Universal Automations:**
- Free Intro signup → WW nurture sequence
- ICP page source → Tag by ICP segment
- UTM tracking → Lead source attribution
- Training inquiry → Sales notification
- Coach booking → Confirmation email

### 2.6 `server/routes.ts` — CLEAN UP

- Remove the `/customer-journey.html` route (or replace with a WW-specific standalone page)
- The `/api/prd` routes stay as-is — they're generic and work for any PRD

### 2.7 `customer-journey.html` — REMOVE OR REPLACE

- Delete the Denim City customer journey file
- Optionally create a WW customer journey HTML file if needed

### 2.8 Root-level cleanup

- Remove any Denim City-specific files (check for ops roadmaps, etc.)
- Update `package.json` name/description to reflect WW Concierge

---

## 3. GHL Overview Data

Replace the GHL hardcoded data in `prd-defaults.ts` (or wherever GHL overview data lives) with:

```typescript
export const GHL_PIPES: GhlPipeline[] = [
  { n: "Free Intro Funnel", t: "Lead Capture", a: "Signup → Watch Intro → Email Nurture → Training CTA" },
  { n: "Training Sales", t: "Sales Pipeline", a: "Inquiry → Consultation → Registration → Payment → Onboarding" },
  { n: "Coach Booking", t: "Booking", a: "Directory Visit → Coach Select → Calendar Book → Confirmation" },
  { n: "Content Nurture", t: "Email Sequence", a: "Substack Sync → Welcome → ICP-Segmented Drip → Training Offer" },
];

export const GHL_INT: GhlIntegration[] = [
  { s: "Webflow", d: "All site forms feed to HighLevel", p: "Native integration or Zapier webhook" },
  { s: "Meta Ads", d: "Pixel tracking + conversion events", p: "Meta Pixel on all pages, conversion events for: Free Intro signup, Training inquiry, Coach booking, Purchase" },
  { s: "Substack", d: "Subscriber sync to HighLevel", p: "Zapier or native — tag as Substack-origin" },
  { s: "Calendly", d: "Coach booking integration", p: "Per-coach booking URLs, confirmation triggers" },
  { s: "Google Analytics 4", d: "Conversion tracking", p: "GA4 with events: free_intro_signup, training_inquiry, coach_booking, purchase" },
  { s: "Hotjar", d: "UX heatmaps first 90 days", p: "Session recording + heatmaps on key conversion pages" },
];

export const UNIVERSAL_AUTOMATIONS: string[] = [
  "Free Intro signup → WW nurture email sequence",
  "ICP landing page source → Auto-tag lead by segment (NLP/Seeker/Professional/Transition)",
  "UTM parameter capture → Lead source attribution in HighLevel",
  "Training inquiry form → Notify sales + add to Training Sales pipeline",
  "Coach booking confirmation → Email to client + notification to coach",
  "Substack subscriber → Sync to HighLevel + tag as content-origin",
  "Cart abandonment (Store) → Recovery email sequence",
  "Nurture email: 'Which path fits you?' → Links to all 4 ICP pages",
];
```

---

## 4. Technical Requirements (No Code Changes Needed)

These are inherited from the existing codebase and work as-is:
- PostgreSQL + Drizzle ORM for persistence
- localStorage + server sync with merge strategy
- Debounced auto-save (500ms)
- Drag-drop page reordering and nesting
- Block reordering, moving blocks between pages
- Image upload with resize/compression
- Team annotation system with filtering
- Q&A tracking with progress
- Schema.org type tagging per block
- External doc link support per block
- Responsive sidebar with resizable panels
- Three view modes: Wireframe, GHL Overview, Sitemap

---

## 5. Page Speed / Performance Notes for Dev Annotations

Add these as dev annotations on relevant pages:
- Target: <3 second load time on mobile 3G
- Core Web Vitals: Pass LCP, FID, CLS
- Images: WebP format, lazy loading, proper sizing
- Video: No autoplay — thumbnail + click-to-load
- Test with Google PageSpeed Insights before launch

---

## 6. Implementation Order

For Claude Code implementing this fork:

1. **Update `prd-constants.ts`** — Change `STORE_KEY` to `"ww-prd-v1"`
2. **Rewrite `prd-defaults.ts`** — Full replacement with all WW pages/blocks from this PRD
3. **Update `prd-sidebar.tsx`** — Change title from "Denim City" to "Wholeness Work", remove customer journey link
4. **Update `index.css`** — New color theme
5. **Update `ghl-overview.tsx`** — Replace hardcoded GHL data
6. **Clean up root files** — Remove `customer-journey.html` and Denim City-specific files
7. **Update `package.json`** — Name and description
8. **Test** — Verify all pages render, sidebar navigation works, save/load works
