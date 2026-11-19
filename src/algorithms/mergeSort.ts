import { Recorder } from './recorder';
import type { Frame } from './types';

export const mergeSortCode = [
  'function mergeSort(a: number[], lo: number, hi: number): void {',
  '  if (lo >= hi) return;',
  '  const mid = (lo + hi) >> 1;',
  '  mergeSort(a, lo, mid);',
  '  mergeSort(a, mid + 1, hi);',
  '  merge(a, lo, mid, hi);',
  '}',
  'function merge(a: number[], lo: number, mid: number, hi: number): void {',
  '  const left = a.slice(lo, mid + 1);',
  '  const right = a.slice(mid + 1, hi + 1);',
  '  let i = 0, j = 0, k = lo;',
  '  while (i < left.length && j < right.length) {',
  '    comparisons++;',
  '    if (left[i] <= right[j]) {',
  '      a[k] = left[i++];  writes++;',
  '    } else {',
  '      a[k] = right[j++]; writes++;',
  '    }',
  '    k++;',
  '  }',
  '  while (i < left.length) a[k++] = left[i++];',
  '  while (j < right.length) a[k++] = right[j++];',
  '}',
];

function* merge(r: Recorder, lo: number, mid: number, hi: number): Generator<Frame, void, unknown> {
  const a = r.a;
  const left = a.slice(lo, mid + 1);
  const right = a.slice(mid + 1, hi + 1);
  let i = 0;
  let j = 0;
  let k = lo;

  yield r.frame({
    line: 9,
    kind: 'range',
    range: [lo, hi],
    note: `合并 [${lo}, ${mid}] 与 [${mid + 1}, ${hi}]`,
  });

  while (i < left.length && j < right.length) {
    r.comparisons++;
    yield r.frame({
      line: 13,
      kind: 'compare',
      active: [k],
      range: [lo, hi],
      note: `比较 left[${i}]=${left[i]} 与 right[${j}]=${right[j]}`,
    });
    const fromLeft = left[i] <= right[j];
    const value = fromLeft ? left[i++] : right[j++];
    a[k] = value;
    r.writes++;
    yield r.frame({
      line: fromLeft ? 14 : 16,
      kind: 'overwrite',
      active: [k],
      range: [lo, hi],
      note: `取${fromLeft ? '左' : '右'}侧 ${value} 写入 a[${k}]`,
    });
    k++;
  }

  while (i < left.length) {
    a[k] = left[i++];
    r.writes++;
    yield r.frame({
      line: 19,
      kind: 'overwrite',
      active: [k],
      range: [lo, hi],
      note: `收尾：左侧剩余 ${a[k]} 写入 a[${k}]`,
    });
    k++;
  }
  while (j < right.length) {
    a[k] = right[j++];
    r.writes++;
    yield r.frame({
      line: 20,
      kind: 'overwrite',
      active: [k],
      range: [lo, hi],
      note: `收尾：右侧剩余 ${a[k]} 写入 a[${k}]`,
    });
    k++;
  }
}

function* sort(r: Recorder, lo: number, hi: number): Generator<Frame, void, unknown> {
  if (lo >= hi) return;
  const mid = (lo + hi) >> 1;
  yield r.frame({
    line: 3,
    kind: 'range',
    range: [lo, hi],
    note: `拆分 [${lo}, ${hi}]，mid=${mid}`,
  });
  yield* sort(r, lo, mid);
  yield* sort(r, mid + 1, hi);
  yield* merge(r, lo, mid, hi);
}

export function* mergeSort(input: number[], _target: number): Generator<Frame, void, unknown> {
  const r = new Recorder(input);
  yield r.frame({
    line: 1,
    kind: 'init',
    note: `开始归并排序（自顶向下），共 ${r.a.length} 个元素`,
  });
  if (r.a.length > 0) yield* sort(r, 0, r.a.length - 1);
  r.markAll();
  yield r.frame({
    line: 20,
    kind: 'done',
    note: `排序完成 · 比较 ${r.comparisons} 次 · 写入 ${r.writes} 次`,
  });
}
