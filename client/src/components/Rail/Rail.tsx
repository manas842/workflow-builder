import { CSSProperties, useState } from 'react';
import { theme } from '../../styles/theme';
import type { WorkflowDefinition } from '../../types/workflow';
import { Canvas } from '../Canvas/Canvas';
import { JsonPanel } from '../JsonPanel/JsonPanel';

interface Props {
  draft: WorkflowDefinition;
}

type Tab = 'canvas' | 'json';

const styles: Record<string, CSSProperties> = {
  root: {
    width: 400,
    flex: '0 0 400px',
    background: theme.color.canvas,
    boxShadow: 'inset 1px 0 0 rgba(0,0,0,0.06)',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    overflow: 'hidden',
  },
  tabs: {
    margin: 14,
    padding: 3,
    display: 'flex',
    gap: 3,
    background: theme.color.tint,
    boxShadow: theme.shadow.ring,
    borderRadius: theme.radius.md,
  },
  tabBase: {
    flex: 1,
    background: 'transparent',
    color: theme.color.gray600,
    border: 'none',
    borderRadius: theme.radius.sm,
    padding: '7px 12px',
    fontFamily: theme.font.sans,
    fontWeight: 500,
    fontSize: 14,
  },
  tabActive: {
    background: theme.color.ink,
    color: theme.color.canvas,
  },
  body: {
    flex: 1,
    overflowY: 'auto',
  },
};

export function Rail({ draft }: Props) {
  const [tab, setTab] = useState<Tab>('canvas');

  return (
    <aside style={styles.root}>
      <div style={styles.tabs}>
        <button
          style={{ ...styles.tabBase, ...(tab === 'canvas' ? styles.tabActive : null) }}
          onClick={() => setTab('canvas')}
        >
          Canvas
        </button>
        <button
          style={{ ...styles.tabBase, ...(tab === 'json' ? styles.tabActive : null) }}
          onClick={() => setTab('json')}
        >
          JSON
        </button>
      </div>
      <div style={styles.body}>
        {tab === 'canvas' ? <Canvas draft={draft} /> : <JsonPanel draft={draft} />}
      </div>
    </aside>
  );
}
