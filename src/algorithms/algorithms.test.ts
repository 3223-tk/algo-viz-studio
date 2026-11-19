import { describe, expect, it } from 'vitest';
import { algorithms, getAlgorithm } from './index';
import type { AlgorithmMeta, Frame } from './types';

const sorters = algorithms.filter((algorithm) => algorithm.category === '排序');

const cases: number[][] = [
  [],
  [1],
  [5, 5, 5],
  [1, 2, 3, 4, 5],
  [5, 4, 3, 2, 1],
  [3, 1, 4, 1, 5, 9, 2, 6],
  [42, 17, 68, 9, 55, 31, 76, 23, 48, 5, 61, 37],
];

function assertFrameInvariants(frames: Frame[], meta: AlgorithmMeta, length: number): void {
  for (const frame of frames) {
    expect(frame.array.length).toBe(length);
    expect(frame.line).toBeGreaterThanOrEqual(1);
    expect(frame.line).toBeLessThanOrEqual(meta.code.length);
    expect(frame.note.length).toBeGreaterThan(0);
  }
  for (let i = 1; i < frames.length; i++) {
    expect(frames[i].stats.comparisons).toBeGreaterThanOrEqual(frames[i - 1].stats.comparisons);
    expect(frames[i].stats.writes).toBeGreaterThanOrEqual(frames[i - 1].stats.writes);
  }
}

for (const meta of sorters) {
  describe(meta.name, () => {
    for (const input of cases) {
      it(`正确排序 [${input.join(',')}]`, () => {
        const original = [...input];
        const frames = Array.from(meta.run(input, 0));

        expect(input).toEqual(original); // 算法不得修改调用方数组
        expect(frames.length).toBeGreaterThan(0);
        expect(frames[0].kind).toBe('init');

        const last = frames[frames.length - 1];
        expect(last.kind).toBe('done');
        expect(last.array).toEqual([...original].sort((a, b) => a - b));
        expect(new Set(last.sorted).size).toBe(original.length);

        assertFrameInvariants(frames, meta, original.length);
      });
    }

    it('已有序输入时冒泡 / 插入排序比较次数不超过 n²', () => {
      const frames = Array.from(meta.run([1, 2, 3, 4, 5, 6, 7, 8], 0));
      expect(frames[frames.length - 1].stats.comparisons).toBeLessThanOrEqual(64);
    });
  });
}

describe('二分查找', () => {
  const meta = getAlgorithm('binary');
  const sorted = [5, 12, 23, 31, 42, 48, 55, 61, 68, 76, 84, 95];

  it('能找到数组中存在的每一个元素', () => {
    for (let i = 0; i < sorted.length; i++) {
      const frames = Array.from(meta.run(sorted, sorted[i]));
      const last = frames[frames.length - 1];
      expect(last.kind).toBe('found');
      expect(last.target).toBe(sorted[i]);
      expect(last.active[0]).toBe(i);
    }
  });

  it('找不到不存在的元素时给出 miss 帧', () => {
    for (const target of [1, 50, 100]) {
      const frames = Array.from(meta.run(sorted, target));
      expect(frames[frames.length - 1].kind).toBe('miss');
      assertFrameInvariants(frames, meta, sorted.length);
    }
  });

  it('比较次数满足 O(log n)', () => {
    const frames = Array.from(meta.run(sorted, 100));
    expect(frames[frames.length - 1].stats.comparisons).toBeLessThanOrEqual(
      Math.ceil(Math.log2(sorted.length + 1)) + 1,
    );
  });

  it('空数组直接返回未找到', () => {
    const frames = Array.from(meta.run([], 7));
    expect(frames[frames.length - 1].kind).toBe('miss');
  });
});

describe('算法注册表', () => {
  it('id 唯一且每个算法都有代码与默认数据', () => {
    expect(new Set(algorithms.map((a) => a.id)).size).toBe(algorithms.length);
    for (const meta of algorithms) {
      expect(meta.code.length).toBeGreaterThan(5);
      expect(meta.defaultInput.length).toBeGreaterThan(0);
      expect(meta.description.length).toBeGreaterThan(20);
      expect(typeof meta.run).toBe('function');
    }
  });

  it('查找类算法的默认输入必须升序', () => {
    for (const meta of algorithms.filter((a) => a.category === '查找')) {
      expect(meta.defaultInput).toEqual([...meta.defaultInput].sort((a, b) => a - b));
    }
  });

  it('未知 id 回退到第一个算法', () => {
    expect(getAlgorithm('does-not-exist').id).toBe(algorithms[0].id);
  });
});
