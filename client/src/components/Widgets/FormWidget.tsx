import { CSSProperties, useState } from 'react';
import { theme } from '../../styles/theme';
import type { FieldDef, Widget, WidgetResponse } from '../../types/workflow';
import { WidgetCard, widgetButtonStyles } from './WidgetCard';

interface Props {
  widget: Extract<Widget, { kind: 'form' }>;
  onSubmit: (r: WidgetResponse) => void;
  onSkip: (widgetId: string) => void;
}

const styles: Record<string, CSSProperties> = {
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    marginBottom: 14,
  },
  label: {
    fontFamily: theme.font.sans,
    fontSize: 14,
    fontWeight: 500,
    color: theme.color.gray600,
  },
  hint: {
    fontFamily: theme.font.sans,
    fontSize: 12.5,
    color: theme.color.gray500,
  },
  control: {
    background: theme.color.canvas,
    boxShadow: theme.shadow.ring,
    border: 'none',
    outline: 'none',
    borderRadius: theme.radius.sm,
    padding: '11px 14px',
    fontSize: 14,
    fontFamily: theme.font.sans,
    color: theme.color.ink,
  },
  checkbox: {
    width: 16,
    height: 16,
    margin: 0,
  },
};

function initialValues(fields: FieldDef[]): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const f of fields) {
    if (f.type === 'boolean') out[f.name] = false;
    else if (f.type === 'multiselect') out[f.name] = [];
    else out[f.name] = '';
  }
  return out;
}

export function FormWidget({ widget, onSubmit, onSkip }: Props) {
  const [values, setValues] = useState<Record<string, unknown>>(() =>
    initialValues(widget.fields),
  );

  const setField = (name: string, v: unknown) =>
    setValues((prev) => ({ ...prev, [name]: v }));

  const valid = widget.fields.every((f) => {
    if (!f.required) return true;
    const v = values[f.name];
    if (f.type === 'boolean') return true;
    if (Array.isArray(v)) return v.length > 0;
    return typeof v === 'string' ? v.trim().length > 0 : v != null;
  });

  return (
    <WidgetCard
      title={widget.title}
      footer={
        <>
          <button style={widgetButtonStyles.ghost} onClick={() => onSkip(widget.id)}>
            Skip
          </button>
          <button
            style={widgetButtonStyles.primary}
            disabled={!valid}
            onClick={() =>
              onSubmit({ widgetId: widget.id, kind: 'form', values })
            }
          >
            {widget.submitLabel || 'Continue'}
          </button>
        </>
      }
    >
      {widget.fields.map((f) => (
        <div key={f.name} style={styles.field}>
          <label style={styles.label}>
            {f.label}
            {f.required && ' *'}
          </label>
          {f.description && <div style={styles.hint}>{f.description}</div>}

          {f.type === 'boolean' ? (
            <input
              type="checkbox"
              style={styles.checkbox}
              checked={Boolean(values[f.name])}
              onChange={(e) => setField(f.name, e.target.checked)}
            />
          ) : f.type === 'select' ? (
            <select
              style={styles.control}
              value={String(values[f.name] ?? '')}
              onChange={(e) => setField(f.name, e.target.value)}
            >
              <option value="">Choose…</option>
              {(f.options ?? []).map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          ) : f.type === 'multiselect' ? (
            <select
              multiple
              style={{ ...styles.control, minHeight: 100 }}
              value={(values[f.name] as string[]) ?? []}
              onChange={(e) => {
                const picked = Array.from(e.target.selectedOptions).map((o) => o.value);
                setField(f.name, picked);
              }}
            >
              {(f.options ?? []).map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={f.type === 'number' ? 'number' : 'text'}
              style={styles.control}
              value={String(values[f.name] ?? '')}
              onChange={(e) =>
                setField(
                  f.name,
                  f.type === 'number' ? Number(e.target.value) : e.target.value,
                )
              }
            />
          )}
        </div>
      ))}
    </WidgetCard>
  );
}
