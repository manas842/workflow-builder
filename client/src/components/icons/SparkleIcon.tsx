import { CSSProperties } from 'react';

interface Props {
  size?: number;
  color?: string;
  style?: CSSProperties;
}

export function SparkleIcon({ size = 16, color = '#5b9df7', style }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={color}
      style={style}
      aria-hidden
    >
      <path d="M12 2l1.8 5.2L19 9l-5.2 1.8L12 16l-1.8-5.2L5 9l5.2-1.8L12 2zM19 14l.9 2.6L22.5 17.5l-2.6.9L19 21l-.9-2.6L15.5 17.5l2.6-.9L19 14zM5 14l.7 2L7.5 16.5l-1.8.5L5 19l-.7-2L2.5 16.5l1.8-.5L5 14z" />
    </svg>
  );
}
