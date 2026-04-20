# Setting Up the Briefing Platform for a New Project

This tool is part of the **Integrated Content Manufacturing** methodology by SuperStories.
It is a proprietary internal briefing platform — not a public tool.

---

## What to change when starting a new project

There are exactly **3 files** to update. Everything else is generic infrastructure and stays untouched.

---

### 1. `client/src/lib/project.config.ts`

```ts
export const PROJECT_ID = "xx";        // short slug, e.g. "bm", "ww", "ct"
export const PROJECT_NAME = "Client Name";  // shown in the sidebar header
export const PROJECT_VERSION = "v1";   // start at v1, bump when structure changes significantly
```

- `PROJECT_ID` must be unique per project — it namespaces the localStorage keys
- `PROJECT_NAME` is what the PM sees in the sidebar header
- Bump `PROJECT_VERSION` whenever you make significant structural changes to `prd-defaults.ts` — this triggers the merge logic so existing users receive the updated structure

---

### 2. `client/src/lib/prd-defaults.ts`

This file contains the full site structure: every page, block, annotation, and brief.

**For a new project:**
1. Copy `prd-defaults-template.ts` to `prd-defaults.ts` (overwrite the existing file)
2. Replace the placeholder pages with the real site structure, section by section
3. Add blocks as the Figma design becomes available — the brief grows with the design

**The template gives you:**
- A Home page (hero + introduction + CTA)
- An About page (hero + story + contact CTA)
- A Contact page

Build from there. Each block follows the same structure:

```ts
{
  type: "hero" | "grid" | "section" | "cta" | "card-list",
  title: "Section Name",
  desc: "Internal note — what this section is for",
  content: ["bullet 1", "bullet 2", ...],
  annotations: [
    { team: "dev", text: "Developer instruction" },
    { team: "ghl", text: "GHL automation spec" },
    { team: "copy", text: "Copy brief for this section" },
  ],
}
```

---

### 3. Environment variables

Copy `.env.example` to `.env` and fill in:

```
DATABASE_URL=postgresql://user:password@host:5432/dbname
SESSION_SECRET=a-long-random-string
PORT=5000
```

---

## Deploying

This platform runs on Node.js + PostgreSQL. It is designed for deployment on Coolify, Railway, or any platform that supports Docker.

A `docker-compose.yml` is included for local development and self-hosted deployment.

For Coolify: point at the repo, set the environment variables, deploy. The Dockerfile handles the build.

---

## The knowledge files for the Claude.ai Project

When the brief is ready for copy production, export the relevant pages and add them to the Claude.ai Project alongside:

1. **Content strategy + ICPs** — the brand's positioning and target audiences
2. **Anti-AI style guide** — the SuperStories standard document (always the same, always included)
3. **Approved Voice Reference** — one calibration section, approved by the client before Round 1 begins

See the Integrated Content Manufacturing workflow document in Notion for the full process.

---

## Team reference

| File | Purpose | Change per project? |
|---|---|---|
| `project.config.ts` | Project ID, name, version | ✅ Yes |
| `prd-defaults.ts` | Full site brief and structure | ✅ Yes |
| `prd-defaults-template.ts` | Clean starting point | Never — keep as reference |
| `prd-constants.ts` | Team colors, block types, schema types | Only if teams differ |
| `prd-storage.ts` | Storage and sync logic | Never |
| `types/prd.ts` | Data model | Never |
| All components | UI | Never |
| `server/` | API, auth, database | Never |
