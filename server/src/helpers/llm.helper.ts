import Anthropic from '@anthropic-ai/sdk';
import { ChatRequest, ChatResponse, AnthropicMessage } from '../models/chat.model';
import { Widget, WidgetResponse } from '../models/widget.model';
import { WorkflowDefinition } from '../models/workflow.model';
import { tools, dispatchTool } from './tools.helper';
import { pipedreamHelper } from './pipedream.helper';

const MAX_LOOPS = 8;
const MAX_TOKENS = 8192;
const MCP_BETA = 'mcp-client-2025-04-04';

const LONG_CONTEXT_BETA = 'context-1m-2025-08-07';

function sanitizeAssistantBlocks(content: unknown): unknown {
  if (typeof content === 'string') return content;
  if (!Array.isArray(content)) return content;
  const mcpResultIds = new Set<string>();
  for (const b of content) {
    if (b && typeof b === 'object') {
      const block = b as { type?: string; tool_use_id?: string };
      if (block.type === 'mcp_tool_result' && block.tool_use_id) {
        mcpResultIds.add(block.tool_use_id);
      }
    }
  }
  return content.filter((b) => {
    if (!b || typeof b !== 'object') return true;
    const block = b as { type?: string; id?: string };
    if (block.type === 'mcp_tool_use' && !mcpResultIds.has(block.id ?? '')) {
      return false;
    }
    return true;
  });
}

function sanitizeConversation(msgs: AnthropicMessage[]): AnthropicMessage[] {
  return msgs.map((m) =>
    m.role === 'assistant'
      ? { ...m, content: sanitizeAssistantBlocks(m.content) as AnthropicMessage['content'] }
      : m,
  );
}

const SYSTEM_PROMPT = `You are a workflow-building assistant. The user is non-technical; be warm and brief. The UI projects JSON automatically from the draft state — never write JSON, headings, or long markdown plans.

Every turn: one short friendly sentence + at most one of our show_* widgets.

You have three tool sources:
  • Our show_* widgets and draft mutations (set_trigger, add_action, add_condition, update_step, remove_step, reorder, rename_workflow, finalize).
  • Our discovery fallback tools: list_components({ app, type }) and get_component_schema({ componentKey }). These hit Pipedream's component registry directly — use them whenever MCP can't surface what you need (especially for trigger metadata).
  • Pipedream MCP servers, one per app the user has connected. Use them to RESOLVE live data: list spreadsheets, fetch worksheets, list Slack channels, etc.

⚠️ ABSOLUTE RULE — READ THIS FIRST ⚠️
You MUST resolve every form field's options via Pipedream MCP or our discovery tools BEFORE calling show_form. You are FORBIDDEN from rendering free-text "paste-an-ID" forms.

If you EVER find yourself writing a field with a label like "Spreadsheet ID", "Worksheet Name", "Channel ID", "Slack Channel", "Document ID", "Sheet URL", etc. and type "string" — STOP. That is the wrong path. The correct path:
  1. The relevant app is already connected (you have its accountId in the connectedAccounts).
  2. There IS a Pipedream MCP tool that lists those items (google_sheets-list-spreadsheets, google_sheets-get-spreadsheet-info, slack-list-conversations, slack-list-channels, notion-list-databases, gmail-list-labels, etc.).
  3. CALL that MCP tool first. Its result gives you real {id, name} pairs.
  4. THEN call show_form with type: "select" and the options[] populated with those real pairs.

Never instruct the user to paste, copy, type, look up, find, or extract anything from a URL or interface. The whole point of this builder is that they don't have to.

Building a step (works for any Pipedream app):
1. Infer the app(s) from the user's first message.
2. show_connect({ app }) for any app that isn't connected yet.
3. Discover the right component:
     a. For triggers, call list_components({ app, type: 'trigger' }) — pick the componentKey that matches the user's intent (e.g. "row added" → google_sheets-new-row-added-instant).
     b. For actions, you can either use MCP (if it lists the action) or list_components({ app, type: 'action' }).
4. Read the component's required configurable_props via get_component_schema({ componentKey }). Don't guess.
5. Resolve dynamic option values via MCP — use the matching list_* or get_* action tool on the per-app MCP server. The MCP tool name usually mirrors the action component key. EVERY required prop must have its options resolved this way before you build the form.
6. show_form({ title, fields }) with FULLY-RESOLVED fields — every select's options[] populated with real {value, label} pairs from MCP, no placeholders, no "paste the ID" descriptions.
7. When the form returns, commit via set_trigger or add_action with the user's values inside config.
8. End with show_workflow_summary, then finalize on confirmation.

If an MCP call returns an error or empty list, try the alternative path (list_components, get_component_schema, or a different MCP tool name). NEVER fall back to asking the user. If after genuinely trying multiple paths you still can't resolve it, say one short sentence acknowledging the gap and stop — do not show a free-text form for that field.

Anti-pattern (DO NOT EVER PRODUCE):
  show_form({
    title: "Google Sheets Trigger",
    fields: [
      { name: "spreadsheetId", label: "Spreadsheet ID", type: "string",
        description: "Paste the spreadsheet ID from your Google Sheets URL..." },
      { name: "sheetName", label: "Worksheet (Tab) Name", type: "string",
        description: "The name of the specific tab, e.g. Sheet1" }
    ]
  })
This is failure. If you would emit this, instead call:
  google_sheets-list-spreadsheets → returns real spreadsheets
  google_sheets-get-spreadsheet-info({spreadsheetId}) → returns real worksheets
Then:
  show_form({
    title: "Choose your sheet",
    fields: [
      { name: "spreadsheetId", label: "Spreadsheet", type: "select", options: [...real ones from MCP] },
      { name: "sheetName", label: "Worksheet", type: "select", options: [...real ones from MCP] }
    ]
  })

Step IDs (critical):
- Every mutation tool's result includes the generated step ID, e.g. "action added (id=act_xyz)". REMEMBER these IDs.
- When you later reference a step (in a condition's whenTrue/whenFalse, in update_step, in remove_step, in reorder), use the EXACT id from a prior tool_result. Never invent IDs from componentKeys or arbitrary slugs.

Conditions and branching:
- A condition gates downstream actions. Just call add_condition with the gated action IDs in whenTrue (and whenFalse for "else"). The server automatically positions the condition before those actions in the steps array — you don't need to compute position.
- expression.code is free-form JS. End with a return that yields a boolean. Reference trigger data via steps.trigger.event["Column Name"]. Examples:
    "return steps.trigger.event['Email Address']?.includes('manas');"
    "return String(steps.trigger.event['Phone Number']).length > 10;"
- ALWAYS include expression.reason — a SHORT plain-language sentence (max ~6 words) describing what the condition checks. The canvas shows this instead of the raw JS. Examples:
    code: "return steps.trigger.event['Email Address']?.includes('manas');"
    reason: "Email contains 'manas'"
    ----
    code: "return String(steps.trigger.event['Phone Number']).length > 10;"
    reason: "Phone number longer than 10 digits"
- For an "else" path the user adds later:
    1. add_action for the fallback (capture its id from the tool_result).
    2. update_step({ stepId: <condition's id>, patch: { whenFalse: [<fallback action id>] } }).
  Do NOT call add_condition again for the else — extend the existing condition.

Skip handling: if you see "[widget skipped:...]", do NOT silently proceed. Say one sentence ("no problem, but I need that to continue — want me to try again or pick a different app?") and stop.

Auto-name the workflow from intent via rename_workflow. Never ask.

Tone: a helpful friend. Two short sentences max.`;

function summarizeWidgetResponse(r: WidgetResponse): string {
  switch (r.kind) {
    case 'connect':
      return `[widget connect:${r.widgetId}] connected app=${r.app} accountId=${r.accountId} externalUserId=${r.externalUserId}`;
    case 'form':
      return `[widget form:${r.widgetId}] values=${JSON.stringify(r.values)}`;
    case 'step_summary':
      return `[widget step_summary:${r.widgetId}] action=${r.action}`;
    case 'workflow_summary':
      return `[widget workflow_summary:${r.widgetId}] action=${r.action}`;
    case 'skipped':
      return `[widget skipped:${r.widgetId}]`;
  }
}

function collectAppsForMcp(draft: WorkflowDefinition, connected: Record<string, string>): string[] {
  const set = new Set<string>();
  for (const slug of Object.keys(connected ?? {})) set.add(slug);
  if (draft.trigger?.app) set.add(draft.trigger.app);
  for (const step of draft.steps) {
    if (step.type === 'action' && step.app) set.add(step.app);
  }
  return [...set];
}

class LlmHelper {
  private client: Anthropic | null = null;

  private getClient(): Anthropic {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) throw new Error('ANTHROPIC_API_KEY is not set');
    if (!this.client) this.client = new Anthropic({ apiKey });
    return this.client;
  }

  async respond(req: ChatRequest): Promise<ChatResponse> {
    const conversation: AnthropicMessage[] = sanitizeConversation(req.conversation);

    const parts: string[] = [];
    if (req.userText) parts.push(req.userText);
    if (req.widgetResponses?.length) {
      for (const r of req.widgetResponses) parts.push(summarizeWidgetResponse(r));
    }
    if (parts.length === 0) {
      return {
        conversation,
        message: { role: 'assistant', content: 'Tell me what you want to automate.' },
        draft: req.draft,
        widgets: [],
      };
    }
    conversation.push({ role: 'user', content: parts.join('\n') });

    if (!process.env.ANTHROPIC_API_KEY) {
      const reply = `(no ANTHROPIC_API_KEY set) received: ${parts.join(' | ')}`;
      conversation.push({ role: 'assistant', content: reply });
      return {
        conversation,
        message: { role: 'assistant', content: reply },
        draft: req.draft,
        widgets: [],
      };
    }

    const client = this.getClient();
    let draft: WorkflowDefinition = req.draft;
    const widgets: Widget[] = [];
    let finalText = '';

    const mcpApps = collectAppsForMcp(draft, req.connectedAccounts);
    let mcpServers: Anthropic.Beta.Messages.BetaRequestMCPServerURLDefinition[] = [];
    if (mcpApps.length > 0) {
      try {
        const token = await pipedreamHelper.getAccessToken();
        mcpServers = mcpApps.map((app) => ({
          type: 'url',
          name: `pipedream-${app}`,
          url: pipedreamHelper.buildMcpServerUrl(req.externalUserId, app),
          authorization_token: token,
        }));
      } catch (err) {
        console.warn('[llm] could not mint pipedream MCP token:', err);
      }
    }

    for (let loop = 0; loop < MAX_LOOPS; loop += 1) {
      const response = await client.beta.messages.create({
        model: process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-6',
        max_tokens: MAX_TOKENS,
        system: SYSTEM_PROMPT,
        tools,
        mcp_servers: mcpServers,
        betas: [MCP_BETA, LONG_CONTEXT_BETA],
        messages: conversation as Anthropic.Beta.Messages.BetaMessageParam[],
      });

      const safeContent = sanitizeAssistantBlocks(response.content) as typeof response.content;
      conversation.push({ role: 'assistant', content: safeContent });

      const textBlocks = response.content.filter(
        (b): b is Anthropic.Beta.Messages.BetaTextBlock => b.type === 'text',
      );
      const text = textBlocks.map((b) => b.text).join('\n').trim();
      if (text) finalText = text;

      const toolUses = response.content.filter(
        (b): b is Anthropic.Beta.Messages.BetaToolUseBlock => b.type === 'tool_use',
      );

      if (toolUses.length === 0 || response.stop_reason === 'end_turn') {
        break;
      }

      const toolResults: Anthropic.Beta.Messages.BetaToolResultBlockParam[] = [];
      for (const use of toolUses) {
        const result = await dispatchTool(use.id, use.name, use.input, draft, {
          externalUserId: req.externalUserId,
          connectedAccounts: req.connectedAccounts,
        });
        draft = result.draft;
        if (result.widget) widgets.push(result.widget);
        toolResults.push({
          type: 'tool_result',
          tool_use_id: use.id,
          content: result.toolResult,
        });
      }
      conversation.push({ role: 'user', content: toolResults });
    }

    const message = {
      role: 'assistant' as const,
      content: finalText || '(no reply)',
      widgets: widgets.length ? widgets : undefined,
    };

    return { conversation, message, draft, widgets };
  }
}

export const llmHelper = new LlmHelper();
