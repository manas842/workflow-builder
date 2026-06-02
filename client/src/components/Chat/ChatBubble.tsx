import { CSSProperties } from 'react';
import { theme } from '../../styles/theme';
import { SparkleIcon } from '../icons/SparkleIcon';
import type { ChatRole } from '../../types/workflow';

interface Props {
  role: ChatRole;
  children: React.ReactNode;
}

const styles: Record<string, CSSProperties> = {
  row: {
    display: 'flex',
    gap: 10,
    width: '100%',
  },
  rowUser: {
    justifyContent: 'flex-end',
  },
  rowAssistant: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  avatar: {
    flex: '0 0 auto',
    width: 28,
    height: 28,
    borderRadius: 8,
    background: theme.color.heroTint,
    boxShadow: theme.shadow.ringBlueSoft,
    display: 'grid',
    placeItems: 'center',
  },
  bubbleBase: {
    maxWidth: '82%',
    padding: '11px 14px',
    fontFamily: theme.font.sans,
    fontSize: 15.5,
    lineHeight: 1.55,
    color: theme.color.ink,
    wordBreak: 'break-word',
  },
  bubbleUser: {
    background: theme.color.badgeBg,
    boxShadow: theme.shadow.ringBlue,
    borderRadius: '16px 16px 4px 16px',
    whiteSpace: 'pre-wrap',
  },
  bubbleAssistant: {
    background: theme.color.canvas,
    boxShadow: theme.shadow.ring,
    borderRadius: '4px 16px 16px 16px',
  },
};

export function ChatBubble({ role, children }: Props) {
  const isUser = role === 'user';
  return (
    <div
      style={{
        ...styles.row,
        ...(isUser ? styles.rowUser : styles.rowAssistant),
      }}
    >
      {!isUser && (
        <div style={styles.avatar}>
          <SparkleIcon size={16} color={theme.color.iconBlue} />
        </div>
      )}
      <div
        style={{
          ...styles.bubbleBase,
          ...(isUser ? styles.bubbleUser : styles.bubbleAssistant),
        }}
      >
        {children}
      </div>
    </div>
  );
}
