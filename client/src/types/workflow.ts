

export type ChatRole = 'user' | 'assistant';

export interface ConnectedAccountRef {
  app: string;
  accountId: string;
  externalUserId: string;
}

export interface Trigger {
  id: string;
  type: 'trigger';
  app: string;
  componentKey: string;
  account: ConnectedAccountRef;
  config: Record<string, unknown>;
}

export interface Action {
  id: string;
  type: 'action';
  app: string;
  componentKey: string;
  account: ConnectedAccountRef;
  config: Record<string, unknown>;
}

export interface Condition {
  id: string;
  type: 'condition';
  expression: { code: string; reason?: string };
  whenTrue: string[];
  whenFalse: string[];
}

export type Step = Action | Condition;

export interface WorkflowDefinition {
  version: 1;
  id: string;
  name: string;
  trigger: Trigger | null;
  steps: Step[];
  finalized: boolean;
}

export interface FieldDef {
  name: string;
  label: string;
  type: 'string' | 'number' | 'boolean' | 'select' | 'multiselect';
  required?: boolean;
  options?: { value: string; label: string }[];
  description?: string;
  secret?: boolean;
}

export type Widget =
  | { id: string; kind: 'connect'; app: string; appName: string }
  | {
      id: string;
      kind: 'form';
      title: string;
      fields: FieldDef[];
      submitLabel?: string;
    }
  | { id: string; kind: 'step_summary'; stepId: string }
  | { id: string; kind: 'workflow_summary' };

export type WidgetResponse =
  | {
      widgetId: string;
      kind: 'connect';
      app: string;
      accountId: string;
      externalUserId: string;
    }
  | { widgetId: string; kind: 'form'; values: Record<string, unknown> }
  | {
      widgetId: string;
      kind: 'step_summary';
      action: 'confirm' | 'edit' | 'cancel';
    }
  | {
      widgetId: string;
      kind: 'workflow_summary';
      action: 'finalize' | 'continue';
    }
  | { widgetId: string; kind: 'skipped' };

export interface AnthropicMessage {
  role: ChatRole;
  content: string | unknown[];
}

export interface ChatMessage {
  role: ChatRole;
  content: string;
  widgets?: Widget[];
}
