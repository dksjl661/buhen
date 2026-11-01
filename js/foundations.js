import {
  bfsFrames,
  binarySearchFrames,
  bubbleFrames,
  dfsFrames,
  insertionFrames,
  selectionFrames,
} from "./algo.js";

export const BINARY_ARRAY = [3, 7, 12, 18, 21, 27, 33, 42, 48, 55, 61, 70, 76, 84, 91];
export const BINARY_TARGETS = [42, 7, 91, 27, 50];

export const SORT_PRESETS = {
  mixed: [72, 18, 90, 34, 12, 63, 45, 27],
  nearly: [12, 18, 34, 27, 45, 63, 72, 90],
  reverse: [90, 72, 63, 45, 34, 27, 18, 12],
};

const SORT_ALGOS = {
  bubble: bubbleFrames,
  selection: selectionFrames,
  insertion: insertionFrames,
};

export const foundations = [
  {
    id: "binary",
    view: "binary",
    chapter: "入门",
    title: "二分查找",
    thesis:
      "只在有序的数据里成立。每次只问正中间那一个数，然后把不可能的一半扔掉。比较次数大约是 log₂n。",
    complexity: "时间 O(log n)，空间 O(1)。",
    build(state) {
      return binarySearchFrames(BINARY_ARRAY, state.target);
    },
  },
  {
    id: "sort",
    view: "sort",
    chapter: "入门",
    title: "三种入门排序",
    thesis:
      "同一排数，三种手法。冒泡动的是邻居，选择每一轮只交换一次，插入守着一段始终有序的前缀。这三种都是 O(n²)，先看不变量。",
    complexity: "时间 O(n²)，空间 O(1)。",
    build(state) {
      return SORT_ALGOS[state.sortAlgo](state.sortData);
    },
  },
  {
    id: "graph",
    view: "graph",
    chapter: "入门",
    title: "广度与深度",
    thesis:
      "图没有从左到右。队列让近的先走完，栈让一条路先走到底。点和边没变，变的是谁先被看见。",
    complexity: "时间跟着点和边的数量走。",
    build(state) {
      return state.graphMode === "bfs" ? bfsFrames() : dfsFrames();
    },
  },
];
