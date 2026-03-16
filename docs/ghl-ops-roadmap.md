# GHL Ops Roadmap — Denim City
**Internal document — NOT client-facing**
**For:** GHL ops team planning & resourcing
**Date:** March 2026
**Budget:** 100 hours available

---

## Summary

100 hours covers Phase 1 + Phase 2 in full, and most of Phase 3. To stay within budget, we split work between a senior GHL builder (automation logic, Make.com, custom scripts) and a junior operator (forms, tags, smartlists, basic emails). This reduces cost or frees hours for Phase 3 scope.

---

## Resourcing Split

### Junior Operator (config, forms, content)

| Item | Hours | Phase |
|------|-------|-------|
| Sub-account setup (domain, email config, staff accounts, permissions) | 4–6 | 1 |
| Tag architecture + Custom Values structure (spec provided) | 4–6 | 1 |
| All 7 forms (Tours B2C, Tours B2B, Courses, Repairs, Lab, Partnerships, Venue) | 6–8 | 1 |
| Smartlists — 2 per pipeline (Active + Incomplete), 18 total | 3–4 | 1–2 |
| Confirmation emails — all pipelines | 3–4 | 1–2 |
| Reminder emails (48h/24h/1 week before, per pipeline) | 3–4 | 1–2 |
| Internal notification routing per pipeline | 2–3 | 1–2 |
| GDPR consent filter (repeatable condition step, all pipelines) | 2–3 | 1 |
| Funding/Grants pipeline (date fields + internal reminders only) | 4–6 | 3 |
| **Junior subtotal** | **31–44h** | |

### Senior Builder (logic, scripts, integrations)

| Item | Hours | Phase |
|------|-------|-------|
| Cart abandonment workflows (branching logic, 1h/24h/72h timing) | 4–6 | 1 |
| Post-tour SMS review sequence + email follow-up | 4–6 | 1 |
| NPS routing (score-based branching, internal task on low score) | 4–6 | 2 |
| Seat cap custom script (waitlist tag on cap reached) | 3–4 | 1 |
| Make.com: Lightspeed → GHL (webhook, contact create/update, product tags) | 4–6 | 2 |
| Make.com: GHL course booking → Moneybird invoice | 3–4 | 1 |
| Referral mechanic (name-match search, reward sequence, B2B variant) | 8–12 | 3 |
| Cross-sell sequences (tour→course, course→next level, repair→course) | 4–6 | 1–2 |
| B2B/DMC nurture sequence (case studies, commission, test group offer) | 4–6 | 2 |
| One-click upsell post-purchase flows | 6–8 | 3 |
| Time-aware Early Bird automation | 2–3 | 3 |
| QA process + TEST → LIVE support | 4–6 | All |
| **Senior subtotal** | **50–72h** | |

**Combined total: 81–116h**

---

## Phased Delivery

### Phase 1 — Foundation
**Target: ~50h | Delivers: core revenue pipelines live**

Must be in TEST and signed off before Phase 2 starts.

**Senior builds first (week 1):**
1. Sub-account architecture — tags, custom values, naming conventions locked
2. Cart abandonment workflow (reuse ANLP pattern, adapt tone)
3. Seat cap script (reuse ANLP)
4. GDPR consent filter template (replicate across pipelines)

**Then in parallel — junior fills in:**
5. Tours B2C form + confirmation + reminder emails
6. Courses enrollment form + confirmation + reminders
7. Repairs intake form (with Nudie/KOI flag) + confirmation + reminder
8. Smartlists for all 3 pipelines
9. Internal notifications for all 3 pipelines

**Senior completes:**
10. Tours B2C post-visit sequence (SMS T+2h → email T+24h → cross-sell T+3d)
11. Courses post-booking → Make.com → Moneybird invoice trigger
12. Cross-sell sequences (tour→course, course→next level)

**Phase 1 QA:** shared checklist, TEST mode, written sign-off from Mariette or James.

---

### Phase 2 — B2B & Integrations
**Target: ~32h | Delivers: all remaining pipelines + external integrations**

**Junior builds:**
1. Tours B2B/DMC form + confirmation emails
2. Lab & Atelier form + confirmation
3. Partnerships form + confirmation
4. Venue Rental form + confirmation
5. Smartlists + internal notifications for all 4 pipelines

**Senior builds:**
6. B2B/DMC nurture sequence (different tone — case studies, commission structure)
7. Lab & Atelier → scoping call booking flow
8. Partnerships → discovery call booking flow
9. Venue Rental → quote + follow-up sequence
10. Make.com: Lightspeed → GHL scenario (webhook, contact sync, product tags)
11. NPS routing (score field capture, branching logic, internal task on 0–6)

**Phase 2 QA:** same process as Phase 1.

---

### Phase 3 — Advanced & Optimization
**Target: remaining hours (~18h if Phases 1–2 hit mid-estimates)**

Priority order within Phase 3:

| Priority | Item | Hours | Rationale |
|----------|------|-------|-----------|
| **P1** | Referral mechanic (Tours B2C + Courses) | 8–12 | Strategic — drives organic growth |
| **P2** | Funding/Grants pipeline | 4–6 | Junior can build — low cost |
| **P2** | Repair B2B pipeline (Nudie/KOI onboarding) | 4–6 | Junior can build — low cost |
| **P3** | One-click upsell post-purchase | 6–8 | Nice-to-have — defer if tight |
| **P3** | Time-aware Early Bird | 2–3 | Nice-to-have — defer if tight |

**If hours are tight:** Funding + Repair B2B go to junior operator. Referral mechanic is senior work. One-click upsell and Early Bird are the first to defer — they add revenue but aren't launch-critical.

---

## Dependencies & Sequencing

```
Week 1:  Senior sets up architecture (tags, custom values, GDPR template)
         ↓
Week 1-2: Junior starts forms + emails (can work in parallel once architecture is locked)
         ↓
Week 2-3: Senior builds automation logic (cart abandonment, SMS sequences, Make.com)
         ↓
Week 3:  Phase 1 QA — TEST mode
         ↓
Week 4:  Phase 1 sign-off → LIVE
         Phase 2 starts (junior on forms, senior on B2B logic + Lightspeed)
         ↓
Week 5-6: Phase 2 QA → sign-off → LIVE
         Phase 3 starts (referral mechanic, funding, remaining items)
         ↓
Week 7:  Phase 3 QA → sign-off → LIVE
```

**Hard dependency:** Tag architecture and Custom Values MUST be agreed and built before any forms or automations. Wrong tags silently break everything downstream.

**External dependency:** Client must provide Moneybird access + invoice template before Courses pipeline can go live.

---

## Risk & Scope Notes

- **Budget is tight.** The brief explicitly says "not AndreasNLP" — build lean, no gold-plating.
- **Hour estimates assume ANLP patterns are reusable.** If the senior builder hasn't worked on ANLP, add 10–15% for familiarization.
- **Post-event balance follow-up** (Section 3.8 of build brief) is listed as conditional — only build if deposit payments are confirmed as an option. Not included in estimates above.
- **Multi-language content is out of scope.** Do not build translated email variants.
- **Make.com account setup is Peter's responsibility.** Build team delivers scenario specs, Peter sets up the account.

---

## Defer List (if budget runs over)

These items can move to a future sprint without blocking launch:

1. One-click upsell post-purchase flows
2. Time-aware Early Bird automation
3. B2B referral variant (consumer referral mechanic is higher priority)
4. Post-event balance follow-up (conditional anyway)

---

*Prepared for internal ops planning — do not share with client.*
