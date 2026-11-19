import { Recorder } from './recorder';
import type { Frame } from './types';

export const insertionSortCode = [
  'function insertionSort(a: number[]): number[] {',
  '  for (let i = 1; i < a.length; i++) {',
  '    const key = a[i];',
  '    let j = i - 1;',
  '    while (j >= 0 && a[j] > key) {',
  '      a[j + 1] = a[j];   // 右移',
  '      writes++;  j--;',
  '    }',
  '    a[j + 1] = key;   // 插入',
  '    writes++;',
  '    markSortedPrefix(i);',
  '  }',
  '  markAllSorted();',
  '  return a;',
  '}',
];

export function* insertionSort(input: number[], _target: number): Generator<Frame, void, unknown> {
  const r = new Recorder(input);
  const a = r.a;

  yield r.frame({ line: 1, kind: 'init', note: `开始插入排序，共 ${a.length} 个元素` });

  for (let i = 1; i < a.length; i++) {
    const key = a[i];
    let j = i - 1;
    yield r.frame({
      line: 3,
      kind: 'range',
      range: [0, i],
      pivot: i,
      active: [i],
      note: `取出 a[${i}]=${key}，向左在已排序前缀中找插入位`,
    });

    while (j >= 0 && a[j] > key) {
      r.comparisons++;
      yield r.frame({
        line: 5,
        kind: 'compare',
        active: [j, j + 1],
        pivot: i,
        note: `a[${j}]=${a[j]} > key=${key}，需要右移`,
      });
      a[j + 1] = a[j];
      r.writes++;
      yield r.frame({
        line: 6,
        kind: 'overwrite',
        active: [j + 1],
        pivot: i,
        note: `把 ${a[j]} 右移到位置 ${j + 1}`,
      });
      j--;
    }
    if (j >= 0) r.comparisons++;

    a[j + 1] = key;
    r.writes++;
    yield r.frame({
      line: 9,
      kind: 'overwrite',
      active: [j + 1],
      note: `把 key=${key} 插入到位置 ${j + 1}`,
    });

    for (let k = 0; k <= i; k++) r.sorted.add(k);
    yield r.frame({
      line: 11,
      kind: 'mark',
      range: [0, i],
      note: `前缀 [0, ${i}] 已保持有序`,
    });
  }

  r.markAll();
  yield r.frame({
    line: 14,
    kind: 'done',
    note: `排序完成 · 比较 ${r.comparisons} 次 · 写入 ${r.writes} 次`,
  });
}
