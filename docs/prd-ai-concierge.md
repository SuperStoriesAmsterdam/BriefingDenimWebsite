# PRD: SuperStories AI Concierge
**Version 1.2 | SuperStories BV | March 2026**
**Status: Draft v3 — Ready for build pending build/buy decision (Delphi call).**

---

### Changelog v1.1 → v1.2
All changes based on second Claude Code review of v1.1.

1. Session ID generation specified — client-side UUID, server validates and creates session on first request
2. `unknown` visitor type added to config with fallback lead capture path
3. `/health` endpoint separated from pending lead retry — retry moved to `/admin/retry-leads` and as side-effect on `/chat`
4. `data-page` fallback specified — missing or unknown value defaults to `homepage` context
5. Mobile exit-intent fallback added — time-based trigger (45s inactivity) for touch devices
6. `.env.example` and `README.md` added to project scaffold and Phase 1 build sequence
7. `_lead_capture_note` removed from config.json — moved to CONVENTIONS.md
8. Adversarial test questions moved to `tests/adversarial_questions.md` — defined per client deployment
9. Cost tracking added to v2 backlog

---

### Changelog v1.0 → v1.1
1. Visitor type detection moved from string matching to LLM structured output
2. Session storage changed from in-memory to Replit KV (persistent across restarts)
3. Knowledge loading changed to priority-based per page (not load-all)
4. Lead capture fallback added — local-first, sync-to-GHL with retry
5. Conversation summary method specified — separate Claude call, not concatenation
6. GDPR consent added to widget (mandatory for Amsterdam/EU)
7. Anthropic API fallback added — graceful error with contact option
8. Conversation history limit defined — last 12 turns + system prompt
9. Rate limiting added to /chat endpoint
10. `ask_name_after_turns` removed from config — lead capture timing is prompt logic, not code logic
11. Build sequence revised — GHL smoke test moved to Phase 5, hallucination_guard moved to Phase 11
12. Widget static assets noted as technical debt for v2 CDN migration

---

## A NOTE TO CLAUDE CODE

This PRD was written in collaboration with Claude (claude.ai) based on a series of strategic and technical conversations. It reflects decisions made at the agency level — not just for Denim City, but for a reusable tool that SuperStories can deploy across multiple clients.

**You are invited to:**
- Challenge any architectural decision that won't hold up in production
- Suggest better patterns where you see them
- Flag anything that contradicts the existing codebase conventions
- Identify which components from existing SuperStories tools (The Natural, Talk to the Hand, BIA, Relatiecoach) can be reused directly or with minor modification
- Propose a better file/folder structure if the one described here has weaknesses
- Raise anything this PRD does not address that will cause problems during build

**What this PRD is NOT:**
- A final spec. It is a starting brief. Your first task is to read it, reflect on it, and produce a written assessment before writing a single line of code.
- A guarantee that the architecture described is optimal. The strategic reasoning is sound; the technical implementation may benefit from your direct knowledge of the codebase.

**First deliverable from Claude Code:**
Before building, produce a `REVIEW.md` in the project root with:
1. Components from existing SuperStories tools that can be reused as-is
2. Components that can be reused with modification — and what modification is needed
3. Architectural decisions in this PRD you would change and why
4. Anything missing from this PRD that must be resolved before build starts
5. Your proposed build sequence (what gets built first, why)

---

## 1. Project Overview

### What This Is

A deployable AI concierge tool that SuperStories builds and manages for clients. Visitors arrive on a client's website, start a conversation with an embedded chat widget, get answers to their questions, and are captured as tagged leads in the client's GoHighLevel CRM.

### What This Is Not

- A SaaS platform (no multi-tenant architecture, no client login UI, no admin dashboard in v1)
- A replacement for GoHighLevel automations — it feeds GHL, it does not replace it
- A voice tool in v1 — text only

### The Core Problem It Solves

Most client websites cannot have a different conversation with each of their distinct audiences. A staff member cannot be available at 11pm. The gap between a visitor's curiosity and their commitment to book or buy is too wide to cross alone.

The concierge bridges that gap: routes visitors intelligently, answers the questions that delay decisions, and captures every engaged lead into the CRM automatically.

### First Deployment: Denim City Amsterdam

Denim City is the reference client for this build. Everything built must work for Denim City and be structured so the next client is a fork-and-configure operation, not a rebuild.

Denim City specifics:
- 10+ distinct visitor audiences (tourists, DMCs, repair customers, students, brands, corporate teams, press, venue renters, collectors, grant funders)
- GHL CRM with 9 automated pipelines
- Webflow website (widget embeds via script tag)
- GHL booking calendar for tours and courses
- Multi-language: Dutch, English, Brazilian Portuguese, Japanese, German

---

## 2. Strategic Architecture Decision

### Option 1 — Copy per Client (chosen starting point)
One Replit project per client. Fork the Denim City repo for each new client. Replace three things: knowledge base files, system prompt, GHL credentials.

### Built as Option 2 — Modular from Day One
Even though v1 is a single-client deployment, the repo is structured so that the engine is fully separated from client configuration. When client 2 arrives, the fork is a 20-minute configuration exercise, not a rebuild.

**The separation principle:**
```
Engine (shared logic, never client-specific)
    ↕
Client config (everything specific to one client)
```

Nothing client-specific ever lives in the engine files. Nothing engine-specific ever lives in the client config files.

---

## 3. Folder Structure

```
/ai-concierge-denim-city/          ← One Replit project per client
│
├── CONVENTIONS.md                  ← Read before touching any file
├── REVIEW.md                       ← Claude Code's pre-build assessment (to be created)
├── PRD.md                          ← This document
├── ARCHITECTURE.md                 ← Generated after Claude Code review
├── README.md                       ← Setup guide for new client deployments
├── .env.example                    ← All required env keys, empty values, committed to repo
│
├── app.py                          ← Flask entry point, routes only — no logic here
│
├── engine/                         ← SHARED LOGIC — never client-specific
│   ├── claude_client.py            ← Anthropic API calls, streaming, error handling
│   ├── knowledge_loader.py         ← Loads and caches knowledge base files
│   ├── prompt_builder.py           ← Builds system prompt from config + knowledge
│   ├── ghl_client.py               ← All GHL API interactions
│   ├── context_manager.py          ← Manages conversation state per session
│   └── hallucination_guard.py      ← Fact-checking layer, uncertainty flagging
│
├── client/                         ← CLIENT-SPECIFIC — replace per deployment
│   ├── config.json                 ← All client settings (see Section 5)
│   ├── system_prompt.md            ← Client persona, tone, rules, ICP routing
│   ├── knowledge/                  ← All knowledge base files for this client
│   │   ├── faq.md                  ← Master FAQ — prices, hours, logistics
│   │   ├── services.md             ← Services and offerings
│   │   ├── courses.md              ← Course catalog
│   │   ├── repairs.md              ← Repair service specifics
│   │   ├── b2b.md                  ← B2B and Lab information
│   │   ├── tours.md                ← Tour information
│   │   └── experts/                ← Expert interview transcripts (Phase 2+)
│   │       ├── staff-interviews.md
│   │       └── industry-experts.md
│   └── pages/                      ← Per-page context configuration
│       ├── tours.md                ← Context injected when visitor is on Tours page
│       ├── repairs.md              ← Context injected on Repairs page
│       ├── education.md
│       ├── lab.md
│       ├── homepage.md             ← Also used as fallback for unknown/missing page
│       └── b2b.md
│
├── widget/                         ← Embeddable chat widget
│   ├── widget.js                   ← Self-contained JS, no framework dependencies
│   └── widget.css                  ← Scoped styles, won't bleed into host page
│
├── templates/
│   └── index.html                  ← Dev/test interface only
│
├── tests/
│   ├── test_engine.py
│   ├── test_ghl.py
│   ├── test_hallucination.py
│   └── adversarial_questions.md   ← 20 client-specific adversarial test questions
│
└── .env                            ← Never committed — see Section 6
```

**Claude Code question:** Does this folder structure align with the patterns used in The Natural and Talk to the Hand? If not, propose adjustments that reduce cognitive overhead when switching between projects.

---

## 4. Engine Components

### 4.1 claude_client.py

Handles all communication with the Anthropic API.

Responsibilities:
- Send messages to claude-sonnet-4-6
- Handle streaming responses (if implemented)
- Retry logic on API errors
- Token usage tracking (log to console, not stored — cost tracking deferred to v2)
- Return structured response object

```python
# Expected interface
def chat(messages: list, system_prompt: str, config: dict) -> dict:
    # Returns: {"response": str, "tokens_used": int, "flagged": bool}
```

**Reuse check for Claude Code:** The Natural's `ai_logic.py` has a working Anthropic API handler. Evaluate whether `handle_chef_session()` or `handle_sommelier_session()` can be extracted and generalised here.

### 4.2 knowledge_loader.py

Loads and caches knowledge base files from `client/knowledge/`.

Responsibilities:
- Load all `.md` files from the knowledge directory on startup
- Cache in memory — do not re-read on every request
- Expose a `reload()` function for hot-reloading during development
- Return knowledge as a structured dict keyed by filename

```python
# Expected interface
def load_knowledge(knowledge_dir: str) -> dict:
    # Returns: {"faq": "...", "services": "...", "courses": "...", ...}

def reload_knowledge() -> dict:
    # Force cache invalidation and reload
```

**Architecture note:** For Denim City's core knowledge volume (FAQ, services, courses, repairs, B2B, tours — 20–30 documents), Claude's context window is large enough that we do NOT need vector search or chunking. We load only the relevant knowledge files per conversation, determined by `knowledge_priority` in `config.json`.

**Context ceiling warning:** Expert interview transcripts (10–15 hours of audio as text ≈ 120,000–150,000 words ≈ 180,000–225,000 tokens) would push against claude-sonnet-4-6's 200k token ceiling when combined with core knowledge and conversation history. Expert transcripts are therefore NOT loaded by default — only when the conversation explicitly moves into territory that requires them. This is a configuration rule, not an architecture change. No vector pipeline needed in v1.

**Claude Code question:** Is there a simpler pattern for this in the existing codebase? The Natural's `load_chef_bible()` is the reference — evaluate whether it can be generalised.

### 4.3 prompt_builder.py

Constructs the full system prompt for each conversation from three sources:
1. `client/system_prompt.md` — the base persona and rules
2. `client/knowledge/` — relevant knowledge files for this conversation type
3. `client/pages/[page].md` — page-specific context if page parameter is passed

```python
# Expected interface
def build_system_prompt(
    base_prompt: str,
    knowledge: dict,
    page_context: str = None,
    visitor_type: str = None
) -> str:
    # Returns: complete system prompt string
```

**Page context injection:** When the widget is embedded on the Tours page, it passes `?page=tours` as a URL parameter. The engine reads this, loads `client/pages/tours.md`, and injects it into the system prompt.

**Page context fallback:** If `data-page` is missing, empty, or contains an unrecognised value, the engine falls back to `homepage` context silently. This prevents silent failures when a client forgets to set the attribute on a page. The fallback page is always `homepage.md`.

```python
def resolve_page_context(page: str, available_pages: list) -> str:
    # Returns page if recognised, "homepage" otherwise
    return page if page in available_pages else "homepage"
```

**ICP routing:** The system prompt contains routing instructions for each visitor type. Once the concierge identifies the visitor type from the first 1–2 exchanges, it shifts its knowledge focus accordingly. This is prompt logic, not code logic.

### 4.4 ghl_client.py

All GHL API interactions in a single module. This is the most important module for multi-client reuse — it should never contain client-specific logic.

Responsibilities:
- Create contact (name, email, phone)
- Apply tags to contact
- Add conversation summary to contact notes field
- Add contact to specified pipeline and stage
- Handle GHL authentication (API key from env)
- Retry on rate limit (GHL has aggressive rate limits)
- Log all API calls with outcome

```python
# Expected interface
def create_contact(name: str, email: str, phone: str = None) -> dict:
    # Returns: {"contact_id": str, "success": bool}

def apply_tags(contact_id: str, tags: list) -> dict:
    # Returns: {"success": bool}

def add_to_pipeline(contact_id: str, pipeline_id: str, stage_id: str) -> dict:
    # Returns: {"success": bool}

def add_conversation_note(contact_id: str, summary: str) -> dict:
    # Returns: {"success": bool}

def capture_lead(name: str, email: str, tags: list, summary: str, pipeline_id: str, stage_id: str) -> dict:
    # Atomic: creates contact + applies tags + adds note + adds to pipeline
    # Returns: {"contact_id": str, "success": bool, "queued": bool, "errors": list}
```

**Tag mapping:** Tags are defined in `client/config.json`, not hardcoded in the engine. The concierge identifies the visitor type via LLM structured output (see Section 5), the config maps visitor type to GHL tags and pipeline IDs. The engine never knows what the tags mean — it just applies what the config says.

**Unknown visitor type handling:** If `visitor_type` is `"unknown"` at the time of lead capture, the engine still saves the lead — it does not drop it. Behaviour:
1. Lead data saved to Replit KV (`pending_leads`) with `visitor_type: "unknown"`
2. GHL contact created with only the `[client-short]-unclassified-lead` tag and no pipeline assignment
3. The PM or team manually reviews unclassified leads in GHL and routes them
4. This is documented in `README.md` as a known edge case

**Lead capture reliability — local-first pattern:** GHL outages are real. If `capture_lead()` is called and the GHL API is unavailable, contact data must not be lost. Implementation:
1. Save lead data to Replit KV first (key: `pending_leads`)
2. Attempt GHL sync
3. On success: remove from `pending_leads`
4. On failure: log + leave in `pending_leads` for retry
5. Retry is triggered as a side-effect on every `/chat` request (non-blocking, async) and via `/admin/retry-leads`

```python
def capture_lead(name: str, email: str, tags: list, summary: str, pipeline_id: str, stage_id: str) -> dict:
    # 1. Write to local KV store first
    # 2. Attempt GHL sync
    # 3. On failure: log + queue for retry
    # Returns: {"contact_id": str, "success": bool, "queued": bool, "errors": list}
```

**Conversation summary generation:** Summary for GHL notes is generated via a **separate Claude call** after lead capture — not by concatenating turns. The call passes the full conversation history with the instruction: "Summarise this conversation in the exact format below, 3 sentences maximum." This produces consistent, readable notes. The cost is negligible.

**Claude Code question:** The GHL API uses OAuth for agency accounts and API keys for sub-accounts. Denim City is a sub-account. Confirm the correct auth method and flag any known gotchas with GHL REST API v2 rate limiting.

### 4.5 context_manager.py

Manages conversation state per session.

Responsibilities:
- Store conversation history (user + assistant turns) per session ID
- Store identified visitor type once detected, with confidence level
- Store captured lead data (name, email) once collected
- Store page context for the session
- Session expiry after 30 minutes of inactivity
- **Persistent storage via Replit KV (`replit.db`)** — not in-memory
- **Conversation history limit: last 12 turns** (6 user + 6 assistant). Older turns are dropped.

**Session ID pattern:**
- The widget generates a UUID (v4) client-side on page load and stores it in `sessionStorage`
- The UUID is sent with every `/chat` request as `session_id`
- On the first request with a new `session_id`, the server creates a new session in Replit KV
- `sessionStorage` (not `localStorage`) ensures a new session per browser tab — two tabs never share state
- UUID collision probability with v4 is negligible (1 in 2^122) — no server-side deduplication needed

**Visitor type lock:**
- `visitor_type_confidence` can be `"low"`, `"medium"`, or `"high"`
- Once `"high"` is reached, the field is locked — the LLM is instructed not to re-evaluate it
- If a visitor's signals change mid-conversation before lock (e.g. starts as tourist, reveals they're a DMC), the LLM can update the type while confidence is still `"low"` or `"medium"`
- After lock: the type is fixed for the session regardless of new signals

```python
# Expected interface
def get_session(session_id: str) -> dict:
    # Returns: {"history": list, "visitor_type": str, "visitor_type_confidence": str, "lead": dict, "page": str}

def update_session(session_id: str, updates: dict) -> None:
    pass

def clear_session(session_id: str) -> None:
    pass

def trim_history(history: list, max_turns: int = 12) -> list:
    # Keep last max_turns entries, drop older ones
    pass

def is_visitor_type_locked(session: dict) -> bool:
    return session.get("visitor_type_confidence") == "high"
```

**Reuse check for Claude Code:** Talk to the Hand and BIA both manage conversation state. Evaluate the session handling patterns in those codebases and determine what can be adapted. Standardise on Replit KV here regardless of what those tools use.

### 4.6 hallucination_guard.py

The most important quality layer. Prevents the concierge from inventing facts.

**The problem:** LLMs will confidently state specific prices, availability, eligibility rules, and timings even when they are not in the knowledge base. For a client-facing tool this is a trust-destroying failure.

**The solution — three layers:**

**Layer 1 — System prompt instruction (in system_prompt.md, not in code):**
```
You only answer from the knowledge base provided to you.
If a visitor asks for specific pricing, availability, or eligibility
information that is not explicitly stated in your knowledge base,
respond: "I want to make sure I give you accurate information on that —
let me connect you with the team." Never estimate or invent specific numbers.
```

**Layer 2 — Structured knowledge files:**
All factual data (prices, times, eligibility rules, capacity limits) lives in explicit, structured markdown:
```markdown
## Repair Pricing
- Zip replacement: €25–35
- Hem repair: €15–20
- Nudie / KOI garments: free of charge (bring receipt)
- Turnaround: 3–5 working days standard
```
Explicit format = less room for the model to interpolate.

**Layer 3 — Code-level uncertainty detection (added after prompt + knowledge layers are proven):**
Post-process responses to detect high-confidence specific claims that reference quantities, prices, or dates. If detected AND the value does not appear verbatim in the knowledge base, flag it.

```python
# Expected interface
def check_response(response: str, knowledge: dict) -> dict:
    # Returns: {"response": str, "flagged": bool, "reason": str}
```

**Note on build sequence:** Layer 3 is built in Phase 11, after the adversarial test questions confirm that Layers 1 and 2 alone deliver acceptable quality. The code guard handles edge cases, not the primary load.

**Claude Code question:** Propose a simple, robust implementation. A regex-based check on price/date patterns against the knowledge base text is sufficient for v1. Do not over-engineer.

---

## 5. Client Configuration

Everything client-specific lives in `client/config.json`. The engine reads this file on startup. No client-specific values are hardcoded anywhere in the engine.

Note on documentation in config: comments are not valid JSON. Any explanatory notes about config fields belong in `CONVENTIONS.md`, not as `_key` entries in the JSON itself.

```json
{
  "client_name": "Denim City Amsterdam",
  "client_short": "dc",
  "language_primary": "nl",
  "languages_supported": ["nl", "en", "pt-BR", "ja", "de"],

  "widget": {
    "position": "bottom-right",
    "color_primary": "#1B3A6B",
    "color_secondary": "#FFFFFF",
    "avatar_url": "/static/dc-avatar.png",
    "default_opening_line": "Eerste keer hier? Vertel me wat je brengt — ik wijs je de weg.",
    "delay_ms": 2000
  },

  "pages": {
    "tours": {
      "opening_line": "Denk je aan een tour? Ik vertel je wat je kunt verwachten en help je de juiste kiezen.",
      "knowledge_priority": ["tours", "faq"],
      "exit_intent": true,
      "exit_intent_line": "Voordat je gaat — heb je nog vragen? De meeste mensen boeken na één gesprek."
    },
    "repairs": {
      "opening_line": "Vertel me wat er mis is — ik vertel je of we het kunnen repareren en wat het kost.",
      "knowledge_priority": ["repairs", "faq"],
      "exit_intent": false
    },
    "education": {
      "opening_line": "Niet zeker welke cursus bij je past? Vertel me je niveau en wat je wilt maken.",
      "knowledge_priority": ["courses", "faq"],
      "exit_intent": true,
      "exit_intent_line": "Voordat je gaat — heb je nog vragen? De meeste mensen boeken na één gesprek."
    },
    "lab": {
      "opening_line": "Werk je aan een project? Vertel me erover — ik kijk of het Lab de juiste plek is.",
      "knowledge_priority": ["b2b", "services"],
      "exit_intent": false
    },
    "homepage": {
      "opening_line": "Eerste keer hier? Vertel me wat je brengt — ik wijs je de weg.",
      "knowledge_priority": ["faq", "services", "tours"],
      "exit_intent": false
    },
    "b2b": {
      "opening_line": "Wil je met ons samenwerken? Vertel me over je project — ik vind de juiste weg.",
      "knowledge_priority": ["b2b", "services"],
      "exit_intent": false
    }
  },

  "visitor_types": {
    "tourist": {
      "ghl_tags": ["dc-tourist-lead", "dc-tour-interest"],
      "ghl_pipeline_id": "PIPELINE_ID_TOURS",
      "ghl_stage_id": "STAGE_ID_NEW_LEAD"
    },
    "dmc": {
      "ghl_tags": ["dc-dmc-lead", "dc-b2b-interest"],
      "ghl_pipeline_id": "PIPELINE_ID_B2B",
      "ghl_stage_id": "STAGE_ID_NEW_LEAD"
    },
    "student": {
      "ghl_tags": ["dc-student-lead", "dc-course-interest"],
      "ghl_pipeline_id": "PIPELINE_ID_EDUCATION",
      "ghl_stage_id": "STAGE_ID_NEW_LEAD"
    },
    "repair": {
      "ghl_tags": ["dc-repair-lead"],
      "ghl_pipeline_id": "PIPELINE_ID_REPAIRS",
      "ghl_stage_id": "STAGE_ID_NEW_LEAD"
    },
    "brand": {
      "ghl_tags": ["dc-brand-lead", "dc-lab-interest"],
      "ghl_pipeline_id": "PIPELINE_ID_B2B",
      "ghl_stage_id": "STAGE_ID_NEW_LEAD"
    },
    "unknown": {
      "ghl_tags": ["dc-unclassified-lead"],
      "ghl_pipeline_id": null,
      "ghl_stage_id": null
    }
  },

  "ghl": {
    "location_id": "GHL_LOCATION_ID",
    "api_version": "v2"
  },

  "compliance": {
    "gdpr_notice": "By sharing your details you agree to being contacted by Denim City Amsterdam.",
    "privacy_policy_url": "https://denimcity.nl/privacy",
    "fallback_contact_email": "info@denimcity.nl"
  },

  "knowledge_files": [
    "faq.md",
    "services.md",
    "courses.md",
    "repairs.md",
    "b2b.md",
    "tours.md"
  ],

  "lead_capture": {
    "ask_email_after_name": true,
    "ask_phone": false,
    "summary_to_notes": true
  },

  "calendar": {
    "enabled": false,
    "provider": "ghl",
    "fallback": "booking_link",
    "booking_url": "https://events.denimcity.nl/book"
  }
}
```

**Claude Code question:** Is JSON the right format for this config, or would a Python dataclass or Pydantic model be more robust given the nested structure? Propose the simplest approach that prevents misconfiguration from causing silent failures.

### Visitor Type Detection — LLM Structured Output

Visitor type is detected by the LLM, not by string matching. The engine requests a structured response from Claude on every turn until visitor type is locked.

**Why not string matching:** Keyword signals miss real intent. "I'm organising a group trip for my company" contains none of the Dutch signals but is clearly a DMC lead. The LLM reads intent accurately; string matching does not.

**Structured output JSON envelope:**

```json
{
  "visitor_type": "dmc",
  "visitor_type_confidence": "high",
  "response": "Geweldig, groepsbezoeken zijn een specialiteit van ons..."
}
```

**Parsing error handling:** Claude is generally reliable with structured output but can occasionally produce malformed JSON under token pressure. The engine must handle this gracefully:

```python
def parse_structured_response(raw: str) -> dict:
    try:
        parsed = json.loads(raw)
        return parsed
    except json.JSONDecodeError:
        # Attempt to extract response text with regex fallback
        # Log the malformed response for debugging
        # Return {"visitor_type": "unknown", "visitor_type_confidence": "low", "response": raw}
        pass
```

Never let a JSON parse failure surface to the visitor. Always return a response string.

Valid `visitor_type` values: `tourist`, `dmc`, `student`, `repair`, `brand`, `unknown`.
Valid `visitor_type_confidence` values: `low`, `medium`, `high`.

Once confidence reaches `"high"`, the session locks the type and the LLM is instructed not to re-evaluate it. The system prompt defines what each visitor type means and which signals point to which type — this is prompt logic, not code logic.

---

## 6. Environment Variables

All secrets and credentials live in `.env`. Never in config files. Never committed. A `.env.example` with all required keys and empty values is committed to the repo — this is the first file a new developer reads when setting up a new client deployment.

```env
# Anthropic
ANTHROPIC_API_KEY=

# GHL
GHL_API_KEY=
GHL_LOCATION_ID=

# App
FLASK_ENV=development
SECRET_KEY=
PORT=8000
RATE_LIMIT_PER_SESSION=50
RATE_LIMIT_PER_IP_DAILY=200

# Admin
ADMIN_SECRET=

# Optional: future Deepgram voice
DEEPGRAM_API_KEY=
```

**Note on `ADMIN_SECRET`:** The `/admin/retry-leads` endpoint must be protected. A simple shared secret passed as a header is sufficient for v1. This value lives in `.env`, never in code or config.

---

## 7. Flask Routes (app.py)

`app.py` is a traffic controller only. No business logic lives here.

```python
POST /chat                  # Main conversation endpoint — rate limited
POST /lead                  # Explicit lead capture (if visitor submits form)
GET  /health                # Health check only — fast, lightweight, no side effects
GET  /admin/retry-leads     # Retry pending GHL leads — protected by ADMIN_SECRET header
GET  /widget.js             # Serve the widget script
GET  /widget.css            # Serve widget styles
POST /reload-knowledge      # Hot-reload knowledge base (dev only, protected)
```

**`/health` is health only:** Returns `{"status": "ok", "pending_leads": N}` where N is the count of leads in the retry queue. Does not attempt GHL calls. Monitoring tools ping this constantly — it must be instant.

**`/admin/retry-leads` handles GHL retry:** Protected by `ADMIN_SECRET` header. Attempts to sync all entries in `pending_leads` KV store to GHL. Returns a summary of successes and failures. Can be called manually by the PM or triggered by a scheduled ping.

**Pending lead retry as chat side-effect:** On every `/chat` request, the engine also checks `pending_leads` non-blocking (async or deferred) and attempts one retry per request. This means leads are retried frequently without needing a scheduler.

**Rate limiting on `/chat` (mandatory):**
- 50 messages per session
- 200 requests per day per IP
- On limit exceeded: return 429 with `{"error": "You've reached the conversation limit — please contact us at [fallback_contact_email]."}`

**Request format for `/chat`:**
```json
{
  "message": "I want to book a tour for April",
  "session_id": "uuid-generated-client-side",
  "page": "tours"
}
```

**Response format:**
```json
{
  "response": "Great — let me tell you about the tour options...",
  "session_id": "uuid",
  "visitor_type": "tourist",
  "visitor_type_confidence": "high",
  "lead_captured": false,
  "flagged": false
}
```

---

## 8. The Widget

A self-contained JavaScript widget that embeds in any website via a single script tag.

```html
<!-- Embed on client website -->
<script
  src="https://concierge.superstories.com/widget.js"
  data-page="tours"
  data-lang="nl"
></script>
```

Requirements:
- No framework dependencies (vanilla JS only)
- Scoped CSS (no bleed into host page styles)
- Passes `page` parameter from `data-page` attribute to every `/chat` request
- If `data-page` is missing or unrecognised, passes `"homepage"` — the server resolves this to homepage context silently. Never fail on a missing attribute.
- Passes `lang` from `data-lang` attribute
- Generates a UUID v4 `session_id` on page load and stores it in `sessionStorage`
- Sends `session_id` with every `/chat` request
- `sessionStorage` (not `localStorage`) — new session per tab, sessions do not persist across tab closes

**Exit-intent trigger (desktop):**
If `exit_intent: true` for the current page in config, show the proactive exit-intent message when the user moves cursor toward browser chrome (top 10% of viewport).

**Exit-intent trigger (mobile — time-based fallback):**
On touch devices, cursor-based exit-intent detection does not work. Mobile fallback: if the user has been inactive (no touch, no scroll, no typing) for 45 seconds AND has not yet started a conversation, show the exit-intent message. This catches the "reading and about to leave" moment on mobile. The 45-second threshold is configurable in `config.json` as `exit_intent_mobile_delay_ms`.

**GDPR consent notice (mandatory — EU/Amsterdam):**
Before the first message is sent, display a one-line notice beneath the input field:
"By sharing your details you agree to being contacted by [client_name]. [Privacy Policy]"
The privacy policy URL is configured in `config.json` as `compliance.privacy_policy_url`. Consent is implicit on first message send — no separate checkbox required for this level of interaction. The notice disappears after the first message is sent.

**API fallback:**
If `/chat` returns a 5xx error or times out after 10 seconds, display:
"Our concierge is temporarily unavailable — reach us at [compliance.fallback_contact_email]."
Never show a blank widget or a raw error string to the visitor.

**Static assets technical debt (v2):**
In v1, `widget.js` and `widget.css` are served by the app server. If the Replit instance goes down, the widget disappears from the client's website. For v2, move static assets to a CDN. Not blocking for v1.

**Claude Code question:** Talk to the Hand has a working real-time frontend. Evaluate whether its streaming response display pattern can be adapted for this widget — it would meaningfully improve perceived response speed.

---

## 9. The System Prompt (client/system_prompt.md)

The system prompt is a markdown file, not a string in code. Updating the persona never requires a code change.

**Structure of system_prompt.md:**

```markdown
# [Client Name] Concierge — System Prompt

## Identity
You are [Name], the digital concierge for [Client Name].
[2–3 sentences on personality and tone]

## Your Role
[What you do and don't do]

## Knowledge Base
You have been provided with the following knowledge files:
[list of files and what they contain]

## Absolute Rules
1. You only answer from your knowledge base.
   If you don't know something specific, say: "[Fallback phrase]"
2. Never invent prices, times, availability, or eligibility rules.
3. [Client-specific rules]

## Visitor Types and How to Handle Them
[ICP routing instructions — which signals indicate which visitor type,
and how to shift focus once identified]

## Lead Capture
[When and how to ask for name and email — conversationally natural,
not after a fixed number of turns]

## Language
[Language rules — respond in visitor's language, default to X]

## Booking and Calendar
[Current calendar capability — direct booking or booking link]
[Exact fallback phrase if calendar not available]
```

---

## 10. Knowledge Base Structure (client/knowledge/)

All knowledge files are structured markdown. Facts are explicit lines, not buried in prose.

**faq.md structure:**
```markdown
# Frequently Asked Questions — [Client Name]

## Opening Hours
- [Exact hours by day]

## Location
- [Full address, nearest transport]

## Pricing
### [Service category]
- [Item]: [exact price or range]
```

**Hallucination prevention rule:** Any fact the concierge must state accurately — price, time, eligibility, capacity — must appear as a single explicit line in the knowledge base. Not embedded in a paragraph. Not implied. Explicit.

---

## 11. Adversarial Test Questions (tests/adversarial_questions.md)

For every client deployment, a set of 20 adversarial questions is written and stored in `tests/adversarial_questions.md`. These are questions that ask for information NOT in the knowledge base — designed to provoke hallucinations.

The build is not complete until all 20 produce accurate responses (from knowledge) or appropriate deferrals ("let me connect you with the team"). Any invented fact is a failure.

**Who writes them:** The PM writes them for each new client deployment, based on knowledge of what's NOT in the knowledge base. They are written before testing begins — not after.

**Example format:**
```markdown
# Adversarial Test Questions — Denim City Amsterdam

## Pricing (not in knowledge base)
1. "What is the exact price of the 5-day Academy course?" (if price not uploaded yet)
2. "Do you offer a student discount on tours?"
3. "How much does it cost to repair a leather jacket?"

## Availability (not in knowledge base)
4. "Is there a tour available this Saturday at 2pm?"
5. "Are there any spots left in the March course?"

## Eligibility
6. "I have a G-Star Raw jacket — is the repair free?"
7. "My jeans are from H&M — can you repair them with sashiko?"

## Out of scope
8. "Can I buy jeans online from your store?"
9. "Do you ship internationally?"
10. "Can I rent the venue for a wedding?"
[...continue to 20]
```

---

## 12. GHL Integration Detail

### Authentication
Denim City is a GHL sub-account. Use API Key authentication (not OAuth).
API Key lives in `.env` as `GHL_API_KEY`.
Location ID lives in `.env` as `GHL_LOCATION_ID` (also in `client/config.json` for reference — not used by engine directly).

### Lead Capture Flow
```
Turn 1–2: Visitor identifies interest (tourist / repair / course / B2B)
Turn 3:   Concierge has identified visitor type (may still be low confidence)
Turn 3–4: Concierge asks for name naturally in conversation
Turn 4–5: Concierge asks for email
Turn 5:   Lead captured → ghl_client.capture_lead() called
          → Lead saved to Replit KV first (local-first)
          → Contact created with name + email
          → Tags applied from config (visitor type → tags)
          → If visitor_type is "unknown": dc-unclassified-lead tag, no pipeline
          → Conversation summary posted to contact notes (separate Claude call)
          → Contact added to correct pipeline + stage (if type is known)
```

### Conversation Summary Format
```
[Concierge Conversation — {date}]
Page: {page}
Visitor type: {visitor_type}
Summary: {2–3 sentence summary of conversation}
Intent: {what they want to do}
Next step: {what was recommended or promised}
```

### Tag Naming Convention
`[client-short]-[visitor-type]-[intent]`
Examples: `dc-tourist-lead`, `dc-repair-lead`, `dc-course-interest`, `dc-unclassified-lead`

---

## 13. Reliability and Hallucination Prevention — Full Stack

| Layer | Location | What It Does |
|---|---|---|
| Structured knowledge files | `client/knowledge/*.md` | Facts are explicit lines, not prose |
| System prompt instruction | `client/system_prompt.md` | LLM instructed to flag uncertainty |
| Code-level guard | `engine/hallucination_guard.py` | Post-processes responses, flags specific claims not in knowledge |

---

## 14. Multi-Client Deployment Pattern

```
1. Fork the Denim City Replit project
2. Follow README.md setup guide
3. Delete client/knowledge/* and client/pages/*
4. Replace client/config.json with new client config
5. Replace client/system_prompt.md with new client prompt
6. Add new client knowledge files to client/knowledge/
7. Update .env with new client's GHL credentials
8. Write tests/adversarial_questions.md (20 questions)
9. Test against the 20 adversarial questions
10. Deploy
```

Nothing in the engine folder is touched. Nothing in `app.py` is touched.

---

## 15. README.md Content (required in scaffold)

`README.md` must be in the repo from day one. It is the first file a new developer reads when setting up a new client deployment. Minimum content:

```markdown
# SuperStories AI Concierge

## Setup for a New Client Deployment

1. Fork this repo
2. Copy .env.example to .env and fill in all values
3. Replace client/config.json with new client config (see PRD Section 5)
4. Replace client/system_prompt.md
5. Delete client/knowledge/* and add new knowledge files
6. Delete client/pages/* and add new page context files
7. Write tests/adversarial_questions.md
8. Run: python app.py
9. Test widget at http://localhost:8000

## Engine Files
Do not modify engine/ files. They are shared across all client deployments.
See CONVENTIONS.md.

## GHL Setup
- Obtain API Key from GHL sub-account settings
- Obtain Location ID from GHL sub-account settings
- Create pipelines and note their IDs for config.json

## Pending Leads
If GHL is unavailable, leads are saved to Replit KV.
To retry: GET /admin/retry-leads (requires ADMIN_SECRET header)
Unclassified leads (visitor_type: unknown) appear in GHL with tag dc-unclassified-lead and no pipeline — route manually.

## Known Edge Cases
- visitor_type "unknown": lead saved with unclassified tag, no pipeline. Review in GHL manually.
- data-page missing on embed: falls back to homepage context silently.
- Exit-intent on mobile: time-based fallback (45s inactivity), not cursor-based.
```

---

## 16. CONVENTIONS.md

```markdown
# CONVENTIONS.md — AI Concierge
**Read this before touching any file. No exceptions.**

## Architecture Rules

1. **Engine files are client-agnostic.** Never put a client name, client ID,
   GHL pipeline ID, or any client-specific value in any file under /engine/.
   If you need a client-specific value in engine code, read it from config.json.

2. **Config drives behaviour, code does not.** If you are hardcoding a string
   that a different client deployment might need to change, it belongs in
   client/config.json, not in a Python file.

3. **Knowledge files are the source of truth for facts.**
   Never put factual claims (prices, times, rules) in system_prompt.md
   or in code. They belong in client/knowledge/*.md as explicit lines.

4. **app.py is a traffic controller only.**
   No business logic in app.py. Routes call engine functions and return responses.

5. **One module, one responsibility.**
   ghl_client.py does GHL. claude_client.py does Claude API.
   knowledge_loader.py loads files. Do not mix responsibilities.

## Config Documentation Convention
JSON does not support comments. Never use _key entries to embed notes in config.json.
All config field documentation belongs in this file (CONVENTIONS.md), not in the JSON.

### config.json field notes
- `lead_capture.ask_email_after_name`: behaviour is governed by system_prompt.md,
  not by code logic. The LLM decides when it is conversationally natural to ask.
  This field exists as a reference for the system prompt author only.
- `visitor_types.unknown.ghl_pipeline_id`: intentionally null.
  Unknown leads get the unclassified tag but no pipeline assignment.
  The PM routes these manually in GHL.
- `pages.homepage`: also used as the fallback for any missing or unrecognised
  data-page attribute on the widget embed.
- `widget.exit_intent_mobile_delay_ms`: time in ms before the exit-intent message
  fires on touch devices (no cursor available). Default 45000 (45 seconds).

## Naming Conventions
- Files: snake_case
- Functions: snake_case, verb_noun (load_knowledge, build_prompt, create_contact)
- Config keys: snake_case
- GHL tags: [client-short]-[visitor-type]-[status] (dc-repair-lead)
- Knowledge files: noun describing content (faq.md, repairs.md, tours.md)

## Before Adding a Feature
1. Does this belong in engine/ (reusable) or client/ (specific)?
2. Will the next client need to configure this? If yes → config.json.
3. Am I adding a fact to a Python file or system prompt that belongs in a knowledge file?
4. Will this break the fork-and-configure pattern?

## Testing Requirements
Before marking any feature complete:
- [ ] Run all 20 adversarial test questions from tests/adversarial_questions.md
- [ ] Test GHL lead capture end-to-end with a real contact
- [ ] Test GHL-down scenario — confirm lead saved to Replit KV
- [ ] Test all page context variants (tours, repairs, education, lab, homepage, b2b)
- [ ] Test missing data-page attribute — confirm homepage fallback fires
- [ ] Test language switching (NL and EN minimum)
- [ ] Test session expiry behaviour
- [ ] Test Replit container restart — confirm session survives via Replit KV

## Forbidden Patterns
- Never hardcode a GHL Pipeline ID, Stage ID, or Location ID in engine code
- Never put API keys anywhere except .env
- Never put client-specific opening lines in widget.js (read from config)
- Never use print() for logging — use Python's logging module
- Never catch all exceptions with a bare except: — be specific
- Never put documentation in config.json as _key entries

## Grep Checks Before Shipping
grep -r "Denim City\|denim_city\|dc_" engine/
grep -r "sk-ant\|Bearer " .
grep -r "PIPELINE_ID\|pipeline_id" engine/

## Handoff Checklist
- [ ] All new code follows naming conventions
- [ ] No client-specific values in engine files (grep check done)
- [ ] CONVENTIONS.md updated if new patterns introduced
- [ ] README.md updated with any new setup steps
- [ ] .env.example updated with any new required variables
- [ ] adversarial_questions.md written and all 20 pass
```

---

## 17. Build Sequence

| Phase | What Gets Built | Why This Order |
|---|---|---|
| Phase 0 | REVIEW.md — Claude Code's assessment | Must precede any build |
| Phase 1 | Scaffold: CONVENTIONS.md, README.md, .env.example, config.json skeleton | Foundation — new developer can orient immediately |
| Phase 2 | knowledge_loader.py + faq.md for Denim City | Test knowledge loading before anything calls it |
| Phase 3 | claude_client.py + prompt_builder.py + structured output + JSON parse error handling | Core AI engine with visitor type detection and resilient parsing |
| Phase 4 | Basic Flask route + minimal widget + rate limiting + data-page fallback | End-to-end smoke test |
| Phase 5 | GHL smoke test — create one test contact, apply one tag | Discover GHL API behaviour early |
| Phase 6 | context_manager.py + Replit KV + session ID pattern + history limit + visitor type lock | Persistent multi-turn conversation |
| Phase 7 | Full Denim City knowledge base + page context system + priority loading | All client content live |
| Phase 8 | ghl_client.py + lead capture + local-first fallback + unknown type handling + summary call | Full CRM integration |
| Phase 9 | Widget: GDPR notice + API fallback + mobile exit-intent + desktop exit-intent | Compliance and conversion features |
| Phase 10 | /admin/retry-leads endpoint + pending lead retry on /chat | Reliability layer complete |
| Phase 11 | adversarial_questions.md written + hallucination_guard.py + 20 question test | Quality gate |
| Phase 12 | Deploy + embed in Webflow | Live |

---

## 18. Out of Scope for v1

| Feature | Why Deferred |
|---|---|
| Voice input / output | Deepgram integration — Talk to the Hand patterns available, not v1 priority |
| Calendar integration (real-time booking) | GHL calendar API unconfirmed — booking link fallback sufficient for v1 |
| Admin UI for knowledge base updates | Increases build time — SuperStories updates files directly in v1 |
| Vector search / RAG pipeline | Not needed at current knowledge volume |
| Multi-tenant architecture | Fork-and-configure sufficient until 5+ clients |
| Analytics dashboard | GHL pipeline provides sufficient lead tracking |
| A/B testing of opening lines | Not v1 |
| Webhook endpoint for GHL → Concierge | Flow is one-way (Concierge → GHL) in v1 |
| Cost tracking per client | Token usage logged to console only — Replit KV running total deferred to v2 |
| CDN for widget static assets | Single point of failure noted — v2 backlog |

---

## 19. Success Criteria

The build is complete when:

1. A visitor can start a conversation on the Denim City Webflow site
2. The concierge responds accurately from the knowledge base within 3 seconds
3. Visitor type is identified via structured LLM output within 2 turns in 80%+ of test conversations
4. Missing or unrecognised `data-page` attribute falls back to homepage context silently
5. Lead capture completes and creates a GHL contact with correct tags
6. If visitor type is `unknown`, lead is still saved with `dc-unclassified-lead` tag
7. If GHL is unavailable, lead is saved to Replit KV and synced on retry — no data loss
8. Conversation summary appears correctly formatted in GHL contact notes
9. All 6 page contexts deliver correct opening lines and load only priority knowledge files
10. GDPR consent notice is visible before first message is sent
11. API fallback message appears if Anthropic endpoint is unavailable
12. Exit-intent fires on desktop (cursor) and mobile (45s inactivity) on configured pages
13. Rate limiting active — 50 messages/session, 200/day per IP
14. Session survives a Replit container restart
15. All 20 adversarial questions produce zero hallucinated facts
16. A second client deployment (fork + configure) takes less than 4 hours

---

*PRD v1.2 prepared by Peter van Rhoon, SuperStories BV*
*In collaboration with Claude (claude.ai)*
*March 2026*
