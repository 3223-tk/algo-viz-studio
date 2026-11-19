import { AlertIcon, ShuffleIcon } from './icons';
import { MAX_SIZE, MIN_SIZE, MAX_VALUE } from '../core/utils';

interface Props {
  raw: string;
  onRawChange: (value: string) => void;
  onApply: () => void;
  onRandom: () => void;
  size: number;
  onSizeChange: (value: number) => void;
  error: string;
  category: '排序' | '查找';
  target: number;
  onTargetChange: (value: number) => void;
  autoSorted: boolean;
}

export function DataToolbar({
  raw,
  onRawChange,
  onApply,
  onRandom,
  size,
  onSizeChange,
  error,
  category,
  target,
  onTargetChange,
  autoSorted,
}: Props) {
  return (
    <section className="toolbar card">
      <div className="toolbar-row">
        <label className="field-label" htmlFor="data-input">
          测试数据
        </label>
        <input
          id="data-input"
          className={`text-input${error ? ' has-error' : ''}`}
          value={raw}
          onChange={(event) => onRawChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') onApply();
          }}
          placeholder="例如：42, 17, 68, 9, 55"
          spellCheck={false}
        />
        <button type="button" className="btn btn-primary" onClick={onApply}>
          应用
        </button>
        <button type="button" className="btn" onClick={onRandom}>
          <ShuffleIcon width={15} height={15} />
          随机生成
        </button>
      </div>

      <div className="toolbar-row toolbar-row-secondary">
        <div className="size-control">
          <label className="field-label" htmlFor="size-range">
            数据规模
          </label>
          <input
            id="size-range"
            type="range"
            min={MIN_SIZE}
            max={MAX_SIZE}
            value={size}
            onChange={(event) => onSizeChange(Number(event.target.value))}
          />
          <span className="size-value">{size}</span>
        </div>

        {category === '查找' && (
          <div className="target-control">
            <label className="field-label" htmlFor="target-input">
              查找目标
            </label>
            <input
              id="target-input"
              className="number-input"
              type="number"
              min={1}
              max={MAX_VALUE}
              value={target}
              onChange={(event) => onTargetChange(Number(event.target.value))}
            />
          </div>
        )}

        <span className="toolbar-note">
          {autoSorted
            ? '二分查找要求有序数组，已自动按升序排列。'
            : `支持 ${MIN_SIZE}–${MAX_SIZE} 个 1–${MAX_VALUE} 的整数，用逗号或空格分隔。`}
        </span>
      </div>

      {error && (
        <p className="toolbar-error">
          <AlertIcon width={14} height={14} />
          {error}
        </p>
      )}
    </section>
  );
}
