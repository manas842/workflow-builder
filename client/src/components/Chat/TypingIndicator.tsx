import { CSSProperties, useEffect, useState } from 'react';
import { theme } from '../../styles/theme';
import { SparkleIcon } from '../icons/SparkleIcon';

const STATUSES = [
  'thinking…',
  'reading your message…',
  'asking pipedream…',
  'looking up the right component…',
  'fetching configurable props…',
  'resolving dropdown options…',
  'loading your accounts…',
  'drafting the next step…',
  'putting the form together…',
  'almost there…',
];
const CYCLE_MS = 2200;

const styles: Record<string, CSSProperties> = {
  row: {
    display: 'flex',
    gap: 10,
    alignItems: 'flex-start',
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 8,
    background: theme.color.heroTint,
    boxShadow: theme.shadow.ringBlueSoft,
    display: 'grid',
    placeItems: 'center',
    flex: '0 0 auto',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    paddingTop: 2,
  },
  bubble: {
    background: theme.color.canvas,
    boxShadow: theme.shadow.ring,
    borderRadius: '4px 16px 16px 16px',
    padding: '11px 14px',
    display: 'flex',
    gap: 5,
    alignItems: 'center',
    width: 'fit-content',
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: theme.radius.pill,
    background: theme.color.gray400,
    opacity: 0.7,
    animationName: 'wb-blink',
    animationDuration: '1.3s',
    animationIterationCount: 'infinite',
  },
  status: {
    fontFamily: theme.font.mono,
    fontSize: 11.5,
    color: theme.color.gray500,
    textTransform: 'lowercase',
    letterSpacing: '0.02em',
    paddingLeft: 2,
    animationName: 'wb-fade',
    animationDuration: '0.4s',
    animationFillMode: 'both',
  },
};

const KEYFRAMES_ID = 'wb-typing-keyframes';
function ensureKeyframes() {
  if (typeof document === 'undefined') return;
  if (document.getElementById(KEYFRAMES_ID)) return;
  const el = document.createElement('style');
  el.id = KEYFRAMES_ID;
  el.textContent = `
    @keyframes wb-blink {
      0%, 80%, 100% { opacity: 0.25; transform: translateY(0); }
      40% { opacity: 0.9; transform: translateY(-2px); }
    }
    @keyframes wb-fade {
      from { opacity: 0; transform: translateY(2px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(el);
}

export function TypingIndicator() {
  const [idx, setIdx] = useState(() => Math.floor(Math.random() * STATUSES.length));

  useEffect(() => {
    ensureKeyframes();
    const t = window.setInterval(() => {
      setIdx((i) => (i + 1) % STATUSES.length);
    }, CYCLE_MS);
    return () => window.clearInterval(t);
  }, []);

  return (
    <div style={styles.row}>
      <div style={styles.avatar}>
        <SparkleIcon size={16} color={theme.color.iconBlue} />
      </div>
      <div style={styles.content}>
        <div style={styles.bubble}>
          <span style={{ ...styles.dot, animationDelay: '0s' }} />
          <span style={{ ...styles.dot, animationDelay: '0.18s' }} />
          <span style={{ ...styles.dot, animationDelay: '0.36s' }} />
        </div>
        <span key={idx} style={styles.status}>
          {STATUSES[idx]}
        </span>
      </div>
    </div>
  );
}
