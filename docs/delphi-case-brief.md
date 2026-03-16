# Delphi.ai — Case Brief: Denim City
**Prepared for: Call with Delphi.ai team**
**Context: Peter Lubbers / Sales Accelerator build for Denim City Amsterdam**

---

## 1. What Denim City Is

Denim City is Amsterdam's denim innovation hub, located inside De Hallen. It is run by the House of Denim Foundation under the mission "Towards a Brighter Blue." Under one roof: a retail store, a sustainable laundry R&D lab, guided tours, education programs (Academy, Jean School, Incubator), jeans repair, venue rental, and a growing B2B and grants business.

**The core problem:** The brand has deep expertise, real authority, and 5+ distinct revenue streams — but zero digital infrastructure to capture or convert interest. No CRM, no booking system, no follow-up. Two websites that are brochures. The build we are delivering changes that entirely.

**The digital platform being built:** Webflow website + GoHighLevel CRM with 9 automated pipelines + Lightspeed-to-GHL integration via Make.com. This is a full sales accelerator, not a website.

**Delphi sits on top of this system as the intelligence layer.** It is not decoration — it solves the single biggest conversion problem the site has: the gap between curiosity and commitment.

---

## 2. Why Delphi — The Specific Problem It Solves

Denim City serves at least 10 distinct audiences: tourists, DMCs, brands, repair customers, students, corporate teams, grant funders, press, venue renters, and collectors. A single website cannot have a different conversation with each of them. A staff member cannot be available at 11pm when a Berlin brand manager lands on the Lab page.

**Delphi solves this with a 24/7 concierge that:**

1. **Routes and qualifies** — "What brings you here?" routes a tourist differently from a travel agency, a student differently from a brand. No hard gates, just intelligent conversation.
2. **Answers the questions that delay bookings** — group sizes, pricing, what's included, languages, accessibility, Nudie free repair eligibility, Lab capabilities, course levels. These are known questions with known answers. Delphi handles them so the team doesn't have to repeat themselves 40 times a day.
3. **Captures leads into GHL** — every visitor who engages with Delphi and shares contact details becomes a tagged GHL contact, automatically routed to the right pipeline.
4. **Speaks with earned authority** — Denim City has access to some of the most knowledgeable people in the global denim industry: Andrew Olah (Kingpins), Adriano Goldschmiedt (Canatiba), Tony Tonnaer (Kings of Indigo), Momotaro. No other brand can train an AI concierge with this depth.
5. **Works in any language** — Denim City attracts Japanese tourists, Brazilians, Germans, Americans. Delphi responds in the visitor's own language without extra build.

---

## 3. The Content Pipeline — How We Feed Delphi

**The pipeline:** Voice → Transcript → Upload

Peter has a voice survey tool that generates question sets in 5 minutes. The Denim City team and their expert network answer by speech. Answers come back as transcripts. Those transcripts upload to Delphi.

**What Delphi accepts (confirmed):**
- PDF and text documents
- Audio files
- Video (uploaded or YouTube links)
- Website URLs
- Google Docs / markdown

**Content phases, in order:**

| Phase | Content | Source |
|---|---|---|
| 1 — Foundation | Master FAQ, services + pricing, course catalog, Amsterdam logistics | Written documents |
| 2 — Voice & Personality | Staff interviews, tour guide sessions, repair atelier stories | Voice survey → transcript |
| 3 — Industry Authority | Andrew Olah, Adriano Goldschmiedt, Tony Tonnaer, Nudie founder | Voice survey → transcript |
| 4 — Craft Depth | Momotaro interview, Japanese denim context documents | Voice survey → transcript |
| Ongoing | Reviews, press, testimonials, course updates | Batches / automated |

**Question for Delphi team — content pipeline:**
- What is the optimal format for uploading interview transcripts — plain text, structured Q&A, or unstructured conversational flow?
- Does uploading both the audio file AND the transcript of the same interview meaningfully improve training quality?

---

## 4. GHL Integration — Questions to Confirm

Delphi.ai is mentioned in multiple sources as supporting GoHighLevel as a CRM sync destination. **We need to confirm the exact mechanics before building the architecture around it.**

**Architecture note — two entities, two flows:**
Denim City operates two separate legal and financial entities. In-store purchases run via Lightspeed Retail → Exact (accounting — untouched). Course bookings run via GHL calendar → Moneybird (invoicing for the education entity, automated via Make.com). Delphi feeds into GHL on both sides: a repair or tour lead becomes a GHL contact via Delphi → GHL sync; a course inquiry either books directly via GHL calendar or routes there as a tagged lead. Delphi does not touch financial systems — it captures intent and identity, GHL handles the rest.

**The desired flow:**

```
Visitor starts conversation with Delphi on website
        ↓
Delphi qualifies interest (tour / course / repair / B2B / lab / funding)
        ↓
Delphi collects name + email (or phone)
        ↓
GHL contact created automatically
        ↓
Contact tagged by type → GHL pipeline automation picks up and runs the correct sequence
```

**Questions to confirm with Delphi team:**
1. Is the GHL sync confirmed and live? One-way (Delphi → GHL) or bi-directional?
2. Can we define custom tags in Delphi that map directly to GHL pipeline triggers?
3. Can Delphi pass a conversation summary into the GHL contact notes field — not just name/email?
4. Can different embed instances (widget on Tours page vs. Lab page) pass different default tags to GHL automatically?
5. Is there a webhook option for more granular control beyond the native sync?

---

## 5. Calendar Integration — Can Delphi Connect to GHL Booking?

This is a critical question. Denim City's platform includes a GHL booking calendar for tours and courses. The ideal concierge flow ends not just with lead capture, but with an actual booking.

**The ideal scenario:**

```
Visitor: "I want to book a Make Your Own Jeans course for two people in April."
Delphi: "Great — let me check availability." → queries GHL calendar → shows open slots → visitor picks a date → booking confirmed.
```

**Questions to confirm with Delphi team:**
1. Can Delphi connect to an external booking calendar (GHL calendar) to check availability in real time?
2. Can Delphi complete a booking — or does it hand off to a booking link / embedded widget?
3. If direct calendar integration is not possible: what is the recommended handoff? (e.g., Delphi passes a pre-filled booking URL, or drops the lead into GHL where a follow-up sequence sends the booking link)

**Fallback if calendar integration is not available:** Delphi captures the intent and contact details → GHL creates the contact and immediately sends a booking link via automated email/SMS. Not as seamless, but fully workable.

---

## 6. UX/UI and Conversion — What Delphi Can Do That We Haven't Built Yet

### 6.1 Page-Context as a Trigger

Delphi knows which page the visitor is on. The widget opening line must change per page. Not a generic "How can I help?" but a question that matches the visitor's current intent:

| Page | Delphi opening line |
|---|---|
| Tours | *"Thinking about a tour? I can tell you what to expect and help you pick the right one."* |
| Education | *"Not sure which course fits you? Tell me your level and what you want to make."* |
| Repairs | *"Tell me what's wrong with your jeans — I'll tell you if we can fix it and what it costs."* |
| Lab & Atelier | *"Working on a project? Tell me about it — I can tell you if the Lab is the right fit."* |
| Homepage | *"First time here? Tell me what brings you — I'll point you in the right direction."* |
| B2B / Collaborate | *"Looking to work with us? Tell me about your project or group — I'll find the right path."* |

This is not a technical challenge — it is copywork per embed instance. But it is the difference between a chatbot that gets ignored and one that gets clicked.

**Question for Delphi team:** Can different embed instances carry different default opening lines and context tags, configured per page?

---

### 6.2 ICP Recognition in the First Exchange

Delphi must know within 1–2 messages who it is talking to. The smartest method: don't ask "are you a consumer or a business?" — ask the question whose answer reveals the type:

*"What brings you to Denim City?"*

- Tourist: *"I'm visiting Amsterdam next month."* → Tour-mode: pricing, languages, what's included, booking link.
- DMC: *"We organise group travel for corporate clients."* → B2B-mode: commission structure, group minimums, invoicing, how to send a test group.
- Student: *"I want to learn to make my own jeans."* → Course-mode: beginner vs. advanced, duration, what you take home, booking.
- Brand: *"We're looking for a sustainable production partner."* → Lab-mode: atelier capabilities, minimum runs, R&D process, inquiry form.
- Repair customer: *"I have a pair of jeans with a broken zip."* → Repair-mode: triage, Nudie/KOI check, price estimate, booking slot.

This lives entirely in Delphi's system prompt and persona instructions — no extra build required.

---

### 6.3 The Repair Flow as a Conversion Machine

This is the highest-ROI Delphi use case that has not yet been explicitly mapped.

Someone searching "jeans repareren Amsterdam" has high intent. They land on the Repairs page. Delphi opens with:

*"Tell me what's wrong — I'll tell you if we can fix it and how long it takes."*

The conversation:
1. Visitor describes the problem (zip, seam, hem, customization, unsure)
2. Delphi asks: *"Is it a Nudie or KOI garment?"* — triggers the free repair route if yes
3. Delphi gives a rough price range and turnaround estimate
4. Delphi asks: *"Want me to book you in, or would you prefer to walk in?"*
5. If booking → calendar integration (if confirmed) or booking link sent via GHL automation

This is a complete sales funnel inside a single chat conversation. No form, no phone call, no friction.

---

### 6.4 Exit-Intent Proactive Trigger

Someone browses the course page, spends 90 seconds, and moves to leave without booking. At that moment Delphi appears proactively:

*"Before you go — any questions I can answer? Most people book after one conversation."*

This catches the hesitators — the largest and most recoverable lost segment on any conversion page.

**Question for Delphi team:** Does Delphi support proactive / exit-intent triggers, or is it always visitor-initiated?

---

### 6.5 Post-Booking Touchpoints

Delphi does not have to disappear after the first conversation. Confirmation emails sent by GHL can include a Delphi link for pre-visit questions:

*"Have questions before your course? Ask here — available 24/7."*

This reduces no-shows (people who didn't fully understand what they signed up for) and increases satisfaction on arrival.

---

## 7. Alternatives Considered

| Tool | GHL Integration | Knowledge depth | Personality / Brand voice | Calendar booking |
|---|---|---|---|---|
| **Delphi.ai** | Reported native sync — to confirm | High — trains on audio, video, docs | Core product feature | To confirm |
| **Botpress** | Confirmed native integration | Good — knowledge base + custom flows | Requires configuration | Via GHL natively |
| **GHL Conversation AI** | Native (built-in) | Limited FAQ upload | Generic | Yes — fully native |
| **Voiceflow** | Via webhook / Zapier | Good — multi-channel | Neutral | Via webhook |

**Why Delphi is the right tool for Denim City:** The brand's edge is knowledge and personality — founding figures of the global denim industry, craft philosophy, deep sustainability expertise. Delphi is the only tool designed specifically to train an AI on that kind of expertise and deliver it in a consistent brand voice. Botpress can do routing and GHL integration cleanly — but it cannot make an AI that sounds like it genuinely knows denim. GHL's own Conversation AI is the cheapest option but the least capable for knowledge-intensive use.

**If the GHL integration or calendar integration turns out to be missing from Delphi:** Botpress + GHL native is the fallback. Less personality, more control.

---

## 8. Pricing and Agency Structure

**Questions for Delphi team:**
1. Which Delphi tier supports: website embed + GHL sync + multi-language + sufficient knowledge upload capacity for 10+ hours of interview audio?
2. Is there an agency or white-label option — Peter builds and manages this for the client. Is there a reseller or partner structure?
3. How is pricing structured as the knowledge base grows over time?

---

## 9. The Value Case in One Paragraph

Denim City currently has no digital way to answer a question, qualify a lead, or start a relationship outside business hours. Every visitor who arrives curious and leaves without booking is a lost conversion — and most leave because the gap between "interesting" and "committed" is too wide to cross alone. Delphi bridges that gap in real time, in any language, with the depth of knowledge that makes the brand worth trusting. Every lead it captures feeds directly into GHL, where automation takes over. The result: a system that converts interest into bookings while the team sleeps, and gets smarter every month as more expert content is uploaded.

---

*Document prepared by Peter van Rhoon. For internal use and Delphi.ai onboarding call.*
