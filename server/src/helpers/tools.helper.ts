import type Anthropic from '@anthropic-ai/sdk';
import { WorkflowDefinition } from '../models/workflow.model';
import { Widget, FieldDef } from '../models/widget.model';
import { draftHelper, TriggerArgs, ActionArgs, ConditionArgs } from './draft.helper';
import { widgetHelper } from './widget.helper';
import { pipedreamHelper } from './pipedream.helper';

type AnthropicTool = Anthropic.Tool;

export const tools: AnthropicTool[] = [

  {
    name: 'set_trigger',
    description:
      'Set the workflow trigger. Call after the user has authenticated the source app and you have a fully-resolved config object (every required prop filled).',
    input_schema: {
      type: 'object',
      properties: {
        app: { type: 'string' },
        componentKey: { type: 'string' },
        account: {
          type: 'object',
          properties: {
            app: { type: 'string' },
            accountId: { type: 'string' },
            externalUserId: { type: 'string' },
          },
          required: ['app', 'accountId', 'externalUserId'],
        },
        config: { type: 'object', additionalProperties: true },
      },
      required: ['app', 'componentKey', 'account', 'config'],
    },
  },
  {
    name: 'add_action',
    description:
      'Append an action step. Call after the user has authenticated the target app and you have a fully-resolved config object.',
    input_schema: {
      type: 'object',
      properties: {
        app: { type: 'string' },
        componentKey: { type: 'string' },
        account: {
          type: 'object',
          properties: {
            app: { type: 'string' },
            accountId: { type: 'string' },
            externalUserId: { type: 'string' },
          },
          required: ['app', 'accountId', 'externalUserId'],
        },
        config: { type: 'object', additionalProperties: true },
        position: { type: 'number' },
      },
      required: ['app', 'componentKey', 'account', 'config'],
    },
  },
  {
    name: 'add_condition',
    description:
      'Insert a condition step. `expression.code` is free-form JS that ends with a `return <boolean>` (the runner wraps it). Reference trigger data via steps.trigger.event[...]. whenTrue / whenFalse are arrays of step IDs (from prior tool results) that fire on each branch. Use `position` so the condition is placed BEFORE the action(s) it gates.',
    input_schema: {
      type: 'object',
      properties: {
        expression: {
          type: 'object',
          properties: {
            code: { type: 'string' },
            reason: {
              type: 'string',
              description:
                'A one-line plain-language summary of what the condition checks, e.g. "Email contains \'manas\'" or "Phone number length > 10". Used as the human-readable label on the canvas.',
            },
          },
          required: ['code', 'reason'],
        },
        whenTrue: { type: 'array', items: { type: 'string' } },
        whenFalse: { type: 'array', items: { type: 'string' } },
        position: { type: 'number' },
      },
      required: ['expression'],
    },
  },
  {
    name: 'update_step',
    description: 'Patch fields on an existing step.',
    input_schema: {
      type: 'object',
      properties: {
        stepId: { type: 'string' },
        patch: { type: 'object', additionalProperties: true },
      },
      required: ['stepId', 'patch'],
    },
  },
  {
    name: 'remove_step',
    description: 'Remove a step by id.',
    input_schema: {
      type: 'object',
      properties: { stepId: { type: 'string' } },
      required: ['stepId'],
    },
  },
  {
    name: 'reorder',
    description: 'Reorder steps. Provide the full list of step ids in the new order.',
    input_schema: {
      type: 'object',
      properties: { stepIds: { type: 'array', items: { type: 'string' } } },
      required: ['stepIds'],
    },
  },
  {
    name: 'rename_workflow',
    description: 'Rename the workflow. Call early, derived from the user intent.',
    input_schema: {
      type: 'object',
      properties: { name: { type: 'string' } },
      required: ['name'],
    },
  },
  {
    name: 'finalize',
    description: 'Mark the workflow finalized. Call only after the user confirms the summary.',
    input_schema: { type: 'object', properties: {} },
  },

  {
    name: 'show_connect',
    description:
      'Render a Pipedream Connect card so the user can authenticate the given app. Use whenever you need an account for an app that has not yet been connected.',
    input_schema: {
      type: 'object',
      properties: {
        app: { type: 'string', description: 'Pipedream app slug, e.g. "slack", "google_sheets".' },
        appName: { type: 'string', description: 'Display name. Defaults to the slug.' },
      },
      required: ['app'],
    },
  },
  {
    name: 'show_form',
    description:
      'Render a generic form to collect user input. Use this AFTER you have already discovered the required props via Pipedream MCP and (where applicable) resolved any dynamic dropdown options into static `options` arrays. The client renders the form exactly as you describe it — no further hydration happens.',
    input_schema: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          description: 'Short heading the user sees, e.g. "Choose your spreadsheet".',
        },
        fields: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              label: { type: 'string' },
              type: { type: 'string', enum: ['string', 'number', 'boolean', 'select', 'multiselect'] },
              required: { type: 'boolean' },
              description: { type: 'string' },
              options: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: { value: { type: 'string' }, label: { type: 'string' } },
                  required: ['value', 'label'],
                },
              },
            },
            required: ['name', 'label', 'type'],
          },
        },
        submitLabel: { type: 'string' },
      },
      required: ['title', 'fields'],
    },
  },
  {
    name: 'show_step_summary',
    description: 'Show a one-step confirmation card.',
    input_schema: {
      type: 'object',
      properties: { stepId: { type: 'string' } },
      required: ['stepId'],
    },
  },
  {
    name: 'show_workflow_summary',
    description: 'Show the full workflow summary with a finalize button.',
    input_schema: { type: 'object', properties: {} },
  },

  {
    name: 'list_components',
    description:
      'List available trigger or action components for a Pipedream app. Returns each component\'s key, name, and short description. Use this when you need to know the exact trigger componentKey (e.g. is it "google_sheets-new-row-added" or "google_sheets-new-row-added-instant"?) and MCP didn\'t tell you.',
    input_schema: {
      type: 'object',
      properties: {
        app: { type: 'string', description: 'Pipedream app slug.' },
        type: { type: 'string', enum: ['trigger', 'action'] },
      },
      required: ['app', 'type'],
    },
  },
  {
    name: 'get_component_schema',
    description:
      'Get the configurable_props for a specific component (trigger or action). Returns each prop\'s name, type, label, description, required flag, and whether it has remote options. Use this to discover what fields a trigger needs.',
    input_schema: {
      type: 'object',
      properties: { componentKey: { type: 'string' } },
      required: ['componentKey'],
    },
  },
];

export interface DispatchContext {
  externalUserId: string;
  connectedAccounts: Record<string, string>;
}

export interface DispatchResult {
  draft: WorkflowDefinition;
  widget?: Widget;
  toolResult: string;
}

export async function dispatchTool(
  toolUseId: string,
  name: string,
  rawInput: unknown,
  draft: WorkflowDefinition,
  _ctx: DispatchContext,
): Promise<DispatchResult> {
  const input = (rawInput ?? {}) as Record<string, unknown>;

  switch (name) {
    case 'set_trigger': {
      const r = draftHelper.setTrigger(draft, input as unknown as TriggerArgs);
      return { draft: r.draft, toolResult: `trigger set (id=${r.id})` };
    }
    case 'add_action': {
      const r = draftHelper.addAction(draft, input as unknown as ActionArgs);
      return { draft: r.draft, toolResult: `action added (id=${r.id})` };
    }
    case 'add_condition': {
      const r = draftHelper.addCondition(draft, input as unknown as ConditionArgs);
      return { draft: r.draft, toolResult: `condition added (id=${r.id})` };
    }
    case 'update_step': {
      const { stepId, patch } = input as { stepId: string; patch: Record<string, unknown> };
      const exists = draftHelper.indexOf(draft, stepId) >= 0;
      if (!exists) {
        const known = draft.steps.map((s) => s.id).join(', ');
        return {
          draft,
          toolResult: `error: step ${stepId} not found. Known step ids: [${known}]`,
        };
      }
      const next = draftHelper.updateStep(draft, stepId, patch);
      return { draft: next, toolResult: `step updated (id=${stepId})` };
    }
    case 'remove_step': {
      const { stepId } = input as { stepId: string };
      const next = draftHelper.removeStep(draft, stepId);
      return { draft: next, toolResult: `step removed (id=${stepId})` };
    }
    case 'reorder': {
      const { stepIds } = input as { stepIds: string[] };
      const next = draftHelper.reorder(draft, stepIds);
      return { draft: next, toolResult: 'reordered' };
    }
    case 'rename_workflow': {
      const { name: title } = input as { name: string };
      const next = draftHelper.renameWorkflow(draft, title);
      return { draft: next, toolResult: 'renamed' };
    }
    case 'finalize': {
      const next = draftHelper.finalize(draft);
      return { draft: next, toolResult: 'finalized' };
    }

    case 'show_connect': {
      const { app, appName } = input as { app: string; appName?: string };
      const widget = widgetHelper.connect(toolUseId, app, appName ?? app);
      return { draft, widget, toolResult: 'connect shown' };
    }
    case 'show_form': {
      const { title, fields, submitLabel } = input as {
        title: string;
        fields: FieldDef[];
        submitLabel?: string;
      };
      const widget = widgetHelper.form(toolUseId, title, fields ?? [], submitLabel);
      return { draft, widget, toolResult: 'form shown' };
    }
    case 'show_step_summary': {
      const { stepId } = input as { stepId: string };
      const widget = widgetHelper.stepSummary(toolUseId, stepId);
      return { draft, widget, toolResult: 'step summary shown' };
    }
    case 'show_workflow_summary': {
      const widget = widgetHelper.workflowSummary(toolUseId);
      return { draft, widget, toolResult: 'workflow summary shown' };
    }

    case 'list_components': {
      const { app, type } = input as { app: string; type: 'trigger' | 'action' };
      try {
        const res = (await pipedreamHelper.listComponents(app, type)) as
          | { data?: Array<{ key?: string; name?: string; description?: string }> }
          | Array<{ key?: string; name?: string; description?: string }>;
        const list = (Array.isArray(res) ? res : res?.data ?? []).slice(0, 40);
        const summary = list
          .map((c) =>
            `- ${c.key}: ${c.name}${c.description ? ` — ${c.description}` : ''}`,
          )
          .join('\n');
        return {
          draft,
          toolResult: summary || `no ${type} components found for ${app}`,
        };
      } catch (err) {
        return {
          draft,
          toolResult: `error listing components: ${(err as Error).message}`,
        };
      }
    }
    case 'get_component_schema': {
      const { componentKey } = input as { componentKey: string };
      try {
        const res = (await pipedreamHelper.getComponent(componentKey)) as {
          data?: {
            name?: string;
            configurable_props?: Array<{
              name?: string;
              type?: string;
              label?: string;
              description?: string;
              optional?: boolean;
              remoteOptions?: boolean;
              reloadProps?: boolean;
            }>;
          };
        };
        const props = res?.data?.configurable_props ?? [];
        if (props.length === 0) {
          return { draft, toolResult: `no props found for ${componentKey}` };
        }
        const header = `Component ${componentKey} (${res?.data?.name ?? ''}):`;
        const summary = props
          .map((p) => {
            const required = p.optional ? 'optional' : 'required';
            const flags = [
              p.remoteOptions ? 'remote-options' : null,
              p.reloadProps ? 'reload-props' : null,
            ]
              .filter(Boolean)
              .join(', ');
            return `- ${p.name} (${p.type}, ${required}${flags ? `, ${flags}` : ''}): ${p.label ?? ''}${p.description ? ` — ${p.description}` : ''}`;
          })
          .join('\n');
        return { draft, toolResult: `${header}\n${summary}` };
      } catch (err) {
        return {
          draft,
          toolResult: `error fetching component schema: ${(err as Error).message}`,
        };
      }
    }

    default:

      return { draft, toolResult: `no-op (unknown tool: ${name})` };
  }
}
