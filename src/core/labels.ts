import type { FrameKind } from '../algorithms/types';

export const KIND_LABEL: Record<FrameKind, string> = {
  init: '初始化',
  compare: '比较',
  swap: '交换',
  overwrite: '写入',
  pivot: '选定基准',
  range: '缩小区间',
  mark: '元素归位',
  found: '命中目标',
  miss: '未找到',
  done: '执行完成',
};

export const KIND_COLOR: Record<FrameKind, string> = {
  init: '#64748b',
  compare: '#f59e0b',
  swap: '#ef4444',
  overwrite: '#8b5cf6',
  pivot: '#8b5cf6',
  range: '#0ea5e9',
  mark: '#10b981',
  found: '#10b981',
  miss: '#64748b',
  done: '#4f46e5',
};
