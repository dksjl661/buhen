import { cells, lesson } from "../snap.js";

export default lesson({
  id: "remove-element",
  chapter: "数组",
  title: "移除元素",
  solved: "长度 2",
  thesis: "不必真的把洞补齐后再挪后面所有人。快指针负责看，慢指针只接收要留下的值。慢指针走了多远，新长度就是多少。",
  complexity: "时间 O(n)，空间 O(1)。",
  build() {
    const arr = [3, 2, 2, 3];
    const val = 3;
    const frames = [];
    let slow = 0;
    frames.push(
      cells(arr, {
        title: "要删掉所有 3",
        note: "快指针从左扫到右。遇到不该删的，就写到慢指针上，慢指针再前进。",
        tags: { 0: "慢" },
      }),
    );
    for (let fast = 0; fast < arr.length; fast += 1) {
      if (arr[fast] === val) {
        frames.push(
          cells(arr, {
            title: `下标 ${fast} 是 3，丢掉`,
            note: "慢指针不动。这个位置最终会被后面留下的数盖住，或者留在新长度外面。",
            on: [fast],
            tags: { [slow]: "慢", [fast]: "快" },
          }),
        );
      } else {
        arr[slow] = arr[fast];
        frames.push(
          cells(arr, {
            title: `把 ${arr[fast]} 写到下标 ${slow}`,
            note: "要留下的数按顺序挤到前面。顺序还在，只是 3 不再占坑。",
            on: [slow, fast],
            tags: { [slow]: "慢", [fast]: "快" },
          }),
        );
        slow += 1;
      }
    }
    frames.push(
      cells(arr, {
        title: "长度 2",
        note: "前两个数是 2、2。后面剩下的格子不计入新长度。",
        on: [0, 1],
        off: [2, 3],
        tags: { 0: "留", 1: "留" },
      }),
    );
    return frames;
  },
});
