import { CSSProperties, useMemo, useState } from 'react';
import { theme } from '../../styles/theme';
import type { WorkflowDefinition } from '../../types/workflow';

interface Props {
  draft: WorkflowDefinition;
}

const styles: Record<string, CSSProperties> = {
  root: {
    position: 'relative',
    padding: 14,
  },
  block: {
    background: theme.color.tint,
    boxShadow: theme.shadow.ring,
    borderRadius: theme.radius.md,
    padding: 14,
    overflowX: 'auto',
    fontFamily: theme.font.mono,
    fontSize: 13,
    lineHeight: 1.6,
    color: theme.color.ink,
    margin: 0,
  },
  copy: {
    position: 'absolute',
    top: 18,
    right: 22,
    background: theme.color.canvas,
    color: theme.color.ink,
    boxShadow: theme.shadow.ring,
    border: 'none',
    borderRadius: theme.radius.sm,
    padding: '5px 10px',
    fontSize: 12,
    fontFamily: theme.font.sans,
    fontWeight: 500,
  },
  status: {
    marginTop: 10,
    fontFamily: theme.font.mono,
    fontSize: 12,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    color: theme.color.gray500,
  },
};

export function JsonPanel({ draft }: Props) {
  const [copied, setCopied] = useState(false);
  const json = useMemo(() => JSON.stringify(draft, null, 2), [draft]);
  const stepCount =
    (draft.trigger ? 1 : 0) + draft.steps.length;

  const copy = async () => {
    await navigator.clipboard.writeText(json);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div style={styles.root}>
      <button style={styles.copy} onClick={copy}>
        {copied ? 'Copied' : 'Copy'}
      </button>
      <pre style={styles.block}>{json}</pre>
      <div
        style={{
          ...styles.status,
          color: draft.finalized ? theme.color.successText : theme.color.gray500,
        }}
      >
        {draft.finalized
          ? '✓ finalized · runner-ready'
          : `draft · ${stepCount} node${stepCount === 1 ? '' : 's'}`}
      </div>
    </div>
  );
}
