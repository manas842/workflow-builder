# Workflow Builder

Chat-driven workflow builder. You describe an automation in chat, an LLM walks you through trigger → actions → conditions using inline widgets, and the output is a fully-resolved JSON workflow that a runner could execute without any further human input.

Built for the Anyreach SSE take-home.

## Development Process

I have used an LLM to speed up the build process. First I took an `awesome-design.md` reference (Vercel-style) as a base and wrote [DESIGN.md](./DESIGN.md) for this platform. From that I generated a prototype MVP design — the static HTML mock in [workflow-builder-vercel-v2.html](./workflow-builder-vercel-v2.html). Once the base design was set, I started building the system by scaffolding boilerplates with the LLM — I specified the exact files, folder structure, and how things should work, and the LLM filled in the rest. 

## Note
Happy to do a live coding round if LLM-assisted work isn't acceptable for this assignment — I can demonstrate the same depth without one.

## Stack

- **Frontend:** React + TypeScript, bundled with webpack + ts-loader (dev server with HMR locally; in prod the build is static assets served by Express)
- **Backend:** Node + Express + TypeScript — thin BFF, holds the LLM and Pipedream secrets, proxies everything the client needs, serves the built frontend in prod
- **LLM:** Anthropic (Claude) via tool calls — the model edits a `WorkflowDraft` through structured tools, never writes the JSON freehand + Pipedream MCP server
- **Integrations:** Pipedream Connect for OAuth + component discovery
- **Shared types:** zod schemas in a `shared/` package so the draft, the tool args, and the final JSON are all one type end-to-end

Going with Express + React (not Next) because the server-side is meaningful enough that I want it explicit and the two halves decoupled.

## Design

Visual system is in [DESIGN.md](./DESIGN.md). Static mock the design was extracted from: [workflow-builder-vercel-v2.html](./workflow-builder-vercel-v2.html). Short version: Geist/Vercel — two-pane shell (chat + live canvas/JSON rail), shadow-as-border, Geist Mono uppercase for anything technical, three accent colors (Blue/Pink/Red) reserved strictly for canvas pipeline nodes.

## Architecture (rough)

```
client/   React app — chat, inline widgets, canvas + JSON rail (own node_modules)
server/   Express — /chat (LLM proxy), /pipedream/* (token + components + auth), own node_modules, own .env
```


## Setup

Node 20+. Install each package separately.

```
cd server && npm install
cd ../client && npm install
```

Then create `server/.env` by copying `server/.env.example` and filling in the values:

| Var | Required | What it is |
|---|---|---|
| `ANTHROPIC_API_KEY` | ✅ | Your Anthropic API key (`sk-ant-…`). The server's only outbound LLM call uses this. Grab one at [console.anthropic.com](https://console.anthropic.com/). |
| `ANTHROPIC_MODEL` | optional | Defaults to `claude-sonnet-4-6` (with the 1M-context-window beta). Swap to `claude-haiku-4-5` for faster turns (smaller context, slightly weaker tool routing) or `claude-opus-4-7` for the strongest reasoning (slower). |
| `PIPEDREAM_CLIENT_ID` | ✅ | Pipedream Connect OAuth client ID. From your Pipedream project's **Connect → Settings**. |
| `PIPEDREAM_CLIENT_SECRET` | ✅ | Companion secret for the client ID. Server-side only — never exposed to the browser. |
| `PIPEDREAM_WORKSPACE_ID` | ✅ | Pipedream workspace identifier (looks like `o_xxxxx`). Used as the project ID fallback when `PIPEDREAM_PROJECT_ID` is empty. |
| `PIPEDREAM_PROJECT_ID` | optional | Specific Pipedream project ID (`proj_xxxxx`). If you have multiple projects under one workspace, set this; otherwise the workspace ID is used. |
| `PIPEDREAM_ENVIRONMENT` | optional | `development` or `production`. Defaults to `development`. **Must match the environment your connected Pipedream accounts live under** — accounts auth'd in one don't appear in the other. Keep it the same value locally and on Vercel so MCP can see the same accounts. |
| `PORT` | optional | Defaults to `4000`. Local Express port. On Vercel this is ignored (the serverless runtime supplies its own port). |
| `NODE_ENV` | optional | `development` locally, `production` on Vercel. Only affects logging and the in-Express static-fallback (Vercel handles statics itself). |

## Run

Dev — two terminals:

```
# terminal 1
cd server && npm run dev   # http://localhost:4000

# terminal 2
cd client && npm run dev   # http://localhost:3000, proxies /api → :4000
```

Prod — build the client, then start the server (it serves the built static assets):

```
cd client && npm run build
cd ../server && npm run build && npm start
```

Quick check: `curl http://localhost:3000/api/health` should return `{ "status": "ok", ... }`.

## Status

Shell is up: header, chat thread with empty state + composer, right rail with Canvas/JSON tabs. Backend has `/api/health`, `/api/chat` (LLM echo until `ANTHROPIC_API_KEY` is set), and `/api/pipedream/*` wired to the Connect SDK. Next: the tool-call loop so the LLM actually mutates the draft, plus the inline widgets (connect, configure, condition builder).

## Workflow JSON Architecture (v1.0)

I went with a **flat DAG (Directed Acyclic Graph)** design rather than a nested tree. It keeps the database happy, makes the UI canvas much easier to render, and lets us run non-dependent actions in parallel on the backend.

---

### 🏗️ Schema Blueprint

```json
{
  "version": 1,
  "id": "uniqueId",
  "name": "Human Readable Title",
  "trigger": {
    "id": "trigger-[uuid]",
    "type": "trigger",
    "app": "app_name",
    "componentKey": "exact-integration-event",
    "account": { "accountId": "token_id", "externalUserId": "user_id" },
    "config": { "api_specific_auth_or_target_configs": "..." }
  },
  "steps": [
    {
      "id": "condition-[uuid]",
      "type": "condition",
      "expression": {
        "type": "javascript",
        "code": "return Boolean(steps.trigger.event.value === 'match');"
      },
      "whenTrue": ["action-[uuid]"],
      "whenFalse": []
    },
    {
      "id": "action-[uuid]",
      "type": "action",
      "app": "target_app",
      "componentKey": "exact-integration-action",
      "account": { "accountId": "token_id" },
      "config": { "payload_fields": "..." }
    }
  ],
  "finalized": true
}
```

---

### 🧠 Why I Built It This Way

#### 1. Prefixed UUID Routing (`type-[uuid]`)
Instead of nesting steps inside blocks (which turns into a recursive nightmare), everything lives in a flat `steps` array. I explicitly route traffic via step IDs. 
* *Why?* Our frontend canvas can instantly scan the array and draw connection lines without deep-parsing, and the backend engine can process steps concurrently.

#### 2. Native JS Binding (`"type": "javascript"`)
I ditched structured visual condition operators (`equals`, `contains`) for direct code evaluation. 
* *Why?* It saves us from building an infinitely complex UI for nested `AND`/`OR` logic. The backend can drop this string straight into an isolated worker sandbox (using `isolated-vm` or `vm2` or even base `evak`), pass the runtime context, and check for a boolean return.

#### 3. Abstracted Auth (`account` and `external_connect_id`)
I never store API tokens or direct credentials in the workflow schema. 
* *Why?* Security and portability. The `accountId` maps back to an encrypted credentials table. This keeps our workflow payloads lightweight and safe to pass around our internal services.

---
