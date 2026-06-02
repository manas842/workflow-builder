import { randomUUID } from 'crypto';
import {
  Action,
  Condition,
  ConnectedAccountRef,
  Step,
  Trigger,
  WorkflowDefinition,
} from '../models/workflow.model';

function newId(kind: 'trigger' | 'action' | 'condition'): string {
  return `${kind}-${randomUUID()}`;
}

export interface TriggerArgs {
  app: string;
  componentKey: string;
  account: ConnectedAccountRef;
  config: Record<string, unknown>;
}

export interface ActionArgs {
  position?: number;
  app: string;
  componentKey: string;
  account: ConnectedAccountRef;
  config: Record<string, unknown>;
}

export interface ConditionArgs {
  position?: number;
  expression: { code: string; reason?: string };
  whenTrue?: string[];
  whenFalse?: string[];
}

export const draftHelper = {
  setTrigger(
    draft: WorkflowDefinition,
    args: TriggerArgs,
  ): { draft: WorkflowDefinition; id: string } {
    const id = draft.trigger?.id ?? newId('trigger');
    const trigger: Trigger = {
      id,
      type: 'trigger',
      app: args.app,
      componentKey: args.componentKey,
      account: args.account,
      config: args.config,
    };
    return { draft: { ...draft, trigger }, id };
  },

  addAction(
    draft: WorkflowDefinition,
    args: ActionArgs,
  ): { draft: WorkflowDefinition; id: string } {
    const id = newId('action');
    const action: Action = {
      id,
      type: 'action',
      app: args.app,
      componentKey: args.componentKey,
      account: args.account,
      config: args.config,
    };
    const steps = insertAt(draft.steps, action, args.position);
    return { draft: { ...draft, steps }, id };
  },

  addCondition(
    draft: WorkflowDefinition,
    args: ConditionArgs,
  ): { draft: WorkflowDefinition; id: string } {
    const id = newId('condition');
    const condition: Condition = {
      id,
      type: 'condition',
      expression: args.expression,
      whenTrue: args.whenTrue ?? [],
      whenFalse: args.whenFalse ?? [],
    };
    const referenced = [
      ...(args.whenTrue ?? []),
      ...(args.whenFalse ?? []),
    ];
    const referencedIndices = referenced
      .map((sid) => draft.steps.findIndex((s) => s.id === sid))
      .filter((i) => i >= 0);
    const autoPosition =
      referencedIndices.length > 0 ? Math.min(...referencedIndices) : undefined;
    const position = autoPosition ?? args.position;
    const steps = insertAt(draft.steps, condition, position);
    return { draft: { ...draft, steps }, id };
  },

  indexOf(draft: WorkflowDefinition, stepId: string): number {
    return draft.steps.findIndex((s) => s.id === stepId);
  },

  updateStep(
    draft: WorkflowDefinition,
    stepId: string,
    patch: Record<string, unknown>,
  ): WorkflowDefinition {
    const steps = draft.steps.map((s) =>
      s.id === stepId ? ({ ...s, ...patch } as Step) : s,
    );
    return { ...draft, steps };
  },

  removeStep(draft: WorkflowDefinition, stepId: string): WorkflowDefinition {
    return { ...draft, steps: draft.steps.filter((s) => s.id !== stepId) };
  },

  reorder(draft: WorkflowDefinition, stepIds: string[]): WorkflowDefinition {
    const map = new Map(draft.steps.map((s) => [s.id, s]));
    const ordered = stepIds
      .map((id) => map.get(id))
      .filter((s): s is Step => Boolean(s));
    return { ...draft, steps: ordered };
  },

  renameWorkflow(draft: WorkflowDefinition, name: string): WorkflowDefinition {
    return { ...draft, name };
  },

  finalize(draft: WorkflowDefinition): WorkflowDefinition {
    return { ...draft, finalized: true };
  },
};

function insertAt<T>(arr: T[], item: T, position?: number): T[] {
  if (position === undefined || position < 0 || position >= arr.length) {
    return [...arr, item];
  }
  const next = arr.slice();
  next.splice(position, 0, item);
  return next;
}
