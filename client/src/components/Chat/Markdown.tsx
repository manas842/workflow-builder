import { CSSProperties } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { theme } from '../../styles/theme';

interface Props {
  children: string;
}

const styles: Record<string, CSSProperties> = {
  root: {
    fontFamily: theme.font.sans,
    fontSize: 15.5,
    lineHeight: 1.55,
    color: theme.color.ink,
  },
  h1: {
    fontFamily: theme.font.sans,
    fontWeight: 600,
    fontSize: 17,
    letterSpacing: '-0.02em',
    margin: '4px 0 8px',
  },
  h2: {
    fontFamily: theme.font.sans,
    fontWeight: 600,
    fontSize: 15.5,
    letterSpacing: '-0.01em',
    margin: '12px 0 6px',
  },
  h3: {
    fontFamily: theme.font.sans,
    fontWeight: 600,
    fontSize: 14.5,
    margin: '10px 0 4px',
  },
  p: {
    margin: '0 0 8px',
  },
  ul: {
    margin: '0 0 8px',
    paddingLeft: 20,
  },
  ol: {
    margin: '0 0 8px',
    paddingLeft: 20,
  },
  li: {
    margin: '2px 0',
  },
  strong: {
    fontWeight: 600,
    color: theme.color.ink,
  },
  em: {
    fontStyle: 'italic',
    color: theme.color.gray600,
  },
  code: {
    fontFamily: theme.font.mono,
    fontSize: 13,
    background: theme.color.tint,
    boxShadow: theme.shadow.ring,
    padding: '1px 6px',
    borderRadius: 4,
  },
  pre: {
    fontFamily: theme.font.mono,
    fontSize: 13,
    background: theme.color.tint,
    boxShadow: theme.shadow.ring,
    borderRadius: theme.radius.sm,
    padding: 12,
    margin: '8px 0',
    overflowX: 'auto',
    lineHeight: 1.5,
  },
  blockquote: {
    margin: '8px 0',
    padding: '4px 12px',
    color: theme.color.gray600,
    boxShadow: `inset 2px 0 0 ${theme.color.gray100}`,
  },
  hr: {
    border: 'none',
    height: 1,
    background: theme.color.gray100,
    margin: '12px 0',
  },
  a: {
    color: theme.color.badgeText,
    textDecoration: 'none',
    boxShadow: `inset 0 -1px 0 ${theme.color.badgeText}`,
  },
};

export function Markdown({ children }: Props) {
  return (
    <div style={styles.root}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => <h1 style={styles.h1}>{children}</h1>,
          h2: ({ children }) => <h2 style={styles.h2}>{children}</h2>,
          h3: ({ children }) => <h3 style={styles.h3}>{children}</h3>,
          p: ({ children }) => <p style={styles.p}>{children}</p>,
          ul: ({ children }) => <ul style={styles.ul}>{children}</ul>,
          ol: ({ children }) => <ol style={styles.ol}>{children}</ol>,
          li: ({ children }) => <li style={styles.li}>{children}</li>,
          strong: ({ children }) => <strong style={styles.strong}>{children}</strong>,
          em: ({ children }) => <em style={styles.em}>{children}</em>,
          code: ({ children, className }) => {
            const isBlock = (className ?? '').startsWith('language-');
            return isBlock ? (
              <code className={className}>{children}</code>
            ) : (
              <code style={styles.code}>{children}</code>
            );
          },
          pre: ({ children }) => <pre style={styles.pre}>{children}</pre>,
          blockquote: ({ children }) => (
            <blockquote style={styles.blockquote}>{children}</blockquote>
          ),
          hr: () => <hr style={styles.hr} />,
          a: ({ children, href }) => (
            <a style={styles.a} href={href} target="_blank" rel="noreferrer">
              {children}
            </a>
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
