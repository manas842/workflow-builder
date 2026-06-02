

export const theme = {
  color: {
    ink: '#171717',
    canvas: '#ffffff',
    tint: '#fafafa',

    gray900: '#171717',
    gray600: '#4d4d4d',
    gray500: '#666666',
    gray400: '#808080',
    gray100: '#ebebeb',
    gray50: '#fafafa',
    avatarChip: '#f4f4f5',

    badgeBg: '#ebf5ff',
    badgeText: '#0068d6',
    iconBlue: '#5b9df7',
    heroTint: '#eef5ff',
    focus: 'hsla(212,100%,48%,1)',
    focusRing: 'rgba(10,114,239,0.14)',

    triggerBlue: '#0a72ef',
    conditionPink: '#de1d8d',
    actionRed: '#ff5b4f',

    consoleString: '#0070f3',
    consoleNumber: '#7928ca',
    consolePunct: '#808080',

    successDot: '#10b981',
    successText: '#0a8a4d',
    successGlow: 'rgba(16,185,129,0.18)',
  },

  shadow: {
    ring: '0 0 0 1px rgba(0,0,0,0.08)',
    ringStrong: '0 0 0 1px rgba(0,0,0,0.16)',
    ringBlueSoft: '0 0 0 1px rgba(10,114,239,0.16)',
    ringBlue: '0 0 0 1px rgba(10,114,239,0.20)',
    card: '0 0 0 1px rgba(0,0,0,.08), 0 2px 2px rgba(0,0,0,.04), 0 8px 8px -8px rgba(0,0,0,.04), 0 0 0 1px #fafafa',
    inputFocus: '0 0 0 1px #0a72ef, 0 0 0 4px rgba(10,114,239,.14)',
  },

  font: {
    sans: "'Geist', Arial, 'Apple Color Emoji', sans-serif",
    mono: "'Geist Mono', ui-monospace, SFMono-Regular, 'Roboto Mono', Menlo, Monaco, 'Courier New', monospace",
  },

  radius: {
    sm: 6,
    md: 8,
    bubble: 16,
    pill: 9999,
  },

  space: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 22,
  },
} as const;

export type Theme = typeof theme;
