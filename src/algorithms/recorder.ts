import type { Frame, FrameKind } from './types';

interface FrameInput {
  line: number;
  kind: FrameKind;
  note: string;
  active?: number[];
  pivot?: number | null;
  range?: [number, number] | null;
}

/**
 * Mutable recording context shared by one algorithm run. Every `frame()` call
 * returns a deep-enough snapshot, so the UI can freely jump backwards without
 * re-running the algorithm.
 */
export class Recorder {
  readonly a: number[];
  readonly sorted = new Set<number>();
  readonly target: number | null;
  comparisons = 0;
  writes = 0;

  constructor(input: number[], target: number | null = null) {
    this.a = [...input];
    this.target = target;
  }

  frame(input: FrameInput): Frame {
    return {
      array: [...this.a],
      line: input.line,
      kind: input.kind,
      active: input.active ?? [],
      sorted: [...this.sorted],
      pivot: input.pivot ?? null,
      range: input.range ?? null,
      target: this.target,
      note: input.note,
      stats: { comparisons: this.comparisons, writes: this.writes },
    };
  }

  markAll(): void {
    for (let i = 0; i < this.a.length; i++) this.sorted.add(i);
  }
}
