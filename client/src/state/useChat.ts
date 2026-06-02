import { useCallback, useState } from 'react';
import { api } from '../api/client';
import type {
  AnthropicMessage,
  ChatMessage,
  Widget,
  WidgetResponse,
  WorkflowDefinition,
} from '../types/workflow';

const EXTERNAL_USER_ID = 'demo-user';

function newDraft(): WorkflowDefinition {
  return {
    version: 1,
    id: `wf_${Math.random().toString(36).slice(2, 10)}`,
    name: 'Untitled workflow',
    trigger: null,
    steps: [],
    finalized: false,
  };
}

export function useChat() {
  const [displayMessages, setDisplayMessages] = useState<ChatMessage[]>([]);
  const [conversation, setConversation] = useState<AnthropicMessage[]>([]);
  const [draft, setDraft] = useState<WorkflowDefinition>(newDraft);
  const [pendingWidgets, setPendingWidgets] = useState<Widget[]>([]);
  const [bufferedResponses, setBufferedResponses] = useState<WidgetResponse[]>([]);
  const [sending, setSending] = useState(false);

  const [connectedAccounts, setConnectedAccounts] = useState<Record<string, string>>({});

  const applyServerTurn = useCallback(
    (res: Awaited<ReturnType<typeof api.chat>>) => {
      setConversation(res.conversation);
      setDraft(res.draft);
      setPendingWidgets(res.widgets);
      setBufferedResponses([]);
      setDisplayMessages((prev) => [
        ...prev,
        { role: 'assistant', content: res.message.content, widgets: res.widgets },
      ]);
    },
    [],
  );

  const post = useCallback(
    async (body: Parameters<typeof api.chat>[0]) => {
      setSending(true);
      try {
        const res = await api.chat(body);
        applyServerTurn(res);
      } catch (err) {
        setDisplayMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content:
              err instanceof Error
                ? `Error: ${err.message}`
                : 'Something went wrong.',
          },
        ]);
      } finally {
        setSending(false);
      }
    },
    [applyServerTurn],
  );

  const sendText = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      setDisplayMessages((prev) => [...prev, { role: 'user', content: trimmed }]);
      await post({
        conversation,
        draft,
        userText: trimmed,
        externalUserId: EXTERNAL_USER_ID,
        connectedAccounts,
      });
    },
    [conversation, draft, post],
  );

  const submitWidget = useCallback(
    async (response: WidgetResponse) => {
      if (response.kind === 'connect') {

        setConnectedAccounts((prev) => ({ ...prev, [response.app]: response.accountId }));
      }
      const remaining = pendingWidgets.slice(1);
      const nextBuffer = [...bufferedResponses, response];
      setPendingWidgets(remaining);
      setBufferedResponses(nextBuffer);

      if (remaining.length > 0) return;

      const latestAccounts =
        response.kind === 'connect'
          ? { ...connectedAccounts, [response.app]: response.accountId }
          : connectedAccounts;
      await post({
        conversation,
        draft,
        widgetResponses: nextBuffer,
        externalUserId: EXTERNAL_USER_ID,
        connectedAccounts: latestAccounts,
      });
    },
    [pendingWidgets, bufferedResponses, conversation, draft, post],
  );

  return {
    displayMessages,
    draft,
    setDraft,
    pendingWidgets,
    sending,
    sendText,
    submitWidget,
    connectedAccounts,
    externalUserId: EXTERNAL_USER_ID,
  };
}
