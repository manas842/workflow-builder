import type {
  AnthropicMessage,
  ChatMessage,
  Widget,
  WidgetResponse,
  WorkflowDefinition,
} from '../types/workflow';

const BASE = '/api';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'content-type': 'application/json' },
    ...init,
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`${res.status} ${res.statusText}: ${body}`);
  }
  return res.json() as Promise<T>;
}

export interface ChatRequestBody {
  conversation: AnthropicMessage[];
  draft: WorkflowDefinition;
  userText?: string;
  widgetResponses?: WidgetResponse[];
  externalUserId: string;
  connectedAccounts: Record<string, string>;
}

export interface ChatResponseBody {
  conversation: AnthropicMessage[];
  message: ChatMessage;
  draft: WorkflowDefinition;
  widgets: Widget[];
}

export interface ConnectTokenResponse {
  token: string;
  expires_at?: string;
  connect_link_url?: string;
}

export const api = {
  health: () => request<{ status: string; uptime: number }>('/health'),

  chat: (body: ChatRequestBody) =>
    request<ChatResponseBody>('/chat', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  pipedreamConnectToken: (externalUserId: string) =>
    request<ConnectTokenResponse>('/pipedream/connect-token', {
      method: 'POST',
      body: JSON.stringify({ externalUserId }),
    }),
};
