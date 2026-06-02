import { CSSProperties, ReactNode } from 'react';
import { theme } from '../../styles/theme';

interface Props {
  title: string;
  tag?: string;
  children: ReactNode;
  footer?: ReactNode;
}

const styles: Record<string, CSSProperties> = {
  root: {
    background: theme.color.canvas,
    boxShadow: theme.shadow.card,
    borderRadius: theme.radius.md,
    overflow: 'hidden',
    marginTop: 10,
    maxWidth: '82%',
    marginLeft: 38,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 14px',
    boxShadow: 'inset 0 -1px 0 rgba(0,0,0,0.06)',
  },
  title: {
    fontFamily: theme.font.mono,
    fontSize: 12,
    fontWeight: 500,
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    color: theme.color.gray500,
  },
  tag: {
    fontFamily: theme.font.mono,
    fontSize: 12,
    color: theme.color.gray500,
    background: theme.color.tint,
    boxShadow: theme.shadow.ring,
    padding: '2px 10px',
    borderRadius: theme.radius.pill,
  },
  body: {
    padding: 14,
  },
  footer: {
    padding: '10px 14px',
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 8,
    boxShadow: 'inset 0 1px 0 rgba(0,0,0,0.06)',
  },
};

export function WidgetCard({ title, tag, children, footer }: Props) {
  return (
    <div style={styles.root}>
      <div style={styles.header}>
        <span style={styles.title}>{title}</span>
        {tag && <span style={styles.tag}>{tag}</span>}
      </div>
      <div style={styles.body}>{children}</div>
      {footer && <div style={styles.footer}>{footer}</div>}
    </div>
  );
}

export const widgetButtonStyles: Record<string, CSSProperties> = {
  primary: {
    background: theme.color.ink,
    color: theme.color.canvas,
    border: 'none',
    borderRadius: theme.radius.sm,
    padding: '9px 16px',
    fontSize: 14,
    fontWeight: 500,
    fontFamily: theme.font.sans,
  },
  ghost: {
    background: theme.color.canvas,
    color: theme.color.ink,
    boxShadow: theme.shadow.ring,
    border: 'none',
    borderRadius: theme.radius.sm,
    padding: '9px 16px',
    fontSize: 14,
    fontWeight: 500,
    fontFamily: theme.font.sans,
  },
};
