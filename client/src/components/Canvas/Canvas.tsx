import { CSSProperties } from 'react';
import { theme } from '../../styles/theme';
import type { Step, WorkflowDefinition } from '../../types/workflow';
import { CanvasNode } from './CanvasNode';

interface Props {
  draft: WorkflowDefinition;
}

const CANVAS_W = 344;
const NODE_W = 160;
const NODE_H = 90;
const GAP = 44;
const PADDING_TOP = 6;
const CENTER_X = (CANVAS_W - NODE_W) / 2;
const LEFT_X = 4;
const RIGHT_X = CANVAS_W - NODE_W - 4;

type EdgeColor = 'blue' | 'pink';

interface PositionedNode {
  id: string;
  kind: 'trigger' | 'condition' | 'action';
  title: string;
  sub?: string;
  x: number;
  y: number;
}

interface PositionedEdge {
  from: { x: number; y: number };
  to: { x: number; y: number };
  color: EdgeColor;
}

interface BranchLabel {
  x: number;
  y: number;
  text: 'TRUE' | 'FALSE';
}

function prettify(s: string): string {
  if (!s) return '';
  return s
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .map((w) => (w ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase() : w))
    .join(' ');
}

function nodeFromStep(step: Step, x: number, y: number): PositionedNode {
  if (step.type === 'action') {
    return {
      id: step.id,
      kind: 'action',
      title: prettify(step.componentKey),
      sub: prettify(step.app),
      x,
      y,
    };
  }
  return {
    id: step.id,
    kind: 'condition',
    title: step.expression.reason || step.expression.code,
    sub: step.expression.reason ? step.expression.code : undefined,
    x,
    y,
  };
}

function bezierPath(
  from: { x: number; y: number },
  to: { x: number; y: number },
): string {
  const dy = Math.max(18, (to.y - from.y) * 0.5);
  return `M ${from.x} ${from.y} C ${from.x} ${from.y + dy} ${to.x} ${to.y - dy} ${to.x} ${to.y}`;
}

interface Layout {
  nodes: PositionedNode[];
  edges: PositionedEdge[];
  labels: BranchLabel[];
  width: number;
  height: number;
}

function layout(draft: WorkflowDefinition): Layout {
  const nodes: PositionedNode[] = [];
  const edges: PositionedEdge[] = [];
  const labels: BranchLabel[] = [];

  let cursorY = PADDING_TOP;

  let prevBottom: { x: number; y: number } | null = null;
  let prevColor: EdgeColor = 'blue';

  if (draft.trigger) {
    const trg = draft.trigger;
    nodes.push({
      id: trg.id,
      kind: 'trigger',
      title: prettify(trg.componentKey),
      sub: prettify(trg.app),
      x: CENTER_X,
      y: cursorY,
    });
    prevBottom = { x: CENTER_X + NODE_W / 2, y: cursorY + NODE_H };
    prevColor = 'blue';
    cursorY += NODE_H + GAP;
  }

  const branchTargets = new Set<string>();
  for (const step of draft.steps) {
    if (step.type === 'condition') {
      for (const id of step.whenTrue) branchTargets.add(id);
      for (const id of step.whenFalse) branchTargets.add(id);
    }
  }
  const stepsById = new Map(draft.steps.map((s) => [s.id, s]));

  for (const step of draft.steps) {
    if (branchTargets.has(step.id)) continue;

    if (step.type === 'condition') {
      const condTop = { x: CENTER_X + NODE_W / 2, y: cursorY };
      const condBottom = { x: CENTER_X + NODE_W / 2, y: cursorY + NODE_H };
      nodes.push({
        id: step.id,
        kind: 'condition',
        title: step.expression.reason || step.expression.code,
        sub: step.expression.reason ? step.expression.code : undefined,
        x: CENTER_X,
        y: cursorY,
      });
      if (prevBottom) edges.push({ from: prevBottom, to: condTop, color: prevColor });
      cursorY += NODE_H + GAP;

      const trueId = step.whenTrue[0];
      const falseId = step.whenFalse[0];
      const trueTarget = trueId ? stepsById.get(trueId) : undefined;
      const falseTarget = falseId ? stepsById.get(falseId) : undefined;

      if (trueTarget && falseTarget) {
        const branchY = cursorY;
        nodes.push(nodeFromStep(trueTarget, LEFT_X, branchY));
        nodes.push(nodeFromStep(falseTarget, RIGHT_X, branchY));
        edges.push({
          from: condBottom,
          to: { x: LEFT_X + NODE_W / 2, y: branchY },
          color: 'pink',
        });
        edges.push({
          from: condBottom,
          to: { x: RIGHT_X + NODE_W / 2, y: branchY },
          color: 'pink',
        });
        labels.push({ x: LEFT_X + NODE_W / 2, y: branchY - 12, text: 'TRUE' });
        labels.push({ x: RIGHT_X + NODE_W / 2, y: branchY - 12, text: 'FALSE' });
        cursorY = branchY + NODE_H + GAP;

        prevBottom = null;
      } else if (trueTarget) {
        const branchY = cursorY;
        nodes.push(nodeFromStep(trueTarget, CENTER_X, branchY));
        edges.push({
          from: condBottom,
          to: { x: CENTER_X + NODE_W / 2, y: branchY },
          color: 'pink',
        });
        labels.push({ x: CENTER_X + NODE_W / 2, y: branchY - 12, text: 'TRUE' });
        prevBottom = { x: CENTER_X + NODE_W / 2, y: branchY + NODE_H };
        prevColor = 'blue';
        cursorY = branchY + NODE_H + GAP;
      } else {

        prevBottom = condBottom;
        prevColor = 'pink';
      }
    } else {
      nodes.push({
        id: step.id,
        kind: 'action',
        title: prettify(step.componentKey),
        sub: prettify(step.app),
        x: CENTER_X,
        y: cursorY,
      });
      const top = { x: CENTER_X + NODE_W / 2, y: cursorY };
      if (prevBottom) edges.push({ from: prevBottom, to: top, color: prevColor });
      prevBottom = { x: CENTER_X + NODE_W / 2, y: cursorY + NODE_H };
      prevColor = 'blue';
      cursorY += NODE_H + GAP;
    }
  }

  const height = nodes.length
    ? Math.max(...nodes.map((n) => n.y + NODE_H)) + PADDING_TOP
    : 0;

  return { nodes, edges, labels, width: CANVAS_W, height };
}

const styles: Record<string, CSSProperties> = {
  root: {
    padding: 18,
    display: 'flex',
    justifyContent: 'center',
  },
  inner: {
    position: 'relative',
  },
  empty: {
    fontFamily: theme.font.sans,
    fontSize: 13.5,
    color: theme.color.gray500,
    textAlign: 'center',
    padding: '40px 18px',
  },
  svg: {
    position: 'absolute',
    inset: 0,
    overflow: 'visible',
    pointerEvents: 'none',
  },
  nodePos: {
    position: 'absolute',
    width: NODE_W,
  },
  labelPill: {
    position: 'absolute',
    transform: 'translateX(-50%)',
    fontFamily: theme.font.mono,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    background: theme.color.canvas,
    boxShadow: theme.shadow.ring,
    borderRadius: theme.radius.pill,
    padding: '2px 8px',
    color: theme.color.conditionPink,
    whiteSpace: 'nowrap',
  },
};

export function Canvas({ draft }: Props) {
  if (!draft.trigger && draft.steps.length === 0) {
    return (
      <div style={styles.root}>
        <div style={styles.empty}>
          Connect a trigger to start the flow. The diagram draws itself here as
          you build.
        </div>
      </div>
    );
  }

  const { nodes, edges, labels, width, height } = layout(draft);

  return (
    <div style={styles.root}>
      <div style={{ ...styles.inner, width, height }}>
        <svg
          width={width}
          height={height}
          style={styles.svg}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <marker
              id="arrow-blue"
              markerWidth="7"
              markerHeight="7"
              refX="5.5"
              refY="3"
              orient="auto"
            >
              <path d="M0,0 L6,3 L0,6 z" fill={theme.color.triggerBlue} />
            </marker>
            <marker
              id="arrow-pink"
              markerWidth="7"
              markerHeight="7"
              refX="5.5"
              refY="3"
              orient="auto"
            >
              <path d="M0,0 L6,3 L0,6 z" fill={theme.color.conditionPink} />
            </marker>
          </defs>
          {edges.map((e, i) => (
            <path
              key={i}
              d={bezierPath(e.from, e.to)}
              fill="none"
              strokeWidth={1.6}
              strokeLinecap="round"
              stroke={
                e.color === 'blue'
                  ? theme.color.triggerBlue
                  : theme.color.conditionPink
              }
              markerEnd={
                e.color === 'blue' ? 'url(#arrow-blue)' : 'url(#arrow-pink)'
              }
            />
          ))}
        </svg>

        {nodes.map((n) => (
          <div
            key={n.id}
            style={{ ...styles.nodePos, left: n.x, top: n.y }}
          >
            <CanvasNode kind={n.kind} title={n.title} sub={n.sub} />
          </div>
        ))}

        {labels.map((l, i) => (
          <div
            key={i}
            style={{ ...styles.labelPill, left: l.x, top: l.y }}
          >
            {l.text}
          </div>
        ))}
      </div>
    </div>
  );
}
