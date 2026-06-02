import { z } from 'zod';

export const ConnectedAccountRefSchema = z.object({
  app: z.string(),
  accountId: z.string(),
  externalUserId: z.string(),
});
export type ConnectedAccountRef = z.infer<typeof ConnectedAccountRefSchema>;

export const TriggerSchema = z.object({
  id: z.string(),
  type: z.literal('trigger'),
  app: z.string(),
  componentKey: z.string(),
  account: ConnectedAccountRefSchema,
  config: z.record(z.unknown()),
});

export const ActionSchema = z.object({
  id: z.string(),
  type: z.literal('action'),
  app: z.string(),
  componentKey: z.string(),
  account: ConnectedAccountRefSchema,
  config: z.record(z.unknown()),
});

export const ConditionSchema = z.object({
  id: z.string(),
  type: z.literal('condition'),

  expression: z.object({
    code: z.string(),
    reason: z.string().optional(),
  }),
  whenTrue: z.array(z.string()),
  whenFalse: z.array(z.string()),
});

export const StepSchema = z.discriminatedUnion('type', [
  ActionSchema,
  ConditionSchema,
]);

export const WorkflowDefinitionSchema = z.object({
  version: z.literal(1),
  id: z.string(),
  name: z.string(),
  trigger: TriggerSchema.nullable(),
  steps: z.array(StepSchema),
  finalized: z.boolean().default(false),
});

export type WorkflowDefinition = z.infer<typeof WorkflowDefinitionSchema>;
export type Trigger = z.infer<typeof TriggerSchema>;
export type Action = z.infer<typeof ActionSchema>;
export type Condition = z.infer<typeof ConditionSchema>;
export type Step = z.infer<typeof StepSchema>;
