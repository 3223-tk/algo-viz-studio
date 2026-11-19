export type FrameKind =
  | 'init'
  | 'compare'
  | 'swap'
  | 'overwrite'
  | 'pivot'
  | 'range'
  | 'mark'
  | 'found'
  | 'miss'
  | 'done';

export interface FrameStats {
  comparisons: number;
  writes: number;
}

/** A single immutable snapshot of the algorithm state, produced by a generator. */
export interface Frame {
  array: number[];
  /** 1-based line number in `AlgorithmMeta.code` that produced this frame. */
  line: number;
  kind: FrameKind;
  active: number[];
  sorted: number[];
  pivot: number | null;
  range: [number, number] | null;
  /** Search target, only meaningful for searching algorithms. */
  target: number | null;
  note: string;
  stats: FrameStats;
}

export type AlgorithmRun = (input: number[], target: number) => Generator<Frame, void, unknown>;

export interface Complexity {
  best: string;
  average: string;
  worst: string;
  space: string;
}

export interface AlgorithmMeta {
  id: string;
  name: string;
  enName: string;
  category: '排序' | '查找';
  tagline: string;
  description: string;
  complexity: Complexity;
  stable: boolean;
  code: string[];
  run: AlgorithmRun;
  defaultInput: number[];
  defaultTarget: number;
  accent: string;
}
