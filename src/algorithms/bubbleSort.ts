import { Recorder } from './recorder';
import type { Frame } from './types';

export const bubbleSortCode = [
  'function bubbleSort(a: number[]): number[] {',
  '  const n = a.length;',
  '  for (let i = 0; i < n - 1; i++) {',
  '    let swapped = false;',
  '    for (let j = 0; j < n - 1 - i; j++) {',
  '      comparisons++;',
  '      if (a[j] > a[j + 1]) {',
  '        [a[j], a[j + 1]] = [a[j + 1], a[j]];',
  '        writes += 2;  swapped = true;',
  '      }',
  '    }',
  '    markSorted(n - 1 - i);',
  '    if (!swapped) break;   // 本轮无交换 → 已有序',
  '  }',
  '  markAllSorted();',
  '  return a;',
  '}',
];

export function* bubbleSort(input: number[], _target: number): Generator<Frame, void, unknown> {
  const r = new Recorder(input);
  const a = r.a;
  const n = a.length;

  yield r.frame({ line: 1, kind: 'init', note: `开始冒泡排序，共 ${n} 个元素` });

  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    yield r.frame({
      line: 3,
      kind: 'range',
      range: [0, n - 1 - i],
      note: `第 ${i + 1} 轮：未排序区间 [0, ${n - 1 - i}]`,
    });

    for (let j = 0; j < n - 1 - i; j++) {
      r.comparisons++;
      yield r.frame({
        line: 7,
        kind: 'compare',
        active: [j, j + 1],
        note: `比较 a[${j}]=${a[j]} 与 a[${j + 1}]=${a[j + 1]}`,
      });
      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        r.writes += 2;
        swapped = true;
        yield r.frame({
          line: 8,
          kind: 'swap',
          active: [j, j + 1],
          note: `逆序 → 交换，得到 ${a[j]}, ${a[j + 1]}`,
        });
      }
    }

    r.sorted.add(n - 1 - i);
    yield r.frame({
      line: 12,
      kind: 'mark',
      active: [n - 1 - i],
      note: `a[${n - 1 - i}]=${a[n - 1 - i]} 已归位，本轮结束`,
    });

    if (!swapped) {
      r.markAll();
      yield r.frame({
        line: 13,
        kind: 'mark',
        note: '本轮没有任何交换，说明数组已整体有序，提前退出（最好情况 O(n)）',
      });
      break;
    }
  }

  r.markAll();
  yield r.frame({
    line: 16,
    kind: 'done',
    note: `排序完成 · 比较 ${r.comparisons} 次 · 写入 ${r.writes} 次`,
  });
}
