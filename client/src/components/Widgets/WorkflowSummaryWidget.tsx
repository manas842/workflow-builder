import { CSSProperties } from 'react';
import { theme } from '../../styles/theme';
import type { Widget, WidgetResponse, WorkflowDefinition } from '../../types/workflow';
import { WidgetCard, widgetButtonStyles } from './WidgetCard';

interface Props {
  widget: Extract<Widget, { kind: 'workflow_summary' }>;
  draft: WorkflowDefinition;
  onSubmit: (r: WidgetResponse) => void;
}

const styles: Record<string, CSSProperties> = {
  row: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    marginBottom: 8,
  },
  label: {
    fontFamily: theme.font.mono,
    fontSize: 11,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: theme.color.gray500,
  },
  value: {
    fontFamily: theme.font.sans,
    fontSize: 14,
    color: theme.color.ink,
  },
  empty: {
    fontFamily: theme.font.sans,
    fontSize: 13,
    color: theme.color.gray500,
  },
};

export function WorkflowSummaryWidget({ widget, draft, onSubmit }: Props) {
  return (
    <WidgetCard
      title="workflow summary"
      tag={draft.name}
      footer={
        <>
          <button
            style={widgetButtonStyles.ghost}
            onClick={() =>
              onSubmit({ widgetId: widget.id, kind: 'workflow_summary', action: 'continue' })
            }
          >
            Continue editing
          </button>
          <button
            style={widgetButtonStyles.primary}
            onClick={() =>
              onSubmit({ widgetId: widget.id, kind: 'workflow_summary', action: 'finalize' })
            }
          >
            Finalize
          </button>
        </>
      }
    >
      <div style={styles.row}>
        <span style={styles.label}>Trigger</span>
        <span style={styles.value}>
          {draft.trigger
            ? `${draft.trigger.app} · ${draft.trigger.componentKey}`
            : 'Not set'}
        </span>
      </div>
      {draft.steps.length === 0 ? (
        <div style={styles.empty}>No steps yet.</div>
      ) : (
        draft.steps.map((s) => (
          <div key={s.id} style={styles.row}>
            <span style={styles.label}>{s.type}</span>
            <span style={styles.value}>
              {s.type === 'action'
                ? `${s.app} · ${s.componentKey}`
                : `if (${s.expression.code})`}
            </span>
          </div>
        ))
      )}
    </WidgetCard>
  );
}
