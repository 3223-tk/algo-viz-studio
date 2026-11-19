import { Recorder } from './recorder';
import type { Frame } from './types';

export const binarySearchCode = [
  'function binarySearch(a: number[], target: number): number {',
  '  let lo = 0, hi = a.length - 1;   // 前提：a 已升序',
  '  while (lo <= hi) {',
  '    const mid = (lo + hi) >> 1;',
  '    comparisons++;',
  '    if (a[mid] === target) return mid;',
  '    if (a[mid] < target) lo = mid + 1;',
  '    else hi = mid - 1;',
  '  }',
  '  return -1;   // 未找到',
  '}',
];

export function* binarySearch(input: number[], target: number): Generator<Frame, void, unknown> {
  const r = new Recorder(input, target);
  const a = r.a;
  let lo = 0;
  let hi = a.length - 1;

  yield r.frame({
    line: 1,
    kind: 'init',
    range: [0, Math.max(0, a.length - 1)],
    note: `在有序数组中查找 target = ${target}`,
  });

  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    yield r.frame({
      line: 3,
      kind: 'range',
      range: [lo, hi],
      note: `当前搜索区间 [${lo}, ${hi}]`,
    });

    r.comparisons++;
    yield r.frame({
      line: 6,
      kind: 'compare',
      active: [mid],
      pivot: mid,
      range: [lo, hi],
      note: `取中点 mid=${mid}，a[${mid}]=${a[mid]}，与 ${target} 比较`,
    });

    if (a[mid] === target) {
      yield r.frame({
        line: 6,
        kind: 'found',
        active: [mid],
        pivot: mid,
        range: [lo, hi],
        note: `命中！target=${target} 位于下标 ${mid}`,
      });
      return;
    }

    if (a[mid] < target) {
      for (let k = lo; k <= mid; k++) r.sorted.add(k);
      yield r.frame({
        line: 7,
        kind: 'range',
        range: [mid + 1, hi],
        active: [mid],
        note: `a[${mid}]=${a[mid]} < ${target} → 丢弃左半，lo = ${mid + 1}`,
      });
      lo = mid + 1;
    } else {
      for (let k = mid; k <= hi; k++) r.sorted.add(k);
      yield r.frame({
        line: 8,
        kind: 'range',
        range: [lo, mid - 1],
        active: [mid],
        note: `a[${mid}]=${a[mid]} > ${target} → 丢弃右半，hi = ${mid - 1}`,
      });
      hi = mid - 1;
    }
  }

  r.markAll();
  yield r.frame({
    line: 10,
    kind: 'miss',
    note: `区间为空，数组中不存在 ${target} · 共比较 ${r.comparisons} 次`,
  });
}
