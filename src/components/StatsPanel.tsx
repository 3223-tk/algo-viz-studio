import type { AlgorithmMeta, Frame } from '../algorithms/types';

interface Props {
  meta: AlgorithmMeta;
  frame: Frame;
}

export function StatsPanel({ meta, frame }: Props) {
  const dimensions: Array<[string, string]> = [
    ['最好', meta.complexity.best],
    ['平均', meta.complexity.average],
    ['最坏', meta.complexity.worst],
    ['空间', meta.complexity.space],
  ];

  return (
    <section className="stats card">
      <div className="panel-head">
        <div>
          <h2>复杂度 & 统计</h2>
          <span className="panel-sub">随每一帧实时累计</span>
        </div>
        {meta.category === '排序' && (
          <span className={`stable-badge${meta.stable ? ' is-stable' : ''}`}>
            {meta.stable ? '稳定排序' : '不稳定'}
          </span>
        )}
      </div>

      <div className="complexity-grid">
        {dimensions.map(([label, value]) => (
          <div key={label} className="complexity-cell">
            <span>{label}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </div>

      <div className="live-stats">
        <div>
          <span>比较次数</span>
          <strong>{frame.stats.comparisons}</strong>
        </div>
        <div>
          <span>写入次数</span>
          <strong>{frame.stats.writes}</strong>
        </div>
      </div>

      <div className="legend">
        <span>
          <i style={{ background: '#f59e0b' }} /> 比较
        </span>
        <span>
          <i style={{ background: '#ef4444' }} /> 交换
        </span>
        <span>
          <i style={{ background: '#8b5cf6' }} /> 基准 / 写入
        </span>
        <span>
          <i style={{ background: meta.category === '查找' ? '#cbd5e1' : '#10b981' }} />
          {meta.category === '查找' ? '已排除' : '已归位'}
        </span>
      </div>

      <div className="algo-desc">
        <h3>
          {meta.name} <span>{meta.enName}</span>
        </h3>
        <p>{meta.tagline}</p>
        <p>{meta.description}</p>
      </div>
    </section>
  );
}
