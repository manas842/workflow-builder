import { Widget, FieldDef } from '../models/widget.model';

export const widgetHelper = {
  connect(id: string, app: string, appName: string): Widget {
    return { id, kind: 'connect', app, appName: appName || app };
  },

  form(id: string, title: string, fields: FieldDef[], submitLabel?: string): Widget {
    return { id, kind: 'form', title, fields, submitLabel };
  },

  stepSummary(id: string, stepId: string): Widget {
    return { id, kind: 'step_summary', stepId };
  },

  workflowSummary(id: string): Widget {
    return { id, kind: 'workflow_summary' };
  },
};
