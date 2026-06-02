# Design System of workflow.builder

## 1. Visual Theme & Atmosphere

workflow.builder applies the Geist / Vercel design language to a conversational product surface. Where the Vercel marketing site uses gallery emptiness to sell infrastructure, this product uses the same restraint to make a *builder* feel calm and trustworthy: a tool that constructs deterministic automations should itself feel deterministic. The canvas is overwhelmingly white (`#ffffff`) with near-black (`#171717`) ink, and every pixel of structure is carried by whisper-level shadows rather than drawn borders. Nothing floats; everything feels built.

The interface is split into two living halves. On the left, a **chat thread** is the entire authoring experience — the user never leaves it to configure an action or connect an app. On the right, a **workflow canvas** renders the automation as a UML-style flow diagram that draws itself in real time as the conversation progresses. The two halves share one source of truth, so the diagram is always an exact, deterministic projection of what was said in chat.

Geist Sans and Geist Mono are the only typefaces, with OpenType `"liga"` enabled globally. Geist Mono is reserved for the "developer console" voice — sender labels, widget titles, node types, status lines, and resolved account references — which quietly signals that the chat is producing real, technical artifacts. The one permitted spot of warmth is a single accent family used *only* on the canvas: Develop Blue, Preview Pink, and Ship Red mark the trigger, condition, and action stages of the pipeline. Everywhere else the palette is strictly achromatic.

The product is also unapologetically animated. Messages slide in from their sender's side, a typing indicator precedes every assistant reply, widgets reveal a beat after their bubble, and canvas nodes pop in before their connecting edges draw themselves along bezier paths. Motion is the "magic" layer — but it is restrained, fast, and never decorative-for-its-own-sake.

**Key Characteristics:**
- Geist Sans + Geist Mono only; `"liga"` global; three weights (400 / 500 / 600), no 700
- Near-pure white canvas (`#ffffff`) with `#171717` ink — never pure black or white
- Shadow-as-border throughout: `0 0 0 1px rgba(0,0,0,0.08)` replaces CSS borders
- Multi-layer card shadow stacks including the `#fafafa` inner glow ring
- Two-pane layout: chat (authoring) + live UML canvas (projection of state)
- Geist Mono uppercase for all technical labels — the "console voice"
- Workflow accents (Blue / Pink / Red) appear *only* on canvas pipeline nodes
- Light-blue assistant identity: a sparkle icon in a tinted chip
- User messages highlighted with a soft blue-tint bubble; assistant in white
- Seamless gradient composer that dissolves into the chat — no footer border
- Animation as a first-class layer: entrance, typing, edge-drawing, finalize glow

---

## 2. Color Palette & Roles

### Primary
- **Ink** (`#171717`): Primary text, headings, dark button fills, sparkle on dark. Not pure black — the micro-warmth prevents harshness.
- **Canvas** (`#ffffff`): Page background, card and bubble surfaces, dark-button text.
- **Tint** (`#fafafa`): Subtle surface fill (code block, segmented-tab track, pill tags) and the inner glow ring in card shadows.

### Workflow Accents — canvas pipeline ONLY
- **Develop Blue** (`#0a72ef`): The **trigger** node — left accent bar, type label, and the edge leaving the trigger.
- **Preview Pink** (`#de1d8d`): The **condition** node — accent, type label, branch edges, and the `if` keyword in the condition builder.
- **Ship Red** (`#ff5b4f`): The **action** node — accent and type label.

These are functional, never decorative. They never appear in chrome, buttons, or text.

### Chrome Blue (the one permitted UI color)
- **Badge Bg** (`#ebf5ff`): Status badge background, the user-message bubble highlight.
- **Badge Text** (`#0068d6`): Status badge text.
- **Icon Blue** (`#5b9df7`): The assistant sparkle icon and empty-state hero mark — a light, friendly blue.
- **Avatar/Hero Tint** (`#eef5ff`): Background chip behind the sparkle.
- **Focus** (`hsla(212,100%,48%,1)`) / focus ring `rgba(10,114,239,0.14)`: Keyboard focus and input focus glow.

### Console / Code (JSON syntax)
- **Console Blue** (`#0070f3`): String values.
- **Console Purple** (`#7928ca`): Numbers and booleans.
- **Punctuation Gray** (`#808080`): Braces, brackets, commas.
- Keys render in `#171717`.

### Neutral Scale
- **Gray 900** (`#171717`): Primary text.
- **Gray 600** (`#4d4d4d`): Secondary text, suggestion-chip label.
- **Gray 500** (`#666666`): Muted labels, descriptions, sender tags.
- **Gray 400** (`#808080`): Placeholder, faint mono labels, select carets.
- **Gray 100** (`#ebebeb`): Dividers, scrollbar thumb, canvas connector lines.
- **Gray 50** (`#fafafa`): Surface tint, shadow glow ring.
- **Avatar Chip Gray** (`#f4f4f5`): Alternate neutral avatar fill (when not using blue).

### Status
- **Success Green** (`#10b981` dot / `#0a8a4d` text): Connected state, finalized status, finalize glow `rgba(16,185,129,0.18)`.

### Shadows & Depth
- **Ring** (`0 0 0 1px rgba(0,0,0,0.08)`): The signature border substitute.
- **Ring Strong** (`0 0 0 1px rgba(0,0,0,0.16)`): Hover emphasis on ghost elements.
- **Card Stack** (`0 0 0 1px rgba(0,0,0,.08), 0 2px 2px rgba(0,0,0,.04), 0 8px 8px -8px rgba(0,0,0,.04), 0 0 0 1px #fafafa`): Widgets, canvas nodes, elevated panels.

---

## 3. Typography Rules

### Font Family
- **Primary**: `Geist`, fallbacks `Arial, "Apple Color Emoji", sans-serif`
- **Monospace**: `Geist Mono`, fallbacks `ui-monospace, SFMono-Regular, "Roboto Mono", Menlo, Monaco, "Courier New", monospace`
- **OpenType**: `font-feature-settings:"liga" 1` globally.

This product runs at smaller sizes than a marketing site, so tracking is gentler: headings sit at `-0.03em` (≈ -0.7px at 23px) and body runs at normal tracking. The compression identity is preserved at heading scale; body never receives positive tracking.

### Hierarchy

| Role | Font | Size | Weight | Line Height | Tracking | Notes |
|------|------|------|--------|-------------|----------|-------|
| Brand / Hero heading | Geist | 17–23px | 600 | 1.2–1.3 | -0.03em | App brand, empty-state heading |
| Node title | Geist | 14px | 500 | 1.25 | -0.01em | Canvas node primary line |
| Message / body | Geist | 15.5px | 400 | 1.55 | normal | Chat bubbles |
| Control / input | Geist | 15px | 400 | 1.4 | normal | Form fields, composer |
| Button | Geist | 14px | 500 | 1.2 | normal | All buttons |
| Field label | Geist | 14px | 500 | 1.4 | normal | Widget form labels (muted) |
| Suggestion chip | Geist | 13.5px | 400 | 1.3 | normal | Empty-state example |
| Sender tag | Geist Mono | 12px | 500 | 1.0 | +0.04em, UPPER | `USER` / `ASSISTANT` (currently icon-only) |
| Widget title | Geist Mono | 12px | 500 | 1.0 | +0.05em, UPPER | "CONNECT APP", "CONFIGURE TRIGGER" |
| Pill tag | Geist Mono | 12px | 400 | 1.0 | normal | Widget tag, account-ref code |
| Node type | Geist Mono | 10–11px | 500 | 1.0 | +0.08–0.10em, UPPER | "TRIGGER" / "CONDITION" / "ACTION" |
| Edge label | Geist Mono | 10px | 400 | 1.0 | +0.06em, UPPER | "TRUE" / "FALSE" |
| Status line | Geist Mono | 12px | 400 | 1.0 | +0.04em, UPPER | "DRAFT · 4 NODES" |
| JSON | Geist Mono | 13px | 400 | 1.6 | normal | Code panel |

### Principles
- **Mono is the technical voice.** Anything that names a system concept — an app, an account, a node type, a status — is Geist Mono uppercase. Anything conversational or human is Geist Sans.
- **Three weights, strict roles.** 400 body, 500 UI/labels/buttons, 600 brand/headings/node titles. No 700.
- **Hierarchy through size + mono/sans contrast, not weight.** The narrow weight range is intentional.
- **Tracking is negative or zero.** Headings `-0.03em`; body and UI normal. Never positive.

---

## 4. Component Stylings

### Buttons

**Primary (Dark)**
- Bg `#171717`, text `#ffffff`, radius 6px, padding `9px 16px`, Geist 14/500.
- Hover bg `#383838`; active `translateY(1px)`; focus `2px solid` focus blue, offset 2px.
- Use: Send, Connect, Use this, Finalize, Add condition.

**Ghost (Shadow-bordered)**
- Bg `#ffffff`, text `#171717`, `box-shadow:0 0 0 1px rgba(0,0,0,.08)`, radius 6px.
- Hover ring strengthens to `rgba(0,0,0,.16)`.
- Use: Skip, Copy, secondary actions.

**Status Badge (Pill)**
- Bg `#ebf5ff`, text `#0068d6`, radius 9999px, padding `3px 11px`, Geist 12/500, with a pulsing 6px dot.
- Use: "session active". Pills are for badges only — never primary actions.

**Suggestion Chip (Pill, ghost)**
- Bg `#ffffff`, `--sh-ring`, radius 9999px, padding `9px 16px`, Geist 13.5/400, text `#4d4d4d`.
- Use: empty-state example prompt that pre-fills the composer.

### Chat — Sender Distinction

**User message**
- Right-aligned. Bubble bg `#ebf5ff`, text `#171717`, `box-shadow:0 0 0 1px rgba(10,114,239,.20)`.
- Radius `16px 16px 4px 16px` (notch bottom-right). Max-width 82%.
- Entrance: slide in from the right (`translate(10px,10px) scale(.97)` → none), 0.44s.

**Assistant message**
- Left-aligned, with a 28px avatar chip (bg `#eef5ff`, radius 8px, `--sh-ring`) holding the **Phosphor Sparkle** icon (fill weight) in Icon Blue `#5b9df7`, 16px.
- Bubble bg `#ffffff`, `--sh-ring`, radius `4px 16px 16px 16px` (notch bottom-left).
- Widgets render inside the assistant content column, below the bubble.
- Entrance: slide in from the left, 0.44s.

**Typing indicator**
- Assistant row with the sparkle avatar and a white bubble containing three 7px gray dots bouncing in sequence (`blink` 1.3s, staggered 0.18s). Shown before every assistant reply, then replaced by the message.

### Empty State (default)
- Centered hero in the chat region: a 54px tinted chip (`#eef5ff`, 14px radius) with a 28px blue sparkle, a 23px/600 heading ("What should we automate?"), one muted line, and a suggestion chip.
- Persists until the user sends the first message, which clears it and starts the build flow.

### Composer (seamless)
- Floating overlay pinned to the bottom of the chat column — **no border, no footer line**.
- Background is a top-transparent gradient: `linear-gradient(to top, #ffffff 58%, rgba(255,255,255,0))`, so messages scroll up and dissolve into it.
- Input: white, `--sh-ring`, radius 6px, padding `13px 16px`; focus adds `0 0 0 1px #0a72ef, 0 0 0 4px rgba(10,114,239,.14)`. Dark Send button beside it.
- The chat scroll region carries bottom padding so the last message always clears above the input.

### Widgets (inline cards)
- White, full card-stack shadow, radius 8px, overflow hidden. Enter with `widgetIn` (0.5s, +0.14s delay after the bubble).
- **Header:** Geist Mono uppercase title + a muted mono pill tag (`#fafafa`, `--sh-ring`, 9999px), separated by a 1px hairline shadow.
- **Connect card:** app icon (34px, brand-colored, 6px radius) + name + dark Connect button. On click → "Connecting…" → success state: green haloed dot + "connected" + mono `code` account ref, animated in with a pop.
- **Configure form:** label (14/500 muted) + control. Control: white, `--sh-ring`, radius 6px, padding `11px 14px`, custom dual-gradient select caret, blue focus ring.
- **Field chips:** mono 12px pills, `--sh-ring`, 6px radius; hover strengthens ring; active scales to .95.
- **Condition builder:** `if [field] [op] [value]` row; `if` is Pink mono uppercase; a preview line shows true/false routing.
- **Message template:** channel select + field chips + input; a live preview resolves `{Field}` tokens to sample values in bold.

### Tabs (segmented control)
- A `#fafafa` track with `--sh-ring`, radius 8px, 3px padding. Tabs are 14/500; the active tab is `#171717` fill with white label, radius 6px. Labels: "Canvas" / "JSON".

### Workflow Canvas (UML pipeline)
- **Nodes:** white, full card-stack, radius 8px, absolutely positioned. A 3px left accent bar by type (Blue/Pink/Red). Content: mono uppercase type label in the accent color, 14/500 title, mono sub line in `#666`.
- **Edges:** SVG bezier paths, `stroke-width:1.6`, colored by source node (Blue from trigger, Pink from condition), with matching arrowhead markers. They animate by `stroke-dashoffset` (drawing on) after nodes settle.
- **Branch labels:** "TRUE" / "FALSE" mono pills (`--sh-ring`) at the top of each branch action.
- **Empty state:** a muted line inviting the user to connect the trigger.
- **Finalize:** a one-shot green glow pulse across all nodes.

### JSON Panel
- `#fafafa` block, `--sh-ring`, radius 8px, Geist Mono 13/1.6. Syntax: keys `#171717`, strings `#0070f3`, numbers/bools `#7928ca`, punctuation `#808080`.
- Ghost Copy button floated top-right; a mono uppercase status line below ("DRAFT · N NODES" → "✓ FINALIZED · RUNNER-READY" in green).

---

## 5. Layout Principles

### Spacing System
- Base unit 8px. Common steps: 4, 6, 8, 10, 12, 14, 16, 18, 22, 28, 34px.
- Chat turn gap 22px; widget internal padding 16px; field gap 14px.

### Grid & Container
- **Shell:** CSS grid, `minmax(0,1fr) 400px` — fluid chat column + fixed 400px rail.
- **Chat column:** flex column; a scrolling region (`flex:1; overflow-y:auto`) with a floating composer overlay. Content centered at max-width 740px.
- **Canvas:** internal coordinate width ~344px, centered in the rail; node width 160px (single, centered) or two ~160px nodes for branches.
- Header is a sticky white bar with a bottom hairline shadow.

### Whitespace Philosophy
- **Calm density.** The chat breathes (22px turn gaps, generous bubble padding) while the rail stays compact and scannable.
- **Separation by shadow and spacing**, never colored dividers. The only hairlines are 1px shadow lines (header bottom, widget header).
- **The composer merges, not divides** — its gradient replaces the conventional input border, so the chat feels continuous to its edge.

### Border Radius Scale
- 6px: buttons, inputs, controls, field chips, avatar chip.
- 8px: widget cards, canvas nodes, segmented track, JSON block.
- 14–16px: chat bubbles (with one 4px notch corner) and the hero mark.
- 9999px: badges, pill tags, branch labels, suggestion chip.

---

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| Flat (0) | No shadow | Page, text, gradient composer |
| Ring (1) | `0 0 0 1px rgba(0,0,0,.08)` | Inputs, ghost buttons, pill tags, avatar |
| Blue Ring (1b) | `0 0 0 1px rgba(10,114,239,.16–.20)` | Avatar/hero chip, user bubble |
| Full Card (2) | Ring + `0 2px 2px` + `0 8px 8px -8px` + `#fafafa` ring | Widgets, canvas nodes, panels |
| Focus | `0 0 0 1px #0a72ef, 0 0 0 4px rgba(10,114,239,.14)` (inputs) / `2px solid` focus blue (buttons) | Keyboard + input focus |
| Finalize glow | one-shot `0 0 0 4px rgba(16,185,129,.18)` pulse | Canvas nodes on finalize |

**Shadow Philosophy.** Depth is built, not floated. Every elevated surface uses the layered stack whose final `#fafafa` ring produces the subtle inner glow — never omit it. Shadows stay whisper-level (≤ 0.08 opacity for the ring, ≤ 0.04 for ambient). No element uses a heavy drop shadow, gradient fill (except the composer fade), or blur.

---

## 7. Do's and Don'ts

### Do
- Use shadow-as-border (`0 0 0 1px rgba(0,0,0,.08)`) and the full card stack with its `#fafafa` glow ring.
- Keep chrome achromatic; let Chrome Blue (`#ebf5ff`/`#5b9df7`/`#0068d6`) be the only UI color.
- Reserve Blue/Pink/Red strictly for canvas pipeline nodes (trigger/condition/action).
- Use Geist Mono uppercase for every technical label; Geist Sans for conversation.
- Animate entrances (messages, widgets, nodes, edges) and precede assistant replies with the typing indicator.
- Distinguish senders by alignment + bubble treatment + the sparkle avatar.
- Resolve human-friendly `{Field}` tokens to deterministic `{{...}}` in the JSON while showing the friendly form in the UI.

### Don't
- Don't use CSS `border` on cards, bubbles, or inputs — use the shadow technique.
- Don't put a hard line/footer under the composer — it must fade into the chat.
- Don't use the workflow accents (Blue/Pink/Red) on buttons, text, or chrome.
- Don't use weight 700, positive tracking, or a second typeface.
- Don't use pure `#000`/`#fff`, warm colors in chrome, or heavy/blurred shadows.
- Don't use pill radius on primary buttons; pills are badges/labels only.
- Don't re-trigger node/edge animations on every keystroke — animate only on structural change, update text in place otherwise.
- Don't let the assistant render the final JSON itself — it is projected from state, not authored.

---

## 8. Responsive Behavior

### Breakpoints
| Name | Width | Key Changes |
|------|-------|-------------|
| Mobile | <920px | Rail (canvas/JSON) hidden; chat goes full width |
| Desktop | ≥920px | Two-pane shell: fluid chat + 400px rail |

### Touch Targets
- Buttons `9px 16px`; inputs `13px 16px` (composer) — comfortable tap areas.
- Field chips `6px 11px`; pills `3px 11px` with adequate spacing.

### Collapsing Strategy
- Below 920px the right rail is removed entirely; the chat is the whole experience (consistent with "chat is the interface"). A future mobile pattern would surface the canvas/JSON behind a toggle or bottom sheet.
- Chat content stays centered at max-width 740px and reflows naturally; bubbles cap at 82% width.
- The composer remains a pinned gradient overlay at all widths.

### Canvas Behavior
- The diagram uses a fixed internal coordinate space sized to the 400px rail; nodes and branch columns are tuned to fit without horizontal scroll. On a wider canvas the same layout simply gains margin.

---

## 9. Agent Prompt Guide

### Quick Color Reference
- Background: `#ffffff` · Ink/heading: `#171717` · Body: `#4d4d4d` · Muted: `#666666` · Placeholder/faint: `#808080`
- Ring (border): `0 0 0 1px rgba(0,0,0,0.08)` · Tint surface: `#fafafa`
- Chrome blue: badge `#ebf5ff`/`#0068d6`, icon `#5b9df7`, hero tint `#eef5ff`
- Focus: `hsla(212,100%,48%,1)` + ring `rgba(10,114,239,0.14)`
- Canvas accents (pipeline only): trigger `#0a72ef`, condition `#de1d8d`, action `#ff5b4f`
- JSON: key `#171717`, string `#0070f3`, number `#7928ca`, punctuation `#808080`
- Button: bg `#171717`, text `#ffffff`

### Example Component Prompts
- "Build an assistant chat row: 28px chip `#eef5ff` with `0 0 0 1px rgba(10,114,239,.16)`, holding a 16px Phosphor Sparkle (fill) in `#5b9df7`; beside it a white bubble with `0 0 0 1px rgba(0,0,0,.08)`, radius `4px 16px 16px 16px`, Geist 15.5/400. Slide in from the left over 0.44s."
- "Build a user chat bubble: right-aligned, bg `#ebf5ff`, text `#171717`, `0 0 0 1px rgba(10,114,239,.20)`, radius `16px 16px 4px 16px`, Geist 15.5/400."
- "Build an inline widget card: white, shadow stack `0 0 0 1px rgba(0,0,0,.08), 0 2px 2px rgba(0,0,0,.04), 0 8px 8px -8px rgba(0,0,0,.04), 0 0 0 1px #fafafa`, radius 8px. Header: Geist Mono 12px uppercase title `#666` + a `#fafafa` pill tag; 1px shadow hairline below. Reveal 0.14s after the bubble."
- "Build a canvas node: white card-stack, radius 8px, 3px left bar `#0a72ef`; Geist Mono 10px uppercase 'TRIGGER' in `#0a72ef`, Geist 14/500 title, Geist Mono 11.5px sub in `#666`. Pop in with scale .85 → 1."
- "Build a seamless composer: floating overlay pinned bottom, `linear-gradient(to top, #ffffff 58%, transparent)`, no border. Input white with `0 0 0 1px rgba(0,0,0,.08)`, radius 6px, focus `0 0 0 1px #0a72ef, 0 0 0 4px rgba(10,114,239,.14)`; dark Send button."
- "Build a segmented tab control: `#fafafa` track with `0 0 0 1px rgba(0,0,0,.08)`, radius 8px, 3px pad; active tab `#171717` fill, white label, radius 6px."

### Iteration Guide
1. Shadow-as-border is the foundation; cards always include the `#fafafa` inner glow ring.
2. Three weights (400/500/600); headings `-0.03em`, body normal — tracking is never positive.
3. Geist Mono uppercase = technical voice; Geist Sans = conversation.
4. Color is functional: Chrome Blue is the only UI color; Blue/Pink/Red live only on canvas nodes.
5. The chat is the interface — structured input becomes inline widgets, not separate pages.
6. The canvas and JSON are *projections* of one state object; never author the JSON directly.
7. Motion is a feature: entrance on every element, typing before every reply, edges that draw, a finalize glow — but fast (0.12–0.6s) and only on meaningful change.
8. The composer fades into the chat; it never has a border or footer line.