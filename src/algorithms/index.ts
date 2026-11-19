import { bubbleSort, bubbleSortCode } from './bubbleSort';
import { selectionSort, selectionSortCode } from './selectionSort';
import { insertionSort, insertionSortCode } from './insertionSort';
import { quickSort, quickSortCode } from './quickSort';
import { mergeSort, mergeSortCode } from './mergeSort';
import { binarySearch, binarySearchCode } from './binarySearch';
import type { AlgorithmMeta } from './types';

const DEFAULT_SORT_INPUT = [42, 17, 68, 9, 55, 31, 76, 23, 48, 5, 61, 37];
const DEFAULT_SEARCH_INPUT = [5, 12, 23, 31, 42, 48, 55, 61, 68, 76, 84, 95];

export const algorithms: AlgorithmMeta[] = [
  {
    id: 'bubble',
    name: '冒泡排序',
    enName: 'Bubble Sort',
    category: '排序',
    tagline: '相邻元素两两比较，大的往后「冒」',
    description:
      '每一轮遍历未排序区间，把相邻逆序对交换，使本轮最大值沉到末尾。加入「本轮无交换即提前退出」的优化后，对已有序数组可降到 O(n)。稳定排序。',
    complexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)', space: 'O(1)' },
    stable: true,
    code: bubbleSortCode,
    run: bubbleSort,
    defaultInput: DEFAULT_SORT_INPUT,
    defaultTarget: 48,
    accent: '#6366f1',
  },
  {
    id: 'selection',
    name: '选择排序',
    enName: 'Selection Sort',
    category: '排序',
    tagline: '每轮挑出最小值，放到已排序区末尾',
    description:
      '把数组分成已排序前缀和未排序后缀，每轮扫描后缀找出最小值并与前缀后一位交换。比较次数固定为 n(n-1)/2，但写入次数只有 O(n)，是写入成本敏感场景的经典选择。',
    complexity: { best: 'O(n²)', average: 'O(n²)', worst: 'O(n²)', space: 'O(1)' },
    stable: false,
    code: selectionSortCode,
    run: selectionSort,
    defaultInput: DEFAULT_SORT_INPUT,
    defaultTarget: 48,
    accent: '#0ea5e9',
  },
  {
    id: 'insertion',
    name: '插入排序',
    enName: 'Insertion Sort',
    category: '排序',
    tagline: '像理扑克牌一样，把新牌插进有序前缀',
    description:
      '保持左侧前缀始终有序，取出下一个元素向左逐个比较并右移，找到位置后插入。对近似有序的数据非常高效，也是很多混合排序算法在小规模子数组上的收尾方案。',
    complexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)', space: 'O(1)' },
    stable: true,
    code: insertionSortCode,
    run: insertionSort,
    defaultInput: DEFAULT_SORT_INPUT,
    defaultTarget: 48,
    accent: '#14b8a6',
  },
  {
    id: 'quick',
    name: '快速排序',
    enName: 'Quick Sort',
    category: '排序',
    tagline: '选基准、做划分，再递归处理左右两半',
    description:
      '这里使用 Lomuto 划分：取区间末元素为基准，用指针 i 维护「小于基准」的边界，遍历结束时把基准换到 i，随后递归左右子区间。平均 O(n log n)，但基准选取不当会退化到 O(n²)。',
    complexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n²)', space: 'O(log n)' },
    stable: false,
    code: quickSortCode,
    run: quickSort,
    defaultInput: DEFAULT_SORT_INPUT,
    defaultTarget: 48,
    accent: '#f59e0b',
  },
  {
    id: 'merge',
    name: '归并排序',
    enName: 'Merge Sort',
    category: '排序',
    tagline: '先拆到最小，再两两有序合并',
    description:
      '典型的分治：递归把区间一分为二，再把两个有序子区间线性合并回原数组。时间复杂度稳定为 O(n log n)，且是稳定排序，代价是 O(n) 的额外空间。',
    complexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)', space: 'O(n)' },
    stable: true,
    code: mergeSortCode,
    run: mergeSort,
    defaultInput: DEFAULT_SORT_INPUT,
    defaultTarget: 48,
    accent: '#a855f7',
  },
  {
    id: 'binary',
    name: '二分查找',
    enName: 'Binary Search',
    category: '查找',
    tagline: '每次取中点，一次砍掉一半搜索区间',
    description:
      '前提是数组有序。每次把中点与目标比较：相等则命中，小于目标就丢弃左半，大于目标就丢弃右半。区间每次减半，因此 O(log n) 次比较即可得出结论。',
    complexity: { best: 'O(1)', average: 'O(log n)', worst: 'O(log n)', space: 'O(1)' },
    stable: false,
    code: binarySearchCode,
    run: binarySearch,
    defaultInput: DEFAULT_SEARCH_INPUT,
    defaultTarget: 61,
    accent: '#ec4899',
  },
];

export const categories = ['排序', '查找'] as const;

export function getAlgorithm(id: string): AlgorithmMeta {
  return algorithms.find((item) => item.id === id) ?? algorithms[0];
}
