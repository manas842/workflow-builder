import { CSSProperties, useEffect, useRef, useState } from 'react';
import { theme } from '../../styles/theme';
import type {
  ChatMessage,
  Widget,
  WidgetResponse,
  WorkflowDefinition,
} from '../../types/workflow';
import { ChatBubble } from './ChatBubble';
import { Composer } from './Composer';
import { EmptyState } from './EmptyState';
import { Markdown } from './Markdown';
import { TypingIndicator } from './TypingIndicator';
import { WidgetContainer } from '../Widgets/WidgetContainer';

interface Props {
  messages: ChatMessage[];
  draft: WorkflowDefinition;
  pendingWidget: Widget | null;
  externalUserId: string;
  connectedAccounts: Record<string, string>;
  sending: boolean;
  onSendText: (text: string) => void;
  onSubmitWidget: (r: WidgetResponse) => void;
}

const styles: Record<string, CSSProperties> = {
  root: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
    position: 'relative',
  },
  scroll: {
    flex: 1,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
  },
  thread: {
    width: '100%',
    maxWidth: 740,
    margin: '0 auto',
    padding: '22px 22px 120px',
    display: 'flex',
    flexDirection: 'column',
    gap: 22,
  },
};

export function Chat({
  messages,
  draft,
  pendingWidget,
  externalUserId,
  connectedAccounts,
  sending,
  onSendText,
  onSubmitWidget,
}: Props) {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, pendingWidget, sending]);

  const send = () => {
    if (!input.trim() || sending) return;
    onSendText(input);
    setInput('');
  };

  const isEmpty = messages.length === 0 && !sending && !pendingWidget;
  const composerDisabled = sending || Boolean(pendingWidget);

  return (
    <div style={styles.root}>
      <div ref={scrollRef} style={styles.scroll}>
        {isEmpty ? (
          <EmptyState onSuggestion={setInput} />
        ) : (
          <div style={styles.thread}>
            {messages.map((m, i) => (
              <ChatBubble key={i} role={m.role}>
                {m.role === 'assistant' ? <Markdown>{m.content}</Markdown> : m.content}
              </ChatBubble>
            ))}
            {pendingWidget && (
              <WidgetContainer
                key={pendingWidget.id}
                widget={pendingWidget}
                draft={draft}
                externalUserId={externalUserId}
                connectedAccounts={connectedAccounts}
                onSubmit={onSubmitWidget}
              />
            )}
            {sending && <TypingIndicator />}
          </div>
        )}
      </div>
      <Composer
        value={input}
        onChange={setInput}
        onSend={send}
        disabled={composerDisabled}
      />
    </div>
  );
}
