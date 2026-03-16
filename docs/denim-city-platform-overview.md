# Denim City — The Sales Machine
**Prepared for Mariette, James, and the Denim City team**
**SuperStories BV | March 2026**

---

## 1. What We Are Actually Building

Most agencies build websites. We build sales machines.

A website shows people who you are. A sales machine brings people in, qualifies them, routes them to the right experience, books them, follows up automatically, asks for a review at exactly the right moment, brings them back, and turns one visit into a long relationship — while the team is focused on delivering great experiences, not chasing leads.

That is what Denim City is getting.

Here is what that means in practice: when someone in Tokyo asks ChatGPT "Where can I learn to make jeans in Amsterdam?", this system makes sure Denim City is the answer. When a DMC lands on the site at 11pm looking for a group experience to add to their Amsterdam program, the AI concierge is there to answer their questions and capture their details. When a tourist finishes a tour and is still buzzing from the experience, an automated message reaches them two hours later with a direct link to leave a Google review — at the exact moment they are most likely to write one. When a flyer handed out at a denim trade fair sends someone to a landing page, the UTM code tells us exactly which event drove the visit. When a brand manager fills out a lab inquiry form, the system routes it to the right person, sends a confirmation, and follows up automatically if nobody responds within 48 hours.

Every part of this system has a job. Nothing is decorative. And unlike a website, this system is measurable: after 60 days, we can show exactly how many leads came in, which type they were, which channel brought them — online and offline — and how many converted into bookings or revenue.

---

## 2. The Eight Layers of the System

### Layer 1 — The Website (Webflow)

The public face. Every page from Home to Store to Education to Lab & Atelier to Tours to Collaborate, plus the Denim Dates events calendar, FAQ, Press, Venue Rental, and Contact. Designed mobile-first, loads in under 2.5 seconds, and built so the Denim City team can update content — events, brands, pricing, press — without needing a developer.

But the website is more than pages. Every section is written to answer a specific question a real person would ask: "Do you repair jeans from any brand?" "Can you produce a capsule collection?" "How much does the Make Your Own Jeans course cost?" Search engines reward pages that answer real questions. So do AI assistants.

**Dutch-language pages:**
Amsterdam is a mixed-language city. Expats make up a significant share of the population, and the tourist audience is international by definition. English is not a barrier for most visitors to the Tours, Lab, or Store pages. However, two audiences skew towards Dutch: repair customers and course seekers. For repairs, the audience is roughly 50/50 Dutch-speaking and English-speaking — expats and tourists get jeans repaired too. For courses, the same split applies. Critically, Dutch and English are not either/or: they are two separate SEO channels. A Dutch Repairs page ranks for "spijkerbroek repareren Amsterdam"; the English page ranks for "jeans repair Amsterdam." Both audiences exist. Having both versions doubles the search surface.

Pages to build in Dutch:
- **Repairs** — highest priority. Strong local and expat search volume in Dutch.
- **Education / Courses** — second priority. Mix of Dutch-speaking students and internationals.
- **Contact** — low effort, high trust signal for Dutch-speaking visitors.
- **FAQ** — Dutch FAQ answers appear in Dutch Google results as rich snippets.

Pages to keep English-first:
- **Tours** — international tourist audience. English is the expected language.
- **Lab & Atelier** — B2B, international. English is the industry standard.
- **Collaborate / Press** — international audiences only.

Webflow Localization (paid add-on) handles this cleanly — one CMS, two language versions per page, no duplicate management overhead.

### Layer 2 — The AI Concierge (24/7 Intelligence Layer)

This is the layer most websites do not have. Denim City serves more than 10 distinct audiences — tourists, DMCs, repair customers, students, brand partners, corporate teams, grant funders, venue renters, collectors, and press. A single website cannot have a different conversation with each of them. A staff member cannot be available at 11pm.

The AI concierge can.

Embedded on every page of the website, the concierge opens with a question tailored to where the visitor is. On the Tours page: "Thinking about a tour? I can tell you what to expect and help you pick the right one." On the Repairs page: "Tell me what's wrong with your jeans — I'll tell you if we can fix it and what it costs." On the Lab page: "Working on a project? Tell me about it — I can tell you if the Lab is the right fit."

Within two exchanges, the concierge identifies what type of visitor it is talking to. A tourist gets tour information, pricing, and a booking link. A DMC gets commission structure, group minimums, and a direct contact route. A student gets course options matched to their level and goals. A brand gets lab capabilities and a project scoping flow.

Every visitor who engages and shares their details becomes a tagged contact in GHL — automatically routed to the correct pipeline, with a conversation summary in their contact notes. The team wakes up to qualified leads, not blank inquiry forms.

The concierge responds in the visitor's language automatically: Dutch, English, Portuguese, Japanese, German — no extra build required.

**WhatsApp integration:** High-intent visitors — especially repair customers and B2B inquiries — can reach the team via WhatsApp Business directly from the website. WhatsApp conversations are logged to GHL alongside concierge conversations. For markets where WhatsApp is the primary communication channel (Brazil, Japan, Germany), this is not optional.

### Layer 3 — The CRM and Automation Engine (GoHighLevel)

Behind every form, every booking button, and every concierge conversation sits GoHighLevel — the operational brain. There are **9 dedicated pipelines**, each handling a different type of contact:

1. **Tours B2C** — booking, confirmation, reminder, post-tour follow-up, review request, course conversion
2. **Tours B2B / DMC** — group inquiry, contract, nurture sequence with agency-specific content
3. **Courses** — enrollment, confirmation, reminder, feedback, upsell to next level, certificate
4. **Repairs** — intake, appointment confirmation, reminder, post-repair follow-up, review request
5. **Lab & Atelier** — inquiry, project scoping, quote, tracking
6. **Partnerships** — inquiry, discovery, proposal, long-term nurture
7. **Venue Rental** — inquiry, availability, quote, contract, follow-up
8. **Funding / Grants** — relationship management, reporting reminders, renewal tracking
9. **Repair B2B** — Nudie / KOI brand partner pipeline

Every pipeline has automated confirmations, reminders, follow-up sequences, and escalation triggers. If someone starts booking a course but does not finish, recovery emails go out at 1 hour, 24 hours, and 72 hours. If a lab inquiry sits without a response for 48 hours, the system escalates it internally. If a tour guest does not leave a review, a second request goes out 72 hours later.

**Referral mechanics:** Word of mouth is already happening at Denim City. People who make their own jeans tell their friends. Repair customers who are surprised by the quality tell their colleagues. The system captures this and turns it into a structured, automated channel.

Seven days after a tour and fourteen days after a course — once the experience has settled and the review has been requested — every guest receives a personal message. Not a promotional email. A direct, warm note: if you know someone who would love this, tell them to book and mention your name. You both get 10% off.

When the referred person books and enters the referrer's name, the system identifies the referrer in GHL and automatically sends their reward. The referrer does not need to chase it. The new guest does not need a code. The team does not need to remember to do anything.

For B2B — DMCs, travel agencies, corporate bookers — the reward is different: preferential commission on their next group booking. The trigger is the same: after a successful collaboration, a personal message goes out at exactly the right moment.

A referral programme does not need to be complex to be effective. The most powerful version is the simplest one: a personal ask, sent at the moment of maximum satisfaction, with an immediate reward for both sides. That is what is built here.

None of this requires anyone on the team to remember to send an email.

### Layer 4 — The Review and Reputation Engine

Reviews are not a passive byproduct of good experiences. They are a distribution channel. A Denim City with 500 five-star Google reviews and a top-10 TripAdvisor ranking in Amsterdam reaches tourists who have never heard of the brand — for free, every day.

The platform treats reviews as an active, automated process:

**The post-visit sequence:**
- T+2 hours after tour end: SMS to the tour booker with a direct link to the Google review form. SMS, not email — open rate is above 90%, and the emotional peak from the tour is still fresh.
- T+24 hours: email follow-up with the same link, plus the Denim Dates newsletter signup and a small store discount as a thank-you.
- T+72 hours: if no review yet, a second gentle nudge — this time pointing to TripAdvisor.

**NPS routing:**
Every post-visit NPS question is routed by score. A 9 or 10 goes straight to a review request. A 7 or 8 goes to a feedback form. A 6 or below creates an internal task for a team member to personally follow up — the negative response never triggers a marketing sequence.

**TripAdvisor:**
For tourists making decisions about Amsterdam experiences, TripAdvisor ranking matters. A Denim City consistently appearing in the top experiences in Amsterdam — with recent, substantive reviews — generates bookings from visitors who discovered Denim City nowhere near the website. The post-visit automation feeds TripAdvisor with fresh review volume alongside Google.

**Google Business Profile:**
Optimised as a full sales asset — not just an address listing. Services listed by category, photos updated regularly, Q&A section populated with the most common visitor questions, booking button connected to the GHL calendar, and review responses managed systematically. A well-maintained GBP profile is how Denim City shows up in "things to do in Amsterdam" map results — which is where most tourists make decisions.

**Press mentions as social proof:**
Every piece of press coverage — FD, NRC, Vogue NL, international fashion and travel media — feeds back into the website, the concierge knowledge base, and the nurture sequences. Press mentions build trust at every stage of the funnel, not just at the top.

**LinkedIn recommendations:**
For B2B clients — DMCs, corporate teams, fashion schools, brand partners — a LinkedIn recommendation from a satisfied client carries more weight than any marketing copy. The B2B pipeline includes a post-project request for a LinkedIn recommendation, sent at the moment the collaboration concludes successfully.

### Layer 5 — The B2B and LinkedIn Channel

The highest-value leads for Denim City — DMCs, corporate HR teams, fashion schools, denim brands, Lab collaboration partners — do not behave like consumers. They research on LinkedIn, they ask colleagues for referrals, and they make decisions slowly. The platform serves them through a dedicated channel.

**LinkedIn presence:**
A structured LinkedIn content strategy positions Denim City and House of Denim Foundation as the authority voice in sustainable denim innovation and experience. Content is not promotional — it is educational and perspective-driven: what zero-waste denim finishing actually means in practice, how Denim City's lab works, what a DMC's clients say after a group visit. This content reaches exactly the people who make B2B decisions.

**B2B lead capture from LinkedIn:**
LinkedIn posts that generate engagement drive traffic to the /travel-professionals or /collaborate pages, where a dedicated intake form routes directly into the appropriate GHL pipeline. UTM parameters track which LinkedIn content drives actual inquiries.

**B2B nurture sequence:**
B2B leads in GHL receive a different sequence from consumer leads. Not "here is what is happening at Denim City this month" — but: what other travel professionals say about working with Denim City, how a test group booking works, who their dedicated contact is. The sequence is built for a B2B sales cycle, not a consumer impulse purchase.

### Layer 6 — Retargeting and Recovery

Most visitors do not convert on their first visit. The platform has two systems that bring them back.

**Retargeting (paid):**
Meta and Google Ads pixels are installed on every page. Audiences are built automatically from visitor behaviour:
- Visited Tours page but did not book → sees tour content in Instagram feed within 24 hours
- Visited Education page → sees course content on Google search and YouTube
- Completed a tour booking → excluded from acquisition campaigns, added to course retargeting
- GHL contact data uploaded as a custom audience → lookalike audiences built for prospecting

The retargeting audiences are kept warm at a low daily budget. When Denim City runs a promotion or opens a new course, the warm audience is the first to see it — at a fraction of the cost of cold acquisition.

**Abandoned booking recovery (automated):**
If someone starts a booking or inquiry form and does not complete it, GHL sends recovery emails at 1 hour, 24 hours, and 72 hours. This alone recovers a meaningful percentage of lost bookings with no additional ad spend.

**Paid search — bridge strategy (Google Ads):**
SEO takes 3 to 6 months to build ranking. During that window, a small Google Ads budget on high-intent search terms fills the gap immediately. The terms are narrow and the intent is high: "jeans repair amsterdam", "make your own jeans amsterdam", "denim workshop team building", "venue rental de hallen." A daily budget of €5 to €10 on a tightly controlled set of keywords is enough to generate consistent traffic from day one while organic rankings build. Once organic positions are established for a term, the paid spend on that term is turned off. This is not a permanent ad strategy — it is a launch bridge.

### Layer 7 — Search and AI Visibility

**Traditional SEO — with tracking:**
Every page is built around the questions people actually search for. "Jeans repair Amsterdam." "Make your own jeans course Amsterdam." "Denim workshop team building." "Sustainable denim lab Netherlands." Each of these is a page, optimised for that intent, with Schema.org structured data so Google knows exactly what it is.

Schema types in use:
- `FAQPage` — FAQ answers appear directly in Google search results
- `Course` — course pages appear in Google's course listings
- `LocalBusiness` — opening hours, address, and category appear in map results
- `Event` — Denim Dates events appear in Google's event panels

SEO without tracking is guesswork. Google Search Console is configured from day one — tracking which pages appear in search results, for which queries, and what their click-through rate is. This is where we identify which pages are earning positions and which ones need more content. For deeper keyword tracking and competitor monitoring, Ahrefs or a comparable tool is used to track Denim City's ranking on the 20-30 priority search terms over time. Without this data, SEO is invisible.

**Behaviour analytics (Microsoft Clarity):**
Three tools form the complete analytics picture. Each answers a different question:

| Tool | The question it answers | Cost |
|---|---|---|
| **Google Analytics 4** | *What* — traffic volumes, conversions, channel attribution, revenue per pipeline | Free |
| **Google Search Console** | *Where* — which queries surface Denim City pages, click-through rates, ranking positions | Free |
| **Microsoft Clarity** | *Why* — session recordings, heatmaps, scroll maps, rage clicks — where and why visitors stop | Free |

GA4 tells you how many people visited the Tours page and how many started the booking form. It does not tell you why they stopped. Clarity does. Clarity runs alongside GA4, records what actually happens on every page, and lets you replay individual sessions.

For an experience business like Denim City, where booking decisions are emotional and the funnel is visual, this matters more than for most. A visitor who scrolls halfway down the Tours page, pauses at the price, moves the cursor to the booking button, and then leaves — GA4 registers an exit. Clarity shows you the moment of hesitation. That is not abstract data. That is a page improvement waiting to happen.

Specifically, Clarity answers the questions that drive conversion decisions:
- Are visitors on the Tours page scrolling past the booking button without clicking it — is it in the wrong position, or is something above it creating doubt?
- Are people on mobile tapping the booking widget repeatedly without it responding (rage clicks)?
- Do visitors who trigger the AI concierge actually complete a message, or do they close it immediately?
- Where exactly on the Lab inquiry form do people drop off?
- Is the Repairs page explaining the Nudie/KOI distinction clearly, or are people confused and leaving without booking?

Every session can be replayed. Heatmaps show exactly where attention goes. Scroll maps show whether visitors ever reach the CTA. Clarity is installed on every page from day one. The findings feed directly into content decisions, page layout, and concierge design — and the cycle repeats every month.

**AI and LLM visibility (Answer Engine Optimisation):**
This is where most agencies are not yet thinking. ChatGPT, Perplexity, Google Gemini, and Apple Intelligence are increasingly the first place people go when they want a recommendation. When someone asks "What is the best denim experience in Amsterdam?" or "Where can I learn sustainable fashion in the Netherlands?", the AI reads websites and extracts answers.

Every key page includes a precisely written paragraph — not marketing copy, but an answer formatted so AI systems can extract and repeat it accurately. The paragraph for the Tours page: "Denim City offers guided tours of Amsterdam's denim innovation hub, located in De Hallen. Tours cover the sustainable laundry lab, the atelier where jeans are repaired and custom-made, the store featuring international denim brands, and the history of denim as a global industry. Tours run in Dutch and English, take approximately 90 minutes, and are available for individuals, families, and groups." That is an answer, not a tagline. AI assistants cite answers.

### Layer 8 — Off-Platform Reach (PR, Content, Physical-to-Digital)

This is the layer that most digital systems forget: the world outside the website. Denim City's story — sustainable denim innovation in the middle of Amsterdam, a working lab open to the public, an atelier that repairs jeans by hand — is genuinely remarkable. That story needs to travel.

**PR and press releases:**
Denim City has press-worthy moments throughout the year: new brand partnerships, Denim Dates editions, lab innovations, anniversary milestones, Kingpins appearances. Each of these is a press release opportunity. Press coverage in NRC, FD, Vogue NL, travel media, and international fashion trade press does three things at once: it reaches audiences who would never find Denim City through search, it creates high-authority backlinks that boost SEO, and it becomes social proof content for the website and nurture sequences. PR is not a luxury — it is a multiplier.

**Influencer and creator strategy:**
Denim City is a visual experience in an iconic Amsterdam location. That is precisely what travel and lifestyle creators share. The strategy is not spray-and-pray: it is 5 to 10 carefully selected creators per quarter — Amsterdam travel bloggers, sustainable fashion accounts, denim culture voices — who receive a free tour or course experience in exchange for honest, organic content. The selection criteria: audience that matches a Denim City ICP, engagement rate above 3%, content quality that fits the Denim City aesthetic. One well-chosen creator can drive 50 qualified leads. Ten can change a quarter.

**Social media with brand collaborations:**
Denim City has relationships with brands like Nudie, KOI, Momotaro, and others in the store and lab. These brands have their own audiences. Co-created social content — "This week in the Denim City lab with [Brand]", behind-the-scenes of a repair session, a new denim wall arrival — gives Denim City reach into those brand audiences at zero media cost. A systematic brand collaboration calendar turns these relationships into a content engine.

**Physical-to-digital bridge (UTM QR codes):**
Every physical touchpoint — flyers at trade fairs, posters at De Hallen, brochures handed to tour guests, business cards, event programmes, press packs — carries a QR code linked to a UTM-tagged URL. When someone scans a flyer from Kingpins Amsterdam and books a tour three days later, the system knows. Without UTM QR codes on physical materials, offline marketing is invisible in the analytics. With them, every flyer is a measurable acquisition channel.

**De Hallen partnership:**
Denim City is a tenant of one of Amsterdam's most visited cultural destinations. De Hallen attracts locals and tourists independently — it has its own website, its own newsletter, its own social channels, and its own foot traffic. Being listed as an attraction on the De Hallen website, included in their newsletter, and featured in their programming creates a consistent referral source that costs nothing beyond the relationship. A brochure rack at the De Hallen entrance, a mention in their visitor guide, a joint Denim Dates event that they promote to their audience — these are distribution channels that most tenants leave completely untapped.

**Instagram and TikTok — organic discovery:**
Currently the Meta pixel is used for retargeting people who have already visited the site. That is only half of what these platforms can do. Instagram and TikTok are discovery platforms — they surface content to people who have never heard of Denim City. The laser denim washing machine, a hand repair in the atelier, 200 brands on the denim wall, a student's first self-made pair of jeans — this is content that performs organically, without paid promotion. TikTok's algorithm in particular gives new accounts significant reach based on content quality alone, not follower count. A consistent posting rhythm of 3 to 4 pieces of behind-the-scenes content per week turns the daily activity of the team into an acquisition channel.

**Hotel concierge and Airbnb Experiences network:**
Amsterdam's boutique hotels and short-stay operators are standing recommendation engines for their guests. A concierge at a design hotel in the Jordaan or the Pijp recommends experiences to guests every single day. Getting Denim City on that recommendation list — through a personal visit, a well-designed leave-behind brochure with a QR code, and a relationship with the front desk — generates a consistent stream of warm, high-intent tourist traffic. Twenty hotels recommending Denim City once a week is 1,000 warm referrals per year. Airbnb Experiences is a related channel: Denim City tours listed there appear directly to Airbnb guests planning their Amsterdam stay.

---

## 3. How the Platform Serves Each Audience

Denim City serves more than 10 distinct audiences. The website is one unified experience for everyone — no confusing routing — but behind the scenes, every audience has a tailored path through the system.

**International Tourists** find Denim City through Google Maps, TripAdvisor, travel blogs, or AI assistants. They land on Tours, book through the embedded calendar, receive a confirmation and reminder, and after the visit get a review request via SMS followed by a course invitation via email.

**DMCs and Travel Agencies** find Denim City through LinkedIn, trade networks, or Google searches for Amsterdam group experiences. They land on the dedicated B2B page, fill out a group inquiry form, enter the Tours B2B pipeline, and receive a professional nurture sequence built for a B2B sales cycle.

**Corporate Teams** find Denim City through LinkedIn or event agency recommendations. The Make Your Own Bag workshop and private tours are positioned as team activities. Their booking needs invoicing and group coordination — the pipeline handles this automatically.

**Course Seekers** find the Education page through search or word of mouth. The concierge helps them identify the right course for their level. After booking, they receive reminders, course access information, and a post-course feedback request with a cross-sell to the next level.

**Repair Customers** search "jeans repair Amsterdam" and land on the Repairs page. The concierge triages their repair — brand, type of damage, Nudie or KOI eligibility — and routes them to book an appointment or walk in. The repair pipeline confirms, reminds, and follows up with a review request.

**Denim and Fashion Students** find the Education page through school recommendations or search. The platform serves schools booking group visits, individual students choosing between the Academy, Jean School, and Incubator, and designers looking for archive access.

**Brand and Lab Partners** find the Lab & Atelier page through LinkedIn, the Kingpins network, or industry referrals. The concierge qualifies their project scope and routes them into the Lab pipeline. A professional follow-up sequence positions Denim City as a serious production and R&D partner.

**Grant Funders and Government Partners** are managed through the Funding pipeline — a relationship management system, not a sales funnel. The team receives reminders when reporting deadlines approach and when renewal windows open.

**Venue Renters** discover the Venue Rental page through event searches. An inquiry form routes to the Venue pipeline with an automated quote process.

**In-Store Customers** are captured at the point of sale via Lightspeed. When they opt in for a digital receipt, their contact enters GHL tagged by purchase. A Nudie buyer gets a repair reminder at six months. A Denim City Originals buyer gets a course invitation at two weeks. The store becomes a CRM entry point.

---

## 4. The Conversion Layers

Getting visitors to the platform is only half the job. The system has 12 layers working to convert interest into revenue:

1. **AI concierge** — answers the questions that delay decisions, at any hour, in any language
2. **WhatsApp Business** — for high-intent visitors who prefer messaging over forms
3. **Exit-intent trigger** — proactive message when a visitor is about to leave without booking
4. **Abandoned booking recovery** — automated emails at 1h, 24h, 72h for incomplete bookings
5. **Retargeting** — warm audiences on Instagram, Facebook, and Google for visitors who left
6. **Post-visit review automation** — SMS at T+2h captures reviews at peak emotional moment
7. **NPS routing** — negative responses routed to personal follow-up, not to marketing sequences
8. **Cross-sell sequences** — tour guests become course students; repair customers become Academy students
9. **Referral mechanics** — graduates and satisfied B2B clients become active referrers
10. **Micro-conversion capture** — Denim Dates newsletter signup captures visitors not yet ready to book
11. **Social proof** — real testimonials, press mentions, and review scores on every conversion page
12. **Attribution tracking** — UTM parameters on every campaign and every physical touchpoint, custom GA4 events on every action — the team always knows which channel drives actual revenue

---

## 5. What Makes This Different

| | A Typical Webflow Website | The Denim City Sales Machine |
|---|---|---|
| **Availability** | Business hours only | AI concierge available 24/7 in 5 languages |
| **Booking** | "Email us to book" | Native calendar, automated confirmations, recovery emails |
| **Lead routing** | All leads go to one inbox | 9 pipelines, tagged by type, automated follow-up per segment |
| **Abandoned visitors** | Gone forever | Retargeted on social + Google; bookings recovered by email |
| **In-store customers** | Completely disconnected | POS-to-CRM bridge, brand-tagged, automated cross-sell |
| **Reviews** | Passive — hoped for | Automated at the peak moment, routed by NPS score |
| **B2B leads** | Same inbox as tourists | Dedicated pipeline, LinkedIn channel, B2B nurture sequence |
| **AI search visibility** | Not considered | Every page formatted so ChatGPT, Perplexity, and Gemini cite it |
| **SEO performance** | Unknown — no tracking | Google Search Console + keyword ranking tracked across 20-30 priority terms |
| **Physical materials** | No connection to digital | UTM QR codes on every flyer, brochure, and trade fair material |
| **PR and press** | Reactive — wait to be found | Proactive press releases at every milestone; press builds backlinks and trust |
| **Influencer reach** | Unplanned | Systematic quarterly programme — 5-10 creators matched to Denim City ICPs |
| **Brand social reach** | Missed | Co-created content with store and lab brands; reach into their audiences |
| **Analytics** | Pageviews | GA4 custom events + attribution to actual revenue |
| **Behaviour insight** | No visibility into why pages don't convert | Microsoft Clarity: session recordings, heatmaps, rage clicks — watch exactly where visitors drop off |
| **Content updates** | Need a developer | Team edits in Webflow CMS directly |

A typical website is a brochure. This is a system that qualifies leads, routes them to the right pipeline, follows up automatically, asks for reviews at the right moment, brings lost visitors back, tracks what is working in every channel — online and offline — and tells you exactly where the next investment should go.

---

## 6. What We Can Measure

After 60 days, the platform produces the following numbers:

- Total leads captured, by channel and by type (tourist / DMC / student / repair / brand)
- Conversion rate from lead to booking, by pipeline
- Which page generates the most concierge conversations
- Which concierge conversations convert to leads
- Review volume growth on Google and TripAdvisor
- Ranking movement on the 20-30 priority search terms (weekly)
- Which pages are appearing in Google Search Console and at what click-through rate
- Abandoned booking recovery rate
- Revenue attributed to retargeting vs. organic vs. direct vs. offline (UTM QR)
- Which LinkedIn content drives actual B2B inquiries
- Which creator or PR mention drove measurable traffic and leads
- Microsoft Clarity session data: which pages have drop-off problems, which elements are causing friction, which mobile interactions are failing — the input for every conversion improvement decision

This is the data that justifies the next investment — and the data that no standard website can produce.

---

## 7. Open Questions for Mariette and the Team

Before the platform is complete, five things need to be confirmed:

1. **LinkedIn ownership** — The B2B LinkedIn strategy requires someone on the team to review and approve content. Who owns this, and what is a realistic posting cadence?

2. **TripAdvisor** — Is the Denim City TripAdvisor listing already claimed and managed? If so, we connect the review automation to feed it systematically. If not, claiming and optimising it is a quick win.

3. **Review response** — The system generates review volume. Someone needs to respond to reviews — especially negative ones. Who on the team owns this?

4. **Creator and PR programme** — Is there budget and appetite for a quarterly creator programme? Even a small budget (hosting experiences, no paid media) can generate significant reach if the selection is right. Who approves outreach?

5. **Physical materials** — Which physical materials does Denim City currently distribute? Flyers, brochures, business cards, trade fair handouts? All of these need UTM QR codes added or replaced before the system can track offline acquisition.

---

*This document describes the platform as designed. Some components (Lightspeed-to-GHL integration, LinkedIn strategy, hotel concierge network) are Phase 2 deliverables. The architecture for all of it is built from day one.*

*Prepared by SuperStories BV | peter@superstories.com*
