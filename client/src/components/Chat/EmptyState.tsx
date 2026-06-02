import { CSSProperties } from 'react';
import { theme } from '../../styles/theme';
import { SparkleIcon } from '../icons/SparkleIcon';

interface Props {
  onSuggestion: (text: string) => void;
}

const styles: Record<string, CSSProperties> = {
  root: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
    padding: 22,
    textAlign: 'center',
  },
  hero: {
    width: 54,
    height: 54,
    borderRadius: 14,
    background: theme.color.heroTint,
    boxShadow: theme.shadow.ringBlueSoft,
    display: 'grid',
    placeItems: 'center',
  },
  title: {
    fontFamily: theme.font.sans,
    fontWeight: 600,
    fontSize: 23,
    letterSpacing: '-0.03em',
    color: theme.color.ink,
    margin: 0,
  },
  sub: {
    fontFamily: theme.font.sans,
    fontSize: 14,
    color: theme.color.gray500,
    margin: 0,
  },
  chip: {
    marginTop: 6,
    background: theme.color.canvas,
    color: theme.color.gray600,
    fontFamily: theme.font.sans,
    fontSize: 13.5,
    padding: '9px 16px',
    borderRadius: theme.radius.pill,
    boxShadow: theme.shadow.ring,
    border: 'none',
  },
};

export function EmptyState({ onSuggestion }: Props) {
  const example = 'Post to Slack when a row is added to Google Sheets';
  return (
    <div style={styles.root}>
      <div style={styles.hero}>
        <SparkleIcon size={28} color={theme.color.iconBlue} />
      </div>
      <h1 style={styles.title}>What should we automate?</h1>
      <p style={styles.sub}>Describe the workflow and I’ll walk you through it.</p>
      <button style={styles.chip} onClick={() => onSuggestion(example)}>
        {example}
      </button>
    </div>
  );
}
