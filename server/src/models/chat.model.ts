import { z } from 'zod';
import { WorkflowDefinitionSchema } from './workflow.model';
import { WidgetSchema, WidgetResponseSchema } from './widget.model';

export const ChatRoleSchema = z.enum(['user', 'assistant']);

export const ChatMessageSchema = z.object({
  role: ChatRoleSchema,
  content: z.string(),
  widgets: z.array(WidgetSchema).optional(),
});

export const AnthropicMessageSchema = z.object({
  role: ChatRoleSchema,
  content: z.union([z.string(), z.array(z.unknown())]),
});

export const ChatRequestSchema = z.object({
  conversation: z.array(AnthropicMessageSchema).default([]),
  draft: WorkflowDefinitionSchema,
  userText: z.string().optional(),
  widgetResponses: z.array(WidgetResponseSchema).optional(),
  externalUserId: z.string().default('demo-user'),

  connectedAccounts: z.record(z.string()).default({}),
});

export const ChatResponseSchema = z.object({
  conversation: z.array(AnthropicMessageSchema),
  message: ChatMessageSchema,
  draft: WorkflowDefinitionSchema,
  widgets: z.array(WidgetSchema),
});

export type ChatRole = z.infer<typeof ChatRoleSchema>;
export type ChatMessage = z.infer<typeof ChatMessageSchema>;
export type AnthropicMessage = z.infer<typeof AnthropicMessageSchema>;
export type ChatRequest = z.infer<typeof ChatRequestSchema>;
export type ChatResponse = z.infer<typeof ChatResponseSchema>;
