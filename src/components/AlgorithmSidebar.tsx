import type { CSSProperties } from 'react';
import { algorithms, categories } from '../algorithms';
import type { AlgorithmMeta } from '../algorithms/types';

interface Props {
  active: AlgorithmMeta;
  onSelect: (id: string) => void;
}

export function AlgorithmSidebar({ active, onSelect }: Props) {
  return (
    <aside className="sidebar card">
      <div className="sidebar-head">
        <h2>算法库</h2>
        <span className="count-pill">{algorithms.length} 个</span>
      </div>

      {categories.map((category) => (
        <section className="algo-group" key={category}>
          <h3>{category}算法</h3>
          <div className="algo-list">
            {algorithms
              .filter((item) => item.category === category)
              .map((item) => {
                const selected = item.id === active.id;
                return (
                  <button
                    type="button"
                    key={item.id}
                    className={`algo-item${selected ? ' is-active' : ''}`}
                    onClick={() => onSelect(item.id)}
                    style={{ '--accent': item.accent } as CSSProperties}
                    aria-pressed={selected}
                  >
                    <span className="algo-dot" />
                    <span className="algo-text">
                      <strong>{item.name}</strong>
                      <small>{item.enName}</small>
                    </span>
                    <span className="algo-complexity">{item.complexity.average}</span>
                  </button>
                );
              })}
          </div>
        </section>
      ))}

      <div className="sidebar-foot">
        <p>所有算法均由生成器逐帧录制，可任意前进、回退、拖动进度。</p>
      </div>
    </aside>
  );
}
