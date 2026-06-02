import { CSSProperties } from 'react';
import { theme } from '../../styles/theme';
import type { Widget, WidgetResponse } from '../../types/workflow';
import { WidgetCard, widgetButtonStyles } from './WidgetCard';

interface Props {
  widget: Extract<Widget, { kind: 'step_summary' }>;
  onSubmit: (r: WidgetResponse) => void;
}

const styles: Record<string, CSSProperties> = {
  text: {
    fontFamily: theme.font.sans,
    fontSize: 14,
    color: theme.color.gray600,
  },
  ref: {
    fontFamily: theme.font.mono,
    fontSize: 12,
    color: theme.color.gray500,
  },
};

export function StepSummaryWidget({ widget, onSubmit }: Props) {
  const send = (action: 'confirm' | 'edit' | 'cancel') =>
    onSubmit({ widgetId: widget.id, kind: 'step_summary', action });

  return (
    <WidgetCard
      title="confirm step"
      tag={widget.stepId}
      footer={
        <>
          <button style={widgetButtonStyles.ghost} onClick={() => send('cancel')}>
            Cancel
          </button>
          <button style={widgetButtonStyles.ghost} onClick={() => send('edit')}>
            Edit
          </button>
          <button style={widgetButtonStyles.primary} onClick={() => send('confirm')}>
            Confirm
          </button>
        </>
      }
    >
      <div style={styles.text}>Review this step before adding it to the workflow.</div>
    </WidgetCard>
  );
}
