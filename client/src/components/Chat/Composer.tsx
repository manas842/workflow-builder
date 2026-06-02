import { CSSProperties, KeyboardEvent, useState } from 'react';
import { theme } from '../../styles/theme';

interface Props {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  disabled?: boolean;
}

const styles: Record<string, CSSProperties> = {
  root: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    paddingTop: 24,
    paddingBottom: 18,
    background: 'linear-gradient(to top, #ffffff 58%, rgba(255,255,255,0))',
    display: 'flex',
    justifyContent: 'center',
  },
  inner: {
    width: '100%',
    maxWidth: 740,
    display: 'flex',
    gap: 10,
    padding: '0 22px',
  },
  inputWrap: {
    flex: 1,
    display: 'flex',
  },
  input: {
    flex: 1,
    background: theme.color.canvas,
    color: theme.color.ink,
    boxShadow: theme.shadow.ring,
    border: 'none',
    outline: 'none',
    borderRadius: theme.radius.sm,
    padding: '13px 16px',
    fontSize: 15,
    fontFamily: theme.font.sans,
  },
  inputFocused: {
    boxShadow: theme.shadow.inputFocus,
  },
  send: {
    background: theme.color.ink,
    color: theme.color.canvas,
    border: 'none',
    borderRadius: theme.radius.sm,
    padding: '9px 16px',
    fontSize: 14,
    fontWeight: 500,
    fontFamily: theme.font.sans,
  },
  sendDisabled: {
    opacity: 0.4,
    cursor: 'not-allowed',
  },
};

export function Composer({ value, onChange, onSend, disabled }: Props) {
  const [focused, setFocused] = useState(false);

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!disabled && value.trim().length > 0) onSend();
    }
  };

  return (
    <div style={styles.root}>
      <div style={styles.inner}>
        <div style={styles.inputWrap}>
          <input
            style={{ ...styles.input, ...(focused ? styles.inputFocused : null) }}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onKeyDown={handleKey}
            placeholder="Describe a step or reply…"
          />
        </div>
        <button
          style={{
            ...styles.send,
            ...(disabled || value.trim().length === 0 ? styles.sendDisabled : null),
          }}
          onClick={onSend}
          disabled={disabled || value.trim().length === 0}
        >
          Send
        </button>
      </div>
    </div>
  );
}
