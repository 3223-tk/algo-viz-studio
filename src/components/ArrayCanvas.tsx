import type { Frame } from '../algorithms/types';
import { KIND_COLOR, KIND_LABEL } from '../core/labels';

interface Props {
  frame: Frame;
  accent: string;
  category: '排序' | '查找';
  index: number;
  total: number;
}

const W = 900;
const H = 340;
const PAD_X = 28;
const BASE_Y = 292;
const TOP_Y = 54;
const PLOT_H = BASE_Y - TOP_Y;

export function ArrayCanvas({ frame, accent, category, index, total }: Props) {
  const n = frame.array.length;
  const max = Math.max(1, ...frame.array, frame.target ?? 0);
  const slot = (W - PAD_X * 2) / Math.max(n, 1);
  const gap = Math.min(12, slot * 0.3);
  const barW = Math.max(6, slot - gap);

  const xOf = (i: number) => PAD_X + i * slot + gap / 2;
  const yOf = (value: number) => BASE_Y - (value / max) * PLOT_H;
  const hOf = (value: number) => Math.max(3, (value / max) * PLOT_H);

  const range =
    frame.range && frame.range[0] <= frame.range[1] && frame.range[1] < n ? frame.range : null;

  const colorOf = (i: number): string => {
    if (frame.kind === 'found' && frame.active.includes(i)) return '#10b981';
    if (frame.pivot === i) return '#8b5cf6';
    if (frame.active.includes(i)) {
      if (frame.kind === 'swap') return '#ef4444';
      if (frame.kind === 'overwrite') return '#8b5cf6';
      if (frame.kind === 'mark') return '#10b981';
      return '#f59e0b';
    }
    if (frame.sorted.includes(i)) return category === '查找' ? '#cbd5e1' : '#10b981';
    return accent;
  };

  return (
    <section className="canvas card">
      <div className="canvas-head">
        <div>
          <h2>执行过程</h2>
          <span className="canvas-sub">柱高代表数值 · 颜色代表当前状态</span>
        </div>
        <div className="canvas-meta">
          <span
            className="kind-badge"
            style={{
              color: KIND_COLOR[frame.kind],
              backgroundColor: `${KIND_COLOR[frame.kind]}1f`,
            }}
          >
            {KIND_LABEL[frame.kind]}
          </span>
          <span className="frame-count">
            帧 {index + 1} / {total}
          </span>
        </div>
      </div>

      <svg className="chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="算法执行状态柱状图">
        {range && (
          <g>
            <rect
              x={xOf(range[0]) - gap / 2 - 3}
              y={TOP_Y - 16}
              width={(range[1] - range[0] + 1) * slot + 6}
              height={PLOT_H + 30}
              rx={8}
              fill={accent}
              opacity={0.07}
            />
            <text x={xOf(range[0])} y={TOP_Y - 24} className="range-label" fill={accent}>
              当前区间 [{range[0]}, {range[1]}]
            </text>
          </g>
        )}

        <line
          x1={PAD_X}
          y1={BASE_Y}
          x2={W - PAD_X}
          y2={BASE_Y}
          stroke="#dbe2ee"
          strokeWidth={1.5}
        />

        {frame.array.map((value, i) => {
          const showValue = n <= 16 || frame.active.includes(i) || frame.pivot === i;
          return (
            <g key={i}>
              <rect
                className="bar"
                x={xOf(i)}
                y={yOf(value)}
                width={barW}
                height={hOf(value)}
                rx={Math.min(6, barW / 3)}
                fill={colorOf(i)}
              />
              {showValue && (
                <text
                  x={xOf(i) + barW / 2}
                  y={yOf(value) - 8}
                  textAnchor="middle"
                  className="bar-value"
                >
                  {value}
                </text>
              )}
              {frame.pivot === i && (
                <text
                  x={xOf(i) + barW / 2}
                  y={yOf(value) - 24}
                  textAnchor="middle"
                  className="pivot-label"
                >
                  pivot
                </text>
              )}
              <text x={xOf(i) + barW / 2} y={BASE_Y + 22} textAnchor="middle" className="bar-index">
                {i}
              </text>
            </g>
          );
        })}

        {frame.target !== null && (
          <g>
            <line
              x1={PAD_X}
              y1={yOf(frame.target)}
              x2={W - PAD_X}
              y2={yOf(frame.target)}
              stroke="#ec4899"
              strokeWidth={1.6}
              strokeDasharray="7 5"
            />
            <rect
              x={W - PAD_X - 92}
              y={yOf(frame.target) - 21}
              width={88}
              height={19}
              rx={5}
              fill="#ec4899"
            />
            <text
              x={W - PAD_X - 48}
              y={yOf(frame.target) - 7}
              textAnchor="middle"
              className="target-label"
            >
              target = {frame.target}
            </text>
          </g>
        )}

        {n === 0 && (
          <text x={W / 2} y={H / 2} textAnchor="middle" className="empty-label">
            数组为空
          </text>
        )}
      </svg>

      <div className="narration">
        <span className="narration-mark" aria-hidden="true">
          ›
        </span>
        <p>{frame.note}</p>
      </div>
    </section>
  );
}
