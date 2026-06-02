import { CSSProperties } from 'react';
import { theme } from '../../styles/theme';
import { SparkleIcon } from '../icons/SparkleIcon';

const styles: Record<string, CSSProperties> = {
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 22px',
    background: theme.color.canvas,
    boxShadow: `inset 0 -1px 0 rgba(0,0,0,0.06)`,
    position: 'sticky',
    top: 0,
    zIndex: 10,
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  brandChip: {
    width: 28,
    height: 28,
    borderRadius: 8,
    background: theme.color.heroTint,
    boxShadow: theme.shadow.ringBlueSoft,
    display: 'grid',
    placeItems: 'center',
  },
  brandText: {
    fontFamily: theme.font.sans,
    fontWeight: 600,
    fontSize: 15,
    letterSpacing: '-0.01em',
    color: theme.color.ink,
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    background: theme.color.badgeBg,
    color: theme.color.badgeText,
    fontFamily: theme.font.sans,
    fontWeight: 500,
    fontSize: 12,
    padding: '3px 11px',
    borderRadius: theme.radius.pill,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: theme.radius.pill,
    background: theme.color.badgeText,
  },
};

export function Header() {
  return (
    <header style={styles.root}>
      <div style={styles.brand}>
        <div style={styles.brandChip}>
          <SparkleIcon size={16} color={theme.color.iconBlue} />
        </div>
        <span style={styles.brandText}>workflow.builder</span>
      </div>
      <span style={styles.badge}>
        <span style={styles.badgeDot} />
        session active
      </span>
    </header>
  );
}
