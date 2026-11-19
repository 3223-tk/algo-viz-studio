import { Recorder } from './recorder';
import type { Frame } from './types';

export const selectionSortCode = [
  'function selectionSort(a: number[]): number[] {',
  '  const n = a.length;',
  '  for (let i = 0; i < n - 1; i++) {',
  '    let min = i;',
  '    for (let j = i + 1; j < n; j++) {',
  '      comparisons++;',
  '      if (a[j] < a[min]) min = j;',
  '    }',
  '    [a[i], a[min]] = [a[min], a[i]];',
  '    writes += 2;',
  '    markSorted(i);',
  '  }',
  '  markAllSorted();',
  '  return a;',
  '}',
];

export function* selectionSort(input: number[], _target: number): Generator<Frame, void, unknown> {
  const r = new Recorder(input);
  const a = r.a;
  const n = a.length;

  yield r.frame({ line: 1, kind: 'init', note: `开始选择排序，共 ${n} 个元素` });

  for (let i = 0; i < n - 1; i++) {
    let min = i;
    yield r.frame({
      line: 4,
      kind: 'range',
      range: [i, n - 1],
      pivot: min,
      note: `第 ${i + 1} 轮：在 [${i}, ${n - 1}] 中寻找最小值`,
    });

    for (let j = i + 1; j < n; j++) {
      r.comparisons++;
      yield r.frame({
        line: 7,
        kind: 'compare',
        active: [j, min],
        pivot: min,
        note: `a[${j}]=${a[j]} 与当前最小 a[${min}]=${a[min]} 比较`,
      });
      if (a[j] < a[min]) {
        min = j;
        yield r.frame({
          line: 7,
          kind: 'pivot',
          active: [min],
          pivot: min,
          note: `发现更小值，更新 min = ${min}`,
        });
      }
    }

    if (min !== i) {
      [a[i], a[min]] = [a[min], a[i]];
      r.writes += 2;
    }
    yield r.frame({
      line: 9,
      kind: 'swap',
      active: [i, min],
      note: min === i ? `a[${i}] 已是最小，无需交换` : `交换 a[${i}] 与 a[${min}]`,
    });

    r.sorted.add(i);
    yield r.frame({ line: 11, kind: 'mark', active: [i], note: `a[${i}]=${a[i]} 已归位` });
  }

  r.markAll();
  yield r.frame({
    line: 14,
    kind: 'done',
    note: `排序完成 · 比较 ${r.comparisons} 次 · 写入 ${r.writes} 次`,
  });
}
