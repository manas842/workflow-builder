import type { Widget, WidgetResponse, WorkflowDefinition } from '../../types/workflow';
import { ConnectWidget } from './ConnectWidget';
import { FormWidget } from './FormWidget';
import { StepSummaryWidget } from './StepSummaryWidget';
import { WorkflowSummaryWidget } from './WorkflowSummaryWidget';

interface Props {
  widget: Widget;
  draft: WorkflowDefinition;
  externalUserId: string;
  connectedAccounts: Record<string, string>;
  onSubmit: (r: WidgetResponse) => void;
}

export function WidgetContainer({
  widget,
  draft,
  externalUserId,

  onSubmit,
}: Props) {
  const onSkip = (widgetId: string) => onSubmit({ widgetId, kind: 'skipped' });

  switch (widget.kind) {
    case 'connect':
      return (
        <ConnectWidget
          widget={widget}
          externalUserId={externalUserId}
          onSubmit={onSubmit}
          onSkip={onSkip}
        />
      );
    case 'form':
      return <FormWidget widget={widget} onSubmit={onSubmit} onSkip={onSkip} />;
    case 'step_summary':
      return <StepSummaryWidget widget={widget} onSubmit={onSubmit} />;
    case 'workflow_summary':
      return <WorkflowSummaryWidget widget={widget} draft={draft} onSubmit={onSubmit} />;
  }
}
