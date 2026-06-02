import { CSSProperties } from 'react';
import { theme } from '../../styles/theme';

type NodeKind = 'trigger' | 'condition' | 'action';

interface Props {
  kind: NodeKind;
  title: string;
  sub?: string;
}

function accentFor(kind: NodeKind): string {
  if (kind === 'trigger') return theme.color.triggerBlue;
  if (kind === 'condition') return theme.color.conditionPink;
  return theme.color.actionRed;
}

const NODE_HEIGHT = 90;

const styles: Record<string, CSSProperties> = {
  root: {
    position: 'relative',
    height: NODE_HEIGHT,
    background: theme.color.canvas,
    boxShadow: theme.shadow.card,
    borderRadius: theme.radius.md,
    padding: '10px 12px 10px 16px',
    width: '100%',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
  bar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    borderTopLeftRadius: theme.radius.md,
    borderBottomLeftRadius: theme.radius.md,
  },
  kind: {
    fontFamily: theme.font.mono,
    fontSize: 10,
    fontWeight: 500,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    lineHeight: 1,
  },
  title: {
    fontFamily: theme.font.sans,
    fontSize: 13.5,
    fontWeight: 500,
    letterSpacing: '-0.01em',
    color: theme.color.ink,
    lineHeight: 1.25,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    overflowWrap: 'anywhere',
    wordBreak: 'break-word',
  },
  conditionTitle: {
    fontFamily: theme.font.mono,
    fontSize: 11.5,
    fontWeight: 400,
    color: theme.color.ink,
    lineHeight: 1.35,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    overflowWrap: 'anywhere',
    wordBreak: 'break-all',
  },
  sub: {
    fontFamily: theme.font.mono,
    fontSize: 11,
    color: theme.color.gray500,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
};

export function CanvasNode({ kind, title, sub }: Props) {
  const accent = accentFor(kind);
  const titleStyle = kind === 'condition' ? styles.conditionTitle : styles.title;
  return (
    <div style={styles.root}>
      <span style={{ ...styles.bar, background: accent }} />
      <div style={{ ...styles.kind, color: accent }}>{kind}</div>
      <div style={titleStyle} title={title}>
        {title}
      </div>
      {sub && (
        <div style={styles.sub} title={sub}>
          {sub}
        </div>
      )}
    </div>
  );
}
