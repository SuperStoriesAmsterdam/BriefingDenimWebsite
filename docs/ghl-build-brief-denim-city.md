# GHL Build Brief — Denim City
**Prepared by:** Peter van Rhoon / SuperStories BV
**For:** GHL Build Team + Project Manager
**Date:** March 2026

---

## Context for the Build Team

You may have worked on the AndreasNLP (ANLP) account. If so, you already know the patterns we're using. If not, Section 3 explains what to reuse and how.

Denim City is a denim innovation hub in Amsterdam (De Hallen). Five revenue streams: in-store retail, guided tours, education (courses), repairs, and B2B/Lab collaborations. We are building their GHL from scratch — no legacy data, no migration. Clean start.

**What we are NOT building:** a standard website-with-contact-form. This is a full sales accelerator. GHL is the operational brain behind a Webflow website. Every form, every booking, every inquiry on the site routes into GHL and triggers an automated pipeline.

**Budget is tight. The client is not AndreasNLP.** Build lean, build right, no scope creep.

---

## 1. What Needs to Be Built in GHL

### 1.1 The 9 Pipelines

Each pipeline handles a fundamentally different type of lead. Build them as separate, independent pipelines — do not combine.

| # | Pipeline | Lead source | End goal |
|---|---|---|---|
| 1 | Tours — B2C | Website booking widget | Confirmed tour booking |
| 2 | Tours — B2B / DMC | Website inquiry form | Group contract signed |
| 3 | Courses | Website booking widget | Confirmed enrollment + Moneybird invoice triggered |
| 4 | Repairs | Website intake form | Appointment booked or walk-in confirmed |
| 5 | Lab & Atelier | Website inquiry form | Project scoping call booked |
| 6 | Partnerships | Website inquiry form | Discovery call booked |
| 7 | Venue Rental | Website inquiry form | Quote sent + follow-up |
| 8 | Funding / Grants | Internal input | Reporting reminders + renewal tracking |
| 9 | Repair B2B (Nudie/KOI) | Brand partner referral | Service onboarding |

### 1.2 Key Automations Per Pipeline

**All pipelines get as standard:**
- Confirmation email on form submission / booking
- Internal notification to the right team member
- 48-hour follow-up if no response from team (escalation)
- Cart/form abandonment recovery (see Section 3)
- GDPR consent filter before any marketing email sends

**Tours B2C adds:**
- Reminder email 48h before tour
- Post-tour review request via SMS at T+2h (Google / TripAdvisor direct link)
- Post-tour email at T+24h with Denim Dates newsletter signup + store discount
- Cross-sell to course at T+3 days
- Referral invite at T+7 days (see Section 4.7)

**Courses adds:**
- Reminder email 1 week before + 24h before
- Post-booking trigger → Moneybird invoice via Make.com (see Section 4)
- Course access email 1 week before start date
- Post-course feedback request
- Cross-sell to next course level at T+7 days
- Referral invite at T+14 days (see Section 4.7)

**Repairs adds:**
- Pre-appointment reminder (24h)
- Post-repair follow-up + review request

**Tours B2B / DMC adds:**
- Separate nurture sequence (not consumer tone) — case studies, commission structure, test group offer
- Longer follow-up window (B2B sales cycle)

**Funding / Grants — different logic:**
- This is relationship management, not a sales funnel
- Stages: Prospect → Applied → In Review → Active Funder → Renewal Due
- Automations are internal reminders to the team, not emails to the funder
- Trigger: remind team 30 days before reporting deadline, 60 days before renewal window

### 1.3 Forms to Build

| Form | Pipeline it feeds | Key fields |
|---|---|---|
| Tour booking (B2C) | Tours B2C | Name, email, phone, date preference, group size, language preference |
| Tour inquiry (B2B) | Tours B2B | Name, organisation, email, group size, preferred dates, how they found us |
| Course enrollment | Courses | Name, email, phone, course selection, experience level, payment preference |
| Repair intake | Repairs | Name, email, garment brand, what's wrong (dropdown), Nudie/KOI flag, urgency, photo upload |
| Lab inquiry | Lab & Atelier | Name, organisation, email, project type, brief description |
| Partnership inquiry | Partnerships | Name, organisation, email, type of collaboration |
| Venue rental inquiry | Venue Rental | Name, email, event type, estimated guests, preferred date(s) |

---

## 2. Tag Architecture — Follow This Exactly

We use the same functional vs. segmental tag separation as the ANLP account. **Do not mix these.**

| Type | Purpose | Drives |
|---|---|---|
| **Functional** | Trigger automations, move contacts through pipelines, grant access | Workflows, conditions, pipeline stage changes |
| **Segmental** | Filter for marketing emails, reporting, smartlists | Email campaigns, audience segments |

**Naming convention:** `[pipeline]-[subtype]-[status]`

Examples:
- `tour-b2c-registered`
- `tour-b2c-post-visit`
- `course-enrolled`
- `course-abandoned-cart`
- `repair-booked`
- `repair-nudie-free`
- `b2b-dmc-inquiry`
- `b2b-dmc-contract-signed`
- `funding-active`
- `funding-renewal-due`

**Before creating any new tag:** check the master tag list. Tag naming decisions need PM sign-off. Wrong tags silently break automations.

**Create a Custom Values folder per pipeline** for dates, prices, contact names, booking links. Update once → reflects everywhere.

---

## 3. What to Reuse from ANLP — Direct Instructions

These patterns are proven. Do not rebuild from scratch — adapt from what exists.

---

### 3.1 Cart Abandonment Workflow
**ANLP equivalent:** Used on all course registrations.
**How to apply:** Any form on the Denim City site that is not completed triggers this. Specifically: course enrollment form started but no payment → tagged `course-abandoned-cart` → nurture sequence at 1h, 24h, 72h. Same for tour booking started but not completed.
**Adapt:** Copy subject lines and tone to Denim City brand (warmer, craft-focused — not NLP methodology tone).

---

### 3.2 Two Smartlists Per Pipeline
**ANLP equivalent:** 'CTF Participants' (complete) and 'CTF Incomplete Reg' (abandoned).
**How to apply:** For every pipeline, create two smartlists:
- `[Pipeline] — Active` (form completed + payment/confirmation done)
- `[Pipeline] — Incomplete` (form started, no completion)

Give access to the relevant team member per pipeline (tours team sees Tours lists, B2B team sees B2B lists).

---

### 3.3 Custom Values Folder Per Pipeline
**ANLP equivalent:** Used for cohort dates, Zoom links, prices — update once, reflects in all emails and pages.
**How to apply:** Create a Custom Values folder for each pipeline. At minimum include: course/tour date, price, booking link, team contact name, location details. When a course date changes, update the Custom Value — not every email individually.

---

### 3.4 Duplicate Welcome Email Prevention
**ANLP equivalent:** GHL sends a default community welcome email AND the custom workflow email. Caused confusion for students.
**How to apply:** If Denim City uses GHL Communities for course students: turn off the default GHL welcome email. Send only the custom workflow email (with magic link if applicable). Confirm this is working in TEST before going LIVE.

---

### 3.5 One-Click Upsell Post-Purchase
**ANLP equivalent:** Post-CTF checkout → Premium Upgrade offer, no re-entry of card details.
**How to apply for Denim City:**
- After tour booking → offer course at a discount ("You've seen it — now make it")
- After course enrollment → offer next course level
- After repair booking → offer course ("Turn repair knowledge into a skill")

Build as a post-confirmation page step (same pattern as ANLP). Keep it one offer, one click.

---

### 3.6 Time-Aware Email Automation
**ANLP equivalent:** Fast Action Bonus paragraph auto-included/excluded before a deadline. No manual removal.
**How to apply:** Denim City courses may offer Early Bird pricing. When EB deadline passes, the EB-price mention in the confirmation email removes automatically. No manual editing of live emails. Same logic — different content.

---

### 3.7 Seat Cap via Custom Script
**ANLP equivalent:** Custom script caps registrations at 70 for CT Prosperity and CT Money Blocks. Redirects to waitlist tag.
**How to apply:** Denim City's atelier courses (Make Your Own Jeans, etc.) have physical capacity limits. Reuse the same seat cap script. Tag for waitlisted contacts: `course-[name]-waitlist`. When a spot opens (cancellation), PM manually triggers the next person on the waitlist — same process as ANLP.

---

### 3.8 Post-Event Balance Follow-Up
**ANLP equivalent:** Automated reminders for outstanding balances before AND after the event.
**How to apply:** If Denim City offers course deposits (partial payment now, balance before start date): exact same workflow structure. Reminder at 2 weeks before, 1 week before, 48h before. After event: 2 follow-ups for unpaid balances.
**Note:** Only build this if deposit payment is confirmed as an option for courses. Check with client.

---

### 3.9 TEST → LIVE Process
**ANLP equivalent:** All payments in TEST mode until Petrolene gives written sign-off.
**How to apply:** Same discipline. Every build goes live in TEST first. PM (and Mariette or James) reviews via a shared QA checklist. Written sign-off required before switching payments to LIVE. No exceptions.

---

### 3.10 Internal Notification Routing
**ANLP equivalent:** Default GHL notification (info@ inbox) turned off — not appropriate for customer service inbox.
**How to apply:** Check which email address receives GHL internal notifications. If it is the public customer service inbox, turn off the default and build custom internal alerts to the correct named team member per pipeline (tours team, B2B team, repair team).

---

## 4. What Is New — Not in ANLP

These patterns do not exist in the ANLP account and need to be built fresh.

### 4.1 Lightspeed Retail → GHL (via Make.com)
**What it does:** When a store customer opts in for a digital receipt at Lightspeed POS checkout, their contact data flows via Make.com into GHL as a new or updated contact. Tagged by what they bought.
**What it does NOT do:** No financial data crosses into GHL. The Lightspeed → Exact accounting connection is untouched.
**Make.com scenario to build:** Lightspeed webhook on completed sale (with email opt-in) → check if GHL contact exists (match on email) → create or update contact → apply product-based tags.

**Scope is narrow — do not overcomplicate:**
- In-store only. No e-commerce, no online orders.
- 1 POS station. Single webhook source — no multi-location logic needed.
- Returns are an edge case: retour event in Lightspeed → remove or adjust the relevant product tag in GHL. No other action needed.
- Estimated build: 4–6 hours including testing and documentation. This is a straightforward 3–4 module Make.com scenario.

Product tag logic:
- Nudie Jeans purchase → tag `store-nudie-buyer` → triggers repair reminder sequence at 6 months
- Denim City Originals purchase → tag `store-dc-originals-buyer` → triggers course invitation at 14 days
- General purchase → tag `store-buyer` → triggers Denim Dates newsletter offer

**PM note:** Lightspeed Retail (not Restaurant) — no native GHL integration. Make.com is the only bridge.

### 4.2 GHL Course Booking → Moneybird Invoice (via Make.com)
**What it does:** When a course booking is confirmed in GHL (payment received), Make.com creates a Moneybird invoice for the education entity automatically.
**Make.com scenario to build:** GHL webhook on tag `course-enrolled` → create Moneybird invoice with contact details + course name + amount → send invoice to customer email.
**PM note:** Moneybird has a native Make.com integration. Confirm Moneybird account setup and invoice template with client before building.

### 4.3 Post-Tour Review Automation (SMS-first)
**What it does:** T+2h after tour end time → SMS to tour booker with direct Google/TripAdvisor review link. T+24h → email follow-up.
**Why SMS first:** Open rate on SMS is 90%+. The emotional peak from the tour is still fresh at 2 hours. Email alone is not fast enough.
**Build note:** Tour end time must be stored as a Custom Value per booking. The workflow triggers off that value, not the booking date.

### 4.4 NPS Routing
**What it does:** After a tour or course, NPS question is sent. Score 9–10 → routes to review request. Score 7–8 → routes to feedback form. Score 0–6 → creates an internal task for a team member to personally follow up. Does not continue the marketing sequence.
**Build note:** NPS response must be captured as a custom field, not just a tag. The routing logic branches on that field value.

### 4.5 GDPR Consent Filter
**What it does:** Every workflow that sends a marketing email (not a transactional confirmation) first checks for a GDPR marketing consent field. If consent is not present, the marketing email step is skipped. The contact remains in the pipeline but does not receive promotional content.
**Build note:** Add this as a standard condition step at the top of every marketing email branch across all pipelines. Transactional emails (booking confirmation, appointment reminder) are exempt — they do not require marketing consent.

### 4.6 Funding Pipeline — Internal Reminder Logic
**What it does:** This is not a sales funnel. It is a relationship management tool for the grants and funding team.
- Reminder to team 30 days before a grant reporting deadline
- Reminder to team 60 days before a funding renewal window opens
- If a funder relationship has had no activity in 90 days → internal flag
**Build note:** Triggered by manual date entry by the team, not by form submissions. Educate the client on how to enter and update these dates.

### 4.7 Referral Mechanic — Name-Based, Two-Sided Reward

**What it does:** Turns satisfied tour guests and course graduates into active referrers. Both the referrer and the new booker receive a discount. Fully automated on the reward side once a referral is confirmed.

**The mechanism — name-based (no unique links required):**

GHL does not generate unique referral links per contact natively. The approach below works without third-party tools and fits Denim City's warm, personal brand tone.

**Step 1 — Referral invite (outbound):**
- Tours B2C: sent at T+7 days post-visit, after the review sequence has completed
- Courses: sent at T+14 days post-course, after feedback request has completed
- Email subject: personal and direct — not promotional in tone
- Email body: "Enjoyed the experience? If you know someone who would love it too, tell them to book and mention your name. You both get 10% off your next booking with us."
- GDPR consent check applies (marketing email — not transactional)

**Step 2 — Referral capture (inbound):**
- Add one optional field to the tour booking form and course enrollment form: **"Were you referred by someone? If so, who?"** (free text, not required)
- When this field is filled in on submission, the workflow:
  1. Searches GHL contacts for a name match
  2. If match found → tags the referrer contact with `referral-triggered` → enters them into the reward sequence
  3. Tags the new contact with `referred-by-[referrer-name]` for reporting
  4. If no match found → creates an internal task for PM to review manually

**Step 3 — Reward sequence (to referrer):**
- Trigger: tag `referral-triggered` applied
- Wait 24h (confirm the new booking is not cancelled)
- Send email to referrer: "Good news — [first name of new booker] just booked. Your 10% discount code is [CUSTOM VALUE: discount code]."
- Discount code is a Custom Value per contact — generated manually by PM at setup or via a simple naming convention (e.g. `REF-[contact ID last 4 digits]`)
- Tag referrer with `referral-rewarded` once sent

**B2B variant (Tours B2B / DMC pipeline):**
- Same logic, different reward: preferential commission on next group booking rather than a percentage discount
- Referral invite sent after contract is signed and first group visit is completed
- Reward email is personal, not automated in tone — drafted as if from the Denim City B2B contact

**Tags to add to master tag list:**
- `referral-triggered` — functional: fires reward sequence
- `referral-rewarded` — functional: prevents duplicate reward sends
- `referral-source` — segmental: contacts who came in via referral (for reporting)

**Build note:** The discount code does not need to be dynamically generated. A fixed 10% code valid for 30 days is sufficient for Phase 1. PM creates and enters the code as a Custom Value per referrer contact when `referral-triggered` fires. In Phase 2 this can be automated if volume justifies it.

**What this is NOT:** a full referral platform (ReferralHero, Tapfiliate). That level of complexity — unique trackable links, a referral dashboard, tiered rewards — is out of scope. This is the simplest version that works and fits the budget.

---

## 5. Integration Architecture Summary

```
Webflow site
    │
    ├── GHL booking calendar (tours + courses)
    ├── GHL forms (repair, lab, B2B, venue, etc.)
    └── Delphi.ai widget (lead capture → GHL sync)
          │
          ▼
    GoHighLevel CRM
    ├── 9 pipelines + automations
    ├── Tag architecture (functional + segmental)
    ├── Smartlists + Custom Values
    │
    ├── Make.com scenario 1: Lightspeed → GHL
    │       └── In-store opt-in → contact created/updated in GHL
    │
    └── Make.com scenario 2: GHL course booking → Moneybird
            └── Confirmed enrollment → Moneybird invoice (education entity)

Lightspeed → Exact (accounting — DO NOT TOUCH)
```

---

## 6. Build Priority Order

Build in this sequence. Do not start Phase 2 before Phase 1 is in TEST and signed off.

**Phase 1 — Foundation (build first)**
1. GHL sub-account setup: domain, email config, staff accounts, permissions
2. Tag architecture and Custom Values structure — agree naming before building anything else
3. Tours B2C pipeline: form, confirmation, reminder, post-visit review + cross-sell sequence
4. Courses pipeline: enrollment form, confirmation, seat cap script, Moneybird trigger via Make.com
5. Repair intake pipeline: form (with Nudie/KOI flag), confirmation, appointment reminder
6. GDPR consent filter — built into all marketing email steps across all pipelines
7. Cart abandonment workflow — applied to Tours and Courses immediately

**Phase 2 — B2B and Integrations**
8. Tours B2B / DMC pipeline
9. Lab & Atelier pipeline
10. Partnerships pipeline
11. Venue Rental pipeline
12. Lightspeed → Make.com → GHL scenario
13. NPS routing

**Phase 3 — Funding and Advanced**
14. Funding / Grants pipeline (internal reminders)
15. Repair B2B pipeline
16. One-click upsell post-purchase flows
17. Time-aware Early Bird automation (if applicable)
18. Referral mechanic — Tours B2C and Courses pipelines (Section 4.7)

---

## 7. QA and Go-Live Process

1. Every build goes into TEST mode first
2. PM reviews using a shared QA checklist (create this before first build goes into TEST)
3. Feedback given in writing (shared doc or email thread — not WhatsApp)
4. Build team addresses feedback and confirms in writing
5. Mariette or James gives written go-live sign-off
6. Payment switches to LIVE only after sign-off — no exceptions
7. PM checks first 3 live transactions to confirm tags and automations are firing correctly

---

## 8. What the Build Team Does NOT Need to Build

To avoid scope creep — these are explicitly out of scope for the GHL build:

- Webflow pages (separate contractor)
- Delphi.ai setup and training (Peter handles)
- Lightspeed → Exact accounting integration (already exists — do not touch)
- Moneybird account setup (client to provide access)
- Make.com account setup (Peter handles — build team delivers scenario specs)
- Multi-language content
- Any SEO or analytics work

---

*Prepared by Peter van Rhoon / SuperStories BV*
*Questions: peter@superstories.com*
