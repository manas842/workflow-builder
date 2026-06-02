import { z } from 'zod';

export const FieldDefSchema = z.object({
  name: z.string(),
  label: z.string(),
  type: z.enum(['string', 'number', 'boolean', 'select', 'multiselect']),
  required: z.boolean().default(false),
  options: z
    .array(z.object({ value: z.string(), label: z.string() }))
    .optional(),
  description: z.string().optional(),
  secret: z.boolean().optional(),
});

export const TokenFieldSchema = z.object({
  label: z.string(),
  path: z.string(),
});

export const OperatorSchema = z.enum([
  'equals',
  'not_equals',
  'contains',
  'gt',
  'lt',
]);

export const WidgetSchema = z.discriminatedUnion('kind', [
  z.object({
    id: z.string(),
    kind: z.literal('connect'),
    app: z.string(),
    appName: z.string(),
  }),

  z.object({
    id: z.string(),
    kind: z.literal('form'),
    title: z.string(),
    fields: z.array(FieldDefSchema),
    submitLabel: z.string().optional(),
  }),
  z.object({
    id: z.string(),
    kind: z.literal('step_summary'),
    stepId: z.string(),
  }),
  z.object({
    id: z.string(),
    kind: z.literal('workflow_summary'),
  }),
]);

export const WidgetResponseSchema = z.discriminatedUnion('kind', [
  z.object({
    widgetId: z.string(),
    kind: z.literal('connect'),
    app: z.string(),
    accountId: z.string(),
    externalUserId: z.string(),
  }),
  z.object({
    widgetId: z.string(),
    kind: z.literal('form'),
    values: z.record(z.unknown()),
  }),
  z.object({
    widgetId: z.string(),
    kind: z.literal('step_summary'),
    action: z.enum(['confirm', 'edit', 'cancel']),
  }),
  z.object({
    widgetId: z.string(),
    kind: z.literal('workflow_summary'),
    action: z.enum(['finalize', 'continue']),
  }),
  z.object({
    widgetId: z.string(),
    kind: z.literal('skipped'),
  }),
]);

export type FieldDef = z.infer<typeof FieldDefSchema>;
export type TokenField = z.infer<typeof TokenFieldSchema>;
export type Operator = z.infer<typeof OperatorSchema>;
export type Widget = z.infer<typeof WidgetSchema>;
export type WidgetResponse = z.infer<typeof WidgetResponseSchema>;
