import { Recorder } from './recorder';
import type { Frame } from './types';

export const quickSortCode = [
  'function quickSort(a: number[], lo: number, hi: number): void {',
  '  if (lo > hi) return;',
  '  if (lo === hi) { markSorted(lo); return; }',
  '  const p = partition(a, lo, hi);',
  '  markSorted(p);',
  '  quickSort(a, lo, p - 1);',
  '  quickSort(a, p + 1, hi);',
  '}',
  'function partition(a: number[], lo: number, hi: number): number {',
  '  const pivot = a[hi];   // Lomuto 划分：取末元素',
  '  let i = lo;',
  '  for (let j = lo; j < hi; j++) {',
  '    comparisons++;',
  '    if (a[j] < pivot) {',
  '      [a[i], a[j]] = [a[j], a[i]];',
  '      writes += 2;  i++;',
  '    }',
  '  }',
  '  [a[i], a[hi]] = [a[hi], a[i]];',
  '  writes += 2;',
  '  return i;',
  '}',
];

function* partition(r: Recorder, lo: number, hi: number): Generator<Frame, number, unknown> {
  const a = r.a;
  const pivotValue = a[hi];
  let i = lo;

  yield r.frame({
    line: 9,
    kind: 'pivot',
    pivot: hi,
    range: [lo, hi],
    note: `划分区间 [${lo}, ${hi}]，选 a[${hi}]=${pivotValue} 为基准`,
  });

  for (let j = lo; j < hi; j++) {
    r.comparisons++;
    yield r.frame({
      line: 13,
      kind: 'compare',
      active: [j, hi],
      pivot: hi,
      range: [lo, hi],
      note: `比较 a[${j}]=${a[j]} 与基准 ${pivotValue}`,
    });
    if (a[j] < pivotValue) {
      if (i !== j) {
        [a[i], a[j]] = [a[j], a[i]];
        r.writes += 2;
      }
      yield r.frame({
        line: 14,
        kind: 'swap',
        active: [i, j],
        pivot: hi,
        range: [lo, hi],
        note: `${a[j]} < 基准 → 放到左侧边界 i=${i}`,
      });
      i++;
    }
  }

  if (i !== hi) {
    [a[i], a[hi]] = [a[hi], a[i]];
    r.writes += 2;
  }
  yield r.frame({
    line: 18,
    kind: 'swap',
    active: [i, hi],
    pivot: i,
    range: [lo, hi],
    note: `把基准交换到最终位置 ${i}，左小右大`,
  });
  return i;
}

function* sort(r: Recorder, lo: number, hi: number): Generator<Frame, void, unknown> {
  if (lo > hi) return;
  if (lo === hi) {
    r.sorted.add(lo);
    yield r.frame({ line: 3, kind: 'mark', active: [lo], note: `单元素区间 [${lo}] 自然有序` });
    return;
  }

  yield r.frame({ line: 4, kind: 'range', range: [lo, hi], note: `处理区间 [${lo}, ${hi}]` });
  const p = yield* partition(r, lo, hi);
  r.sorted.add(p);
  yield r.frame({ line: 5, kind: 'mark', active: [p], pivot: p, note: `基准 a[${p}] 归位` });

  yield r.frame({ line: 6, kind: 'range', range: [lo, p - 1], note: `递归左半 [${lo}, ${p - 1}]` });
  yield* sort(r, lo, p - 1);
  yield r.frame({ line: 7, kind: 'range', range: [p + 1, hi], note: `递归右半 [${p + 1}, ${hi}]` });
  yield* sort(r, p + 1, hi);
}

export function* quickSort(input: number[], _target: number): Generator<Frame, void, unknown> {
  const r = new Recorder(input);
  yield r.frame({
    line: 1,
    kind: 'init',
    note: `开始快速排序（Lomuto 划分），共 ${r.a.length} 个元素`,
  });
  if (r.a.length > 0) yield* sort(r, 0, r.a.length - 1);
  r.markAll();
  yield r.frame({
    line: 20,
    kind: 'done',
    note: `排序完成 · 比较 ${r.comparisons} 次 · 写入 ${r.writes} 次`,
  });
}
