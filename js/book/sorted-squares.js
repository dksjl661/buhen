import { cells, lesson } from "../snap.js";

export default lesson({
  id: "sorted-squares",
  chapter: "数组",
  title: "有序数组的平方",
  solved: "0,1,9,16,100",
  thesis: "负数平方之后会翻到另一头，所以平方的最大值一定在原数组的两端，不会在中间。两个指针从两端往里夹，把较大的平方填进结果的末尾。",
  complexity: "时间 O(n)，空间 O(n)。",
  build() {
    const arr = [-4, -1, 0, 3, 10];
    const out = Array(arr.length).fill("·");
    const frames = [];
    let left = 0;
    let right = arr.length - 1;
    let write = arr.length - 1;
    const snap = (title, note) => {
      frames.push(
        cells(arr, {
          title,
          note,
          on: [left, right],
          tags: { [left]: "左", [right]: "右" },
          below: out.slice(),
          belowLabel: "平方结果，从右往左填",
          belowOn: out[write] === "·" ? [] : [write],
        }),
      );
    };
    snap("两端的绝对值谁大，谁的平方就更大", "原数组已经有序，平方后的最大值只可能是最左或最右。");
    while (left <= right) {
      const leftSq = arr[left] * arr[left];
      const rightSq = arr[right] * arr[right];
      if (leftSq > rightSq) {
        out[write] = String(leftSq);
        snap(`|${arr[left]}| 更大，${leftSq} 填到结果下标 ${write}`, "填完，左指针往右，写入位置往左。");
        left += 1;
      } else {
        out[write] = String(rightSq);
        snap(`|${arr[right]}| 不比左边小，${rightSq} 填到结果下标 ${write}`, "填完，右指针往左，写入位置往左。");
        right -= 1;
      }
      write -= 1;
    }
    frames.push(
      cells(arr, {
        title: "0,1,9,16,100",
        note: "结果从大到小填完，自然就是升序。没有再排序。",
        below: out,
        belowLabel: "平方结果",
        belowOn: [0, 1, 2, 3, 4],
      }),
    );
    return frames;
  },
});
