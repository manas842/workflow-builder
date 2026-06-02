import { CSSProperties } from 'react';
import { theme } from './styles/theme';
import { Header } from './components/Header/Header';
import { Chat } from './components/Chat/Chat';
import { Rail } from './components/Rail/Rail';
import { useChat } from './state/useChat';

const styles: Record<string, CSSProperties> = {
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    background: theme.color.canvas,
    color: theme.color.ink,
    fontFamily: theme.font.sans,
  },
  body: {
    flex: 1,
    display: 'flex',
    minHeight: 0,
  },
};

export function App() {
  const chat = useChat();

  return (
    <div style={styles.root}>
      <Header />
      <div style={styles.body}>
        <Chat
          messages={chat.displayMessages}
          draft={chat.draft}
          pendingWidget={chat.pendingWidgets[0] ?? null}
          externalUserId={chat.externalUserId}
          connectedAccounts={chat.connectedAccounts}
          sending={chat.sending}
          onSendText={chat.sendText}
          onSubmitWidget={chat.submitWidget}
        />
        <Rail draft={chat.draft} />
      </div>
    </div>
  );
}
