# SuperStories GHL Project PRD Template
**Version 1.0 | SuperStories BV | For use with Claude as GHL Project Architect**

---

## HOW TO USE THIS TEMPLATE

This is a structured PRD (Product Requirements Document) for any new GHL project.

**Workflow:**
1. PM fills in all sections marked `[REQUIRED]` before any build starts
2. Feed the completed PRD to Claude with the prompt: *"Review this GHL PRD. Flag platform limitations, missing prerequisites, compliance gaps, workflow logic gaps, and anything that will cause the operator to come back with questions before building."*
3. Claude returns a punch list — resolve what you can, flag what needs client input
4. Clean PRD goes to the operator (I&Y or other) as the build brief
5. Operator builds against the PRD — no design decisions during build
6. PM runs QA checklist (Section 10) before sign-off

**Standing rule:** Nothing gets built without a completed PRD. No exceptions.

---

## SECTION 1: Project Overview `[REQUIRED]`

| Field | Answer |
|---|---|
| Client name | |
| Project / program name | |
| GHL sub-account name | |
| GHL location ID | |
| Project lead (SuperStories) | |
| Operator assigned | |
| Brief date | |
| Target go-live date | |
| Early Bird deadline (if applicable) | |
| Seat cap (if applicable) | |
| Budget allocated for this build | |

**Project description (2–3 sentences):**
> What is this program/product? Who is it for? What does the GHL build need to achieve?

---

## SECTION 2: GHL Setup Prerequisites `[REQUIRED FOR ALL NEW ACCOUNTS]`

Complete this section before any build work begins. These are prerequisites — nothing else can be built until they are done.

| Task | Owner | Status | Notes |
|---|---|---|---|
| Sub-account created in GHL agency | | ☐ | |
| Sub-account name and location ID confirmed | | ☐ | |
| Custom domain connected (e.g. events.clientdomain.com) | | ☐ | |
| Domain DNS verified and propagated | | ☐ | |
| Email sending domain configured (DKIM/SPF records) | | ☐ | |
| From name and from email address confirmed | | ☐ | |
| Reply-to email address confirmed | | ☐ | |
| Staff accounts created | | ☐ | |
| Staff permissions set (who can edit what) | | ☐ | |
| Stripe account connected | | ☐ | |
| Stripe test mode confirmed working | | ☐ | |
| GHL default community welcome email turned OFF | | ☐ | Prevents duplicate welcome emails |
| Custom Values folder created for this project | | ☐ | |
| Pipeline created for this product | | ☐ | |

**Staff with GHL access (list all):**
| Name | Role | Access Level | Can Edit Templates Without Briefing Operator? |
|---|---|---|---|
| | | | |

> ⚠️ Note for PM: Always ask the client who has direct GHL template access. Anyone with edit rights can change copy without briefing the operator. Track this.

---

## SECTION 3: Product & Pricing Structure `[REQUIRED]`

### 3.1 Payment Options

List every payment option available to the buyer. Be exhaustive — each option typically requires its own checkout page.

| Payment Option | Price | Finance Charge | Notes |
|---|---|---|---|
| Full payment | | | |
| Partial / deposit | | | Specify deposit amount and balance amount |
| Balance payment | | | |
| Installment plan | | | Specify number of payments and interval |
| Installment plan with finance charge | | | |

### 3.2 Coupon Codes

List every coupon code. Be specific about which payment options each code applies to — GHL handles coupons differently per payment type.

| Code | Discount | Applies To | Routing Logic | Notes |
|---|---|---|---|---|
| | | | | |

> ⚠️ GHL platform note: Coupon codes do NOT natively apply to installment/payment plan checkout pages. Any discount on a payment plan requires a custom redirect workaround. Flag this to the operator if installment + coupon is required.

### 3.3 Upsells & Add-Ons

| Upsell / Add-On | Price | Trigger | Mechanism | Notes |
|---|---|---|---|---|
| | | Post-purchase / in-sequence / other | One-click / separate checkout | |

### 3.4 Seat Cap

| Product | Seat Cap | Waitlist Handling | Notes |
|---|---|---|---|
| | | Tag / email / redirect | Note: GHL does not natively support seat caps — requires custom script |

---

## SECTION 4: Funnel & Page Architecture `[REQUIRED]`

List every page in the funnel. Each page needs a URL slug confirmed before build starts.

| Page | URL Slug | Notes |
|---|---|---|
| Registration / landing page | | |
| Payment options page | | |
| Full payment checkout | | |
| Partial payment checkout | | |
| Installment checkout | | |
| Installment checkout (discounted) | | If coupon applies to installment |
| Balance payment checkout | | |
| Balance payment checkout (discounted) | | If coupon applies to balance |
| Thank You page | | |
| Terms & Conditions page | | |
| Upsell page | | |
| Upsell Thank You page | | |

**Webflow / GHL boundary decision:**
> Which pages live in GHL and which live in Webflow (or other CMS)? Define this clearly. GHL pages = funnels/checkouts. Public-facing marketing pages typically stay in Webflow.

**Forms embedded in external site:**
> If GHL forms are embedded in Webflow or another CMS, specify which forms and which pages they embed on. Confirm with the Webflow developer.

---

## SECTION 5: Tagging Architecture `[REQUIRED]`

Define all tags before build starts. Do not create tags during build.

**Naming convention:** `[client-short]-[product]-[cohort]-[status]`
Example: `anlp-ctf-mar2026-registered`

### 5.1 Functional Tags (drive automation logic)

| Tag Name | Trigger | Purpose |
|---|---|---|
| [client]-[product]-[cohort]-registered | Form submitted | Enrols contact in confirmation sequence |
| [client]-[product]-[cohort]-fully-paid | Full payment complete | Grants full access, triggers confirmation |
| [client]-[product]-[cohort]-partially-paid | Partial payment complete | Triggers balance reminder sequence |
| [client]-[product]-[cohort]-balance-paid | Balance payment complete | Updates contact to fully paid status |
| [client]-[product]-[cohort]-installment | Installment plan purchased | Triggers installment sequence |
| [client]-[product]-[cohort]-abandoned-cart | Form submitted, no payment within X hours | Triggers cart abandonment sequence |
| [client]-[product]-[cohort]-comp | 100% coupon used | Grants access without payment |
| [client]-[product]-[cohort]-course-access-granted | 1 week before event | Triggers course access email |

### 5.2 Segmental Tags (marketing segmentation)

| Tag Name | Purpose |
|---|---|
| [client]-[product]-[cohort]-waitlist | Seat cap reached — marketing segment |
| [client]-[product]-[cohort]-nps-promoter | NPS score 9–10 |
| [client]-[product]-[cohort]-nps-passive | NPS score 7–8 |
| [client]-[product]-[cohort]-nps-detractor | NPS score 0–6 — routes to internal follow-up task |

> ⚠️ Before creating any new tags: check with the client whether a GHL CRM architecture project is in progress. New tags must align with the emerging taxonomy — do not create ahead of it.

---

## SECTION 6: Workflow & Automation Spec `[REQUIRED]`

Define every workflow. Each workflow needs: trigger, steps, tags applied, emails sent, internal notifications.

### Standard Workflow Pack (include in every build unless explicitly excluded)

| Workflow | Trigger | Key Steps | Include? |
|---|---|---|---|
| Registration confirmation | Form submitted | Confirmation email + tag + pipeline stage | ☐ |
| Community welcome + magic link | Tag: registered | 5-min wait → community access email with magic link | ☐ |
| Cart abandonment | Form submitted + no payment tag within 2hrs | Tag abandoned + nurture sequence | ☐ |
| Balance payment reminder (pre-event) | Tag: partially paid | Reminder emails at [X days] and [Y days] before event | ☐ |
| Balance payment follow-up (post-event) | Event date passed + tag: partially paid | 2 reminder emails for outstanding balances | ☐ |
| Course access | 7 days before event | Course library access email with magic link | ☐ |
| Event reminders | Purchase complete | [1 week / 3 days / 1 day / 1 hour] before event | ☐ |
| Failed payment notification | Failed installment | Internal alert to [name, name, name] | ☐ |
| NPS survey | [X days] post-event | NPS email → branch on score → tag + route | ☐ |
| Post-event upsell | Post-event + tag: fully paid | Upsell sequence for next program | ☐ |

### Custom Workflows for This Project

| Workflow | Trigger | Steps | Tags Applied | Emails Sent | Internal Notifications |
|---|---|---|---|---|---|
| | | | | | |

### Time-Sensitive Automation Notes

> List any automations that are time-aware (e.g. FAB removal after deadline, early bird price switch, seat cap redirect). These require custom logic and must be specified precisely.

| Automation | Logic | Deadline / Trigger Time | Timezone |
|---|---|---|---|
| Early Bird price switch | Auto-switch to regular price after EB deadline | | Always specify timezone |
| FAB / bonus removal | Remove paragraph from confirmation email after deadline | | Always specify timezone |
| Seat cap redirect | Redirect to waitlist page when cap reached | | |

---

## SECTION 7: Email Sequence Spec `[REQUIRED]`

List every email in the build. Copy must be approved before build starts — do not build email templates against unapproved copy.

| Email | Workflow | Send Timing | From Name | Subject Line | Copy Status | Notes |
|---|---|---|---|---|---|---|
| Registration confirmation | Registration | Immediate | | | ☐ Approved | |
| Community welcome | Community welcome | 5 min after confirmation | | | ☐ Approved | Contains magic link |
| Cart abandonment #1 | Cart abandonment | 2 hrs after abandon | | | ☐ Approved | |
| Cart abandonment #2 | Cart abandonment | 24 hrs after abandon | | | ☐ Approved | |
| Balance reminder #1 | Balance reminder | [X days] before event | | | ☐ Approved | |
| Balance reminder #2 | Balance reminder | [Y days] before event | | | ☐ Approved | |
| Course access | Course access | 7 days before event | | | ☐ Approved | |
| Event reminder | Event reminder | 1 day before | | | ☐ Approved | |
| NPS survey | Post-event | [X days] after event | | | ☐ Approved | |

**Copy delivery deadline (must be before build start):**

> ⚠️ Do not start building email templates until copy is approved. Building against placeholder copy creates rework.

---

## SECTION 8: Community & Course Access `[REQUIRED IF APPLICABLE]`

| Question | Answer |
|---|---|
| Does this program have a GHL community? | Yes / No |
| Community URL | |
| Community access: when is it granted? | On registration / on full payment / other |
| Is community access cohort-specific or evergreen? | |
| Does this program have a GHL course? | Yes / No |
| Course offer URL | |
| Course access: when is it granted? | X days/weeks before event |
| Is course access cohort-specific? | |
| Magic link used in community/course emails? | Yes / No — always recommend Yes |
| Default GHL community welcome email turned OFF? | ☐ Confirm before go-live |

> ⚠️ GHL platform note: GHL sends a default welcome email when community access is granted. This MUST be turned off manually to prevent duplicate welcome emails. Add to go-live checklist.

> ⚠️ Student UX note: Students who land in the community first often cannot find their course library. Consider whether the confirmation email should link directly to the course library rather than the community homepage.

---

## SECTION 9: GDPR & Compliance `[REQUIRED FOR ALL EUROPEAN CLIENTS]`

This section is mandatory for any client based in the EU or with EU-based contacts.

| Requirement | Spec | Status |
|---|---|---|
| Consent checkbox on registration form | Text: [specify exact consent language] | ☐ |
| Consent checkbox is required field | Yes / No | ☐ |
| Marketing consent separate from T&C consent | Yes / No — recommended: Yes | ☐ |
| GDPR consent filter on all marketing workflows | Only contacts with consent tag receive marketing emails | ☐ |
| Consent tag name | e.g. `[client]-gdpr-marketing-consent` | ☐ |
| Unsubscribe link in all marketing emails | GHL native / custom | ☐ |
| Data retention policy documented | Yes / No | ☐ |
| Third-party integrations that receive contact data | List all (Make.com, Lightspeed, etc.) | ☐ |
| Data processing agreement with third parties | Yes / No | ☐ |

**Consent workflow logic:**
> Any workflow that sends a marketing email (not transactional) must filter for the GDPR consent tag first. Transactional emails (confirmation, access, reminder) do not require marketing consent.

---

## SECTION 10: Third-Party Integrations `[REQUIRED IF APPLICABLE]`

| Integration | Tool | Purpose | Complexity | Dependencies |
|---|---|---|---|---|
| | Make.com / Zapier / N8N / native | | Low / Medium / High | |

### GHL Platform Limitations to Check Before Speccing Integrations

Before assuming GHL can do something natively, verify against these known limitations:

| Feature | GHL Native? | Workaround |
|---|---|---|
| Dynamic event content in emails (e.g. upcoming events list) | ❌ No | Make.com + Google Sheet → email content |
| Seat caps on registrations | ❌ No | Custom script required |
| Coupon codes on installment/payment plan checkouts | ❌ No | Custom redirect routing |
| Multi-level affiliate tracking | ⚠️ Partial | Custom tags + custom fields + Make.com |
| Booking system for events (vs. appointments) | ⚠️ Limited | GHL calendar is appointment-first — not designed for event publishing |
| DPD / digital file delivery | ❌ No | N8N or Make.com integration |
| MailChimp sync | ❌ No native | Make.com or manual export |
| Lightspeed POS sync | ❌ No native | Make.com |

> ⚠️ If a feature is not on this list, ask Claude: *"Does GHL natively support [feature]? What are the limitations and workarounds?"* before putting it in a build brief.

---

## SECTION 11: Forms Spec `[REQUIRED]`

Define every form field before build starts. I&Y cannot build forms without knowing what information to collect.

### [Form Name — e.g. Registration Form]

| Field | Type | Required? | Notes |
|---|---|---|---|
| First name | Text | Yes | |
| Last name | Text | Yes | |
| Email | Email | Yes | |
| Phone | Phone | No / Yes | Specify if required |
| T&C consent | Checkbox | Yes | Merge multiple T&C clauses into one paragraph — GHL supports only 1 required checkbox |
| Marketing consent (GDPR) | Checkbox | Yes | Separate from T&C |
| [Custom qualification question] | Text / Dropdown / Radio | | |

> ⚠️ GHL platform note: GHL supports only ONE required checkbox. If T&C and GDPR consent are both required, they must be merged into one checkbox paragraph or one must be optional.

---

## SECTION 12: Smartlists `[REQUIRED]`

Two smartlists per cohort is the SuperStories standard. Define both before build starts.

| Smartlist Name | Filter Logic | Access (who can view) |
|---|---|---|
| [Program] Participants | Tag: fully paid OR comp | [names] |
| [Program] Incomplete Registration | Tag: registered AND NOT fully paid AND NOT comp | [names] |
| [Program] Waitlist | Tag: waitlist | [names] |

---

## SECTION 13: Internal Notifications `[REQUIRED]`

| Notification | Trigger | Recipients | Channel (GHL email / Slack / other) |
|---|---|---|---|
| New registration | Form submitted | | |
| Failed payment | Failed installment | | |
| NPS detractor | NPS score 0–6 | | Routes to internal task, not just email stop |
| Seat cap reached | 70th registration | | |

> ⚠️ Note: GHL's default internal notification goes to the account's primary inbox. If that inbox is customer-facing (e.g. info@), turn off default notifications and build custom internal notification workflows.

---

## SECTION 14: Custom Values `[REQUIRED]`

Create a Custom Values folder for this project before build starts. List all variables here — update once, reflects everywhere across all emails and pages.

| Variable Name | Value | Used In |
|---|---|---|
| Program name | | All emails |
| Event date(s) | | All emails, pages |
| Event time | | Reminder emails |
| Event timezone | | Reminder emails |
| Zoom / venue link | | Access emails, reminders |
| Early Bird deadline | | EB pages, FAB automation |
| Early Bird price | | EB checkout |
| Regular price | | Regular checkout |
| Partial payment deposit amount | | Partial checkout |
| Balance payment amount | | Balance checkout |
| Installment amount | | Installment checkout |
| Finance charge | | Installment checkout |
| Support email | | All emails |
| From name | | All emails |

---

## SECTION 15: QA Checklist `[COMPLETE BEFORE GO-LIVE]`

PM runs this checklist in TEST mode before any payment switches to LIVE.

### Funnel & Pages
- ☐ All pages load correctly on desktop and mobile
- ☐ All page copy matches approved copy
- ☐ Early Bird / regular price displays correctly
- ☐ Price auto-switch logic tested (if applicable)
- ☐ Coupon codes tested on all applicable payment types
- ☐ Installment plan coupon routing tested (custom redirect)
- ☐ Seat cap script tested (if applicable)
- ☐ Upsell page loads correctly post-purchase
- ☐ Thank You page loads correctly
- ☐ T&C page loads correctly

### Forms
- ☐ All required fields validated
- ☐ T&C / GDPR consent checkbox present and required
- ☐ Form submission triggers correct workflow
- ☐ Contact created in GHL with correct tags after submission

### Payments
- ☐ Full payment tested in Stripe TEST mode
- ☐ Partial payment tested
- ☐ Installment plan tested
- ☐ Balance payment tested
- ☐ All coupon codes tested across all applicable payment types
- ☐ Comp (100%) coupon tested
- ☐ Stripe double-entry issue checked (optional fields layout)
- ☐ Payment failure tested — internal notification fires correctly

### Emails
- ☐ Registration confirmation email received
- ☐ Community welcome email received (5-min delay confirmed)
- ☐ No duplicate welcome emails (GHL default turned off)
- ☐ Magic link in community email works
- ☐ Course access email received (trigger tested)
- ☐ Balance reminder sequence tested
- ☐ Cart abandonment sequence tested
- ☐ All email copy matches approved copy
- ☐ All Custom Values render correctly (no broken variables)
- ☐ Unsubscribe link present in all marketing emails
- ☐ GDPR consent filter active on all marketing workflows

### Tags & Workflows
- ☐ All functional tags applied correctly at each stage
- ☐ Workflow execution logs checked — no errors
- ☐ Pipeline stages updated correctly at each stage
- ☐ Smartlists populated correctly
- ☐ Internal notifications firing to correct recipients
- ☐ NPS detractor routing tested (routes to task, not just sequence stop)
- ☐ GDPR: only contacts with consent tag receive marketing emails

### Community & Course Access
- ☐ Community access granted on correct trigger
- ☐ Course access granted on correct trigger (1 week before event)
- ☐ Cohort-specific content visible to correct cohort only
- ☐ Student landing page confirmed (course library vs. community homepage)
- ☐ GHL default community welcome email confirmed OFF

### Go-Live
- ☐ All QA items above resolved
- ☐ Petrolene (or equivalent client lead) has given written sign-off
- ☐ Payment switched from TEST to LIVE
- ☐ Live test purchase completed (small amount or comp)
- ☐ All team members notified of go-live

---

## SECTION 16: Re-Use & Template Notes `[COMPLETE AT PROJECT CLOSE]`

Complete this section at the end of the project to feed the SuperStories template library.

| Question | Answer |
|---|---|
| Share Funnel link(s) provided by operator? | ☐ Yes / ☐ No — chase if not |
| Workflow JSON exports provided by operator? | ☐ Yes / ☐ No — chase if not |
| Any custom code or non-standard GHL logic used? | Document here |
| What can be reused for other clients? | |
| What was client-specific and not reusable? | |
| What would you do differently next time? | |

---

## CLAUDE REVIEW PROMPT

When PRD is complete, feed to Claude with this prompt:

> *"You are a GHL automation architect. Review this PRD for a GHL build. Do the following:*
> *1. Flag any GHL platform limitations that affect the spec — where GHL cannot natively do what the brief assumes.*
> *2. Flag any missing information that will cause the operator to come back with questions before building.*
> *3. Flag any compliance gaps (GDPR, payment, data).*
> *4. Flag any workflow logic gaps — steps that are missing, triggers that are ambiguous, or branches that aren't specified.*
> *5. Flag any custom code requirements that need to be explicitly called out in the brief.*
> *6. Suggest anything that should be phased if the budget is constrained.*
> *Return a numbered punch list. Be specific — not 'check GDPR' but 'the registration form has no GDPR marketing consent checkbox — required for EU clients.'"*

---

*SuperStories BV | Amsterdam | peter@superstories.com | superstories.com*
*Template version 1.0 | March 2026*
