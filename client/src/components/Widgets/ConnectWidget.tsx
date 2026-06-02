import { CSSProperties, useState } from 'react';
import { createFrontendClient } from '@pipedream/sdk/browser';
import { theme } from '../../styles/theme';
import { api } from '../../api/client';
import type { Widget, WidgetResponse } from '../../types/workflow';
import { WidgetCard, widgetButtonStyles } from './WidgetCard';

interface Props {
  widget: Extract<Widget, { kind: 'connect' }>;
  externalUserId: string;
  onSubmit: (r: WidgetResponse) => void;
  onSkip: (widgetId: string) => void;
}

const styles: Record<string, CSSProperties> = {
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  appChip: {
    width: 34,
    height: 34,
    borderRadius: theme.radius.sm,
    background: theme.color.tint,
    display: 'grid',
    placeItems: 'center',
    fontFamily: theme.font.mono,
    fontSize: 14,
    color: theme.color.gray500,
    boxShadow: theme.shadow.ring,
  },
  name: {
    flex: 1,
    fontFamily: theme.font.sans,
    fontSize: 15,
    fontWeight: 500,
    color: theme.color.ink,
  },
  status: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    fontFamily: theme.font.mono,
    fontSize: 12,
    color: theme.color.successText,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: theme.radius.pill,
    background: theme.color.successDot,
    boxShadow: `0 0 0 4px ${theme.color.successGlow}`,
  },
  accountRef: {
    fontFamily: theme.font.mono,
    fontSize: 12,
    color: theme.color.gray500,
    background: theme.color.tint,
    boxShadow: theme.shadow.ring,
    padding: '2px 8px',
    borderRadius: 4,
    marginLeft: 8,
  },
  error: {
    fontFamily: theme.font.sans,
    fontSize: 13,
    color: theme.color.actionRed,
    marginTop: 8,
  },
};

type Phase = 'idle' | 'connecting' | 'connected' | 'error';

export function ConnectWidget({ widget, externalUserId, onSubmit, onSkip }: Props) {
  const [phase, setPhase] = useState<Phase>('idle');
  const [error, setError] = useState<string | null>(null);
  const [accountId, setAccountId] = useState<string | null>(null);

  const connect = async () => {
    setPhase('connecting');
    setError(null);
    try {
      const pd = createFrontendClient({
        externalUserId,

        tokenCallback: (({ externalUserId: uid }: { externalUserId: string }) =>
          api.pipedreamConnectToken(uid)) as Parameters<typeof createFrontendClient>[0]['tokenCallback'],
      });
      await pd.connectAccount({
        app: widget.app,
        onSuccess: (res) => {
          setAccountId(res.id);
          setPhase('connected');
          onSubmit({
            widgetId: widget.id,
            kind: 'connect',
            app: widget.app,
            accountId: res.id,
            externalUserId,
          });
        },
        onError: (err) => {
          setPhase('error');
          setError(err.message || 'Connect failed');
        },
      });
    } catch (err) {
      setPhase('error');
      setError(err instanceof Error ? err.message : 'Connect failed');
    }
  };

  const connectButton =
    phase === 'connected' ? (
      <span style={styles.status}>
        <span style={styles.dot} />
        connected
        {accountId && <span style={styles.accountRef}>{accountId}</span>}
      </span>
    ) : (
      <button
        style={widgetButtonStyles.primary}
        onClick={connect}
        disabled={phase === 'connecting'}
      >
        {phase === 'connecting' ? 'Connecting…' : `Connect ${widget.appName}`}
      </button>
    );

  return (
    <WidgetCard
      title="connect app"
      tag={widget.app}
      footer={
        phase === 'connected' ? null : (
          <button
            style={widgetButtonStyles.ghost}
            onClick={() => onSkip(widget.id)}
          >
            Skip
          </button>
        )
      }
    >
      <div style={styles.row}>
        <span style={styles.appChip}>{widget.appName[0]?.toUpperCase() || '?'}</span>
        <span style={styles.name}>{widget.appName}</span>
        {connectButton}
      </div>
      {error && <div style={styles.error}>{error}</div>}
    </WidgetCard>
  );
}
