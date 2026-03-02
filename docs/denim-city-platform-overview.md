# Denim City Platform Overview

**Prepared for Mariette, James, and the Denim City team**
**March 2026**

---

## 1. This Is Not Just a Website

What we are building for Denim City is not a website. It is a platform.

A website shows people who you are. A platform brings people in, guides them to the right experience, books them, follows up, brings them back, and turns one visit into a long relationship. That is what Denim City is getting.

The new Denim City platform is a storefront, a booking engine, a customer relationship system, a marketing machine, a search engine strategy, and an AI-ready content hub -- all connected, all automated, all working together around the clock. When someone in Tokyo asks ChatGPT "Where can I learn to make jeans in Amsterdam?", this platform makes sure Denim City is the answer. When a tourist books a tour and loves it, the platform suggests a course three days later. When a brand manager fills out a lab inquiry form, the system routes it to the right person, sends a confirmation, and follows up if nobody responds within 48 hours.

Every part of this system has a job. Nothing is decorative.

---

## 2. What the Platform Does

Here is what is being built, layer by layer, in plain language.

### The Website (Webflow)

This is the public face -- the thing visitors see. It includes every page from Home to Store to Education to Lab & Atelier to Tours to Collaborate, plus the Denim Dates events calendar, the FAQ, Press, Venue Rental, and the Contact page. Every page is designed mobile-first (because most visitors are on their phones), loads fast, and is built so the Denim City team can update content -- add new events, swap out brands, change pricing -- without needing a developer.

But the website is more than pages. Every section is written to answer a specific question that a real person would ask. "Do you repair jeans from any brand?" "Can you produce a capsule collection?" "How much does the Make Your Own Jeans course cost?" This is deliberate. Search engines reward pages that answer real questions. So do AI assistants.

### The CRM and Automation Engine (GoHighLevel)

Behind every form, every booking button, and every inquiry on the website sits GoHighLevel (GHL) -- a customer relationship and automation system. This is the operational brain.

There are **9 dedicated pipelines**, each handling a different type of incoming contact:

1. **Tours** -- booking, confirmation, reminder, post-tour follow-up, course conversion
2. **Courses** -- booking, confirmation, reminder, feedback, upsell, abandoned booking recovery, certificate delivery
3. **Lab / Atelier** -- inquiry, quote, project tracking (with sub-flows for individuals, brands, and schools)
4. **Partnerships** -- inquiry, discovery, proposal, long-term nurture
5. **Venue Rental** -- inquiry, availability check, quote, contract, 48-hour follow-up
6. **Funding** -- inquiry, application, reporting
7. **Press** -- inquiry, follow-up
8. **Incubator** -- intake, review, trial day, acceptance
9. **Repair B2B** -- brand inquiry, discovery, onboarding

Every pipeline has automated confirmations and reminders. Every pipeline has follow-up sequences. If someone starts booking a course but does not finish, the system sends a recovery email at 1 hour, 24 hours, and 72 hours. If someone finishes a tour, the system waits three days and then suggests booking a course. If a lab inquiry sits without a response for too long, the system escalates it internally.

None of this requires anyone on the team to remember to send an email. It happens automatically.

### The Intelligence Layer (LLM-Optimized Content)

This is the part most agencies do not even think about yet. AI assistants -- ChatGPT, Google Gemini, Perplexity, Apple Intelligence -- are rapidly becoming the way people find things. When someone asks an AI "Where is the best place to learn about denim in Amsterdam?", the AI does not guess. It reads websites and extracts answers.

Every key section of the Denim City website includes a carefully written paragraph designed to be extracted and quoted by AI systems. These paragraphs contain the full entity: "Denim City is a denim innovation hub in Amsterdam, located in De Hallen, combining a retail store, sustainable laundry lab, education programs, and guided tours under one roof." That is not marketing copy. That is an answer formatted so machines repeat it accurately.

On top of that, every relevant page carries Schema.org structured data -- a layer of code that tells Google exactly what each page is. The FAQ page is marked as FAQPage so Google can show the questions directly in search results. Course pages are marked as Course. The store is marked as LocalBusiness with opening hours and address. This is how Denim City shows up in rich search results, map packs, and AI answer panels.

### The Measurement Stack

Every meaningful action on the website is tracked:

- **Google Analytics 4** tracks page views, scroll depth, form submissions, booking clicks, and outbound clicks
- **Google Search Console** shows which search terms bring people to the site and how the site ranks
- **Microsoft Clarity** (heatmaps) records where real visitors click, how far they scroll, and where they drop off

This is not data for data's sake. It tells the team which pages are working, which ones lose people, and where to invest next.

### Retargeting and Recovery

Two tracking pixels are installed on every page: the **Meta Pixel** (for Instagram and Facebook) and the **Google Ads tag**. When a visitor browses the Store page or looks at the Make Your Own Jeans course but leaves without booking, they can see Denim City again in their Instagram feed, on Facebook, or in Google search results. This is retargeting -- and it is one of the most cost-effective ways to convert interested visitors into actual customers.

Combined with the abandoned booking recovery emails in GHL, this means Denim City has two separate systems working to bring back people who showed interest but did not act.

### The POS Connection (Lightspeed to GHL)

Denim City's store runs on Lightspeed Retail. Right now, in-store customers are invisible to the CRM -- they buy and leave, and there is no way to follow up.

The platform changes that. When a customer opts in for a digital receipt at checkout, their purchase data flows through Make.com (a secure EU-based automation tool) into GHL. The system creates a contact record, tags them by the brands they bought, and starts a tailored follow-up sequence. Someone who buys Nudie Jeans gets a repair reminder at six months (because Denim City is Nudie's free-repair-for-life partner). Someone who buys Denim City Originals gets an invitation to the Make Your Own Jeans course. A high-value customer gets a personal note from the team.

Every interaction -- online or in-store -- feeds into one unified customer profile.

---

## 3. How the Platform Serves Each Audience

Denim City serves at least 10 distinct audiences. The website is one experience for everyone -- no confusing "Are you a brand or a consumer?" routing -- but behind the scenes, every audience has a tailored path through the platform.

**Industry Professionals and Denim Brands** find Denim City through search, trade networks, or word of mouth. They land on the Lab & Atelier or Collaborate page, see the equipment list and case studies, and fill out an inquiry form that routes directly to the Lab/Atelier or Partnerships pipeline. They receive a professional follow-up sequence with portfolio examples and project scoping.

**International Tourists** find Denim City through Google Maps, travel blogs, or AI assistants answering "things to do in Amsterdam." They land on the Tours page, see the pricing and guide descriptions, and book directly through the embedded booking widget. After the tour, the system suggests courses and sends them the monthly Denim Dates calendar.

**Expat Consumers in Amsterdam** search for "denim store Amsterdam" or "jeans repair Amsterdam." They find the Store or FAQ page (both optimized for exactly those searches), visit in person, and if they opt in at checkout, enter the CRM with brand-based tags for future follow-up.

**Local Amsterdam Consumers** follow a similar path but are more likely to return repeatedly. The Denim Dates email keeps them informed about upcoming events, new brands, and course openings. The retargeting pixels remind them about the course they browsed but did not book.

**NGO and Government Stakeholders** arrive via the Collaborate page or direct outreach. They see the House of Denim Foundation's mission, partnership tiers with transparent pricing, and past projects (PVH Foundation, Team NL Olympics). Their inquiry enters the Funding pipeline with tailored follow-up.

**Fashion and Denim Students** find the Education page through school recommendations or search. They see the three pillars -- Academy, Incubator, Jean School -- with student pricing clearly shown. The FAQ section answers their specific questions about internships, archive access, and group bookings. Schools booking group visits enter the pipeline with institutional follow-up.

**Venue Renters** discover the Venue Rental page through event space searches. They fill out an inquiry form, receive an automated response with availability and next steps, and enter a pipeline that tracks the process from inquiry to contract.

**Parents Booking Creative Courses** find the Academy courses through search or the Denim Dates calendar. The Make Your Own Bag course (half day, approachable, perfect for groups) is highlighted as a family and team activity. Post-course emails suggest the next experience.

**Customization Seekers** (sashiko, distressing, patchwork) land on the Store page's Customization & Artistry section. They see the craftsmanship, learn about the techniques, and book through the repair/customization booking flow. The system cross-links to the Academy ("Want to learn Sashiko yourself? Book a course.").

**Repair Customers** search "jeans repair Amsterdam" and land on the Revive Your Jeans section. The "Zero Glue Tolerance" positioning immediately differentiates Denim City from every dry cleaner in the city. They book an appointment or walk in. Brand partnerships (Nudie free repair, KOI partner service) are clearly explained.

Every one of these journeys ends in the same CRM, building a unified picture of who Denim City's audience actually is.

---

## 4. The Conversion Machine

Getting visitors to the website is only half the job. Turning them into customers is the other half. The platform includes 8 conversion optimization layers:

**1. Retargeting Pixels.** Visitors who leave without booking see Denim City again on Instagram, Facebook, and Google. Most people do not convert on their first visit. Retargeting brings them back for the second.

**2. Behavioral Triggers.** If someone browses the Make Your Own Jeans course page but does not book, the system notices. Abandoned booking recovery emails go out at 1 hour, 24 hours, and 72 hours. Cross-sell emails suggest related experiences after a completed booking. Time-decay nudges re-engage contacts who have gone quiet.

**3. Social Proof.** Testimonials, press mentions, and real numbers appear on conversion pages. "If you ever did a tour, you will never buy the same way again" is not invented copy -- it is a real quote, and it is the tour page headline. The press page and project showcase build credibility with institutional audiences.

**4. Performance.** A fast website converts better than a slow one. Webflow's hosting includes a global CDN, automatic image optimization, and SSL. Core Web Vitals targets are set: pages load in under 2.5 seconds. Every fraction of a second matters.

**5. Heatmaps.** Microsoft Clarity records where real visitors click, how far they scroll, and where they hesitate. This is not guesswork -- it is direct observation. If visitors consistently scroll past the booking button, the button moves. If nobody clicks a section, it gets rethought.

**6. Micro-Conversions.** Not everyone is ready to book on their first visit. The platform captures lighter commitments: signing up for the monthly Denim Dates email, downloading a course overview, or expressing interest in a future event. These smaller actions bring people into the CRM, where the automation engine can nurture them toward a booking over time.

**7. Attribution.** Every GHL email, every social post link, every ad campaign carries UTM tracking parameters. This means the team can see exactly which channels drive actual revenue -- not just clicks, but bookings. If Instagram tours convert better than Google Ads, the budget shifts.

**8. Custom GA4 Events.** Every meaningful action is tracked as a named event in Google Analytics: form submissions, booking completions, outbound clicks to Jean School, scroll depth on key pages. This goes far beyond standard pageview tracking and gives a granular picture of how visitors interact with every part of the site.

---

## 5. What Makes This Different

| | A Typical Webflow Website | The Denim City Platform |
|---|---|---|
| **Pages** | Static pages with contact form | 15+ dynamic pages with CMS, structured data, and LLM-optimized content |
| **Booking** | "Email us to book" | Native booking engine with calendar, automated confirmations, and reminders |
| **CRM** | None -- leads go to an inbox | 9 automated pipelines, contact tagging, lead scoring, and follow-up sequences |
| **Abandoned visitors** | Gone forever | Retargeted on social media and Google; abandoned bookings recovered by email |
| **In-store customers** | Completely disconnected | POS-to-CRM bridge with brand-based tagging and automated cross-sell |
| **AI visibility** | Not considered | Every section written to be cited by ChatGPT, Perplexity, and Google AI |
| **Search performance** | Basic SEO | Schema.org markup (FAQ, Course, LocalBusiness, Event), Search Console monitoring |
| **Analytics** | Google Analytics pageviews | GA4 custom events, heatmaps, attribution tracking, conversion funnels |
| **Post-visit follow-up** | Manual, if it happens | Automated sequences: feedback, upsell, cross-sell, re-engagement, VIP treatment |
| **Content updates** | Need a developer | Team edits directly in Webflow CMS -- events, brands, pricing, press |

A typical Webflow website is a brochure. The Denim City platform is a business system that works while the team sleeps.

---

## 6. The Missing Piece -- Your 11th Audience

We have mapped 10 distinct audiences that the platform serves, each with their own entry point, journey, and conversion path. But there is likely an 11th that we have not yet defined.

Some candidates to consider:

- **B2B brand clients needing lab and production services** -- brands that need ongoing wash development, sampling, or small-batch production. Not a one-time inquiry but a recurring relationship. This may deserve its own pipeline and nurture strategy separate from the general Lab/Atelier flow.

- **Press and media** -- journalists, bloggers, documentary makers, and content creators who amplify Denim City's story to large audiences. The Press page and pipeline exist, but is this audience large and strategic enough to be treated as a distinct ICP with its own conversion goals?

- **Tour operators and travel platforms** -- companies that package Amsterdam experiences for tourists. If Denim City appears on GetYourGuide, Viator, or in hotel concierge recommendations, that is a distribution channel with its own logic.

- **Corporate HR and team-building organizers** -- companies booking the Make Your Own Bag workshop or a private tour as a team activity. This audience books differently (invoicing, group coordination, dietary needs for catering) and may need a distinct intake flow.

Mariette, this is a question for you and the team: which of these (or which other audience) represents real revenue and strategic value? Once confirmed, we build the 11th path into the platform -- same depth, same automation, same care as the other ten.

---

*This document describes the platform as designed. Some components (particularly the Lightspeed-to-GHL integration and advanced cross-sell automations) are Phase 2 and Phase 3 deliverables. The architecture for all of it is being built from day one.*
