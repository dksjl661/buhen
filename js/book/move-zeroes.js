import { cells, lesson } from "../snap.js";

export default lesson({
  id: "move-zeroes",
  chapter: "双指针",
  title: "移动零",
  solved: "1,3,12,0,0",
  thesis: "和非零的数交换，零才会被挤到后面，而且非零数的相对顺序不变。慢指针指向下一个非零数该落的位置。",
  complexity: "时间 O(n)，空间 O(1)。",
  build() {
    const arr = [0, 1, 0, 3, 12];
    const frames = [];
    let slow = 0;
    const snap = (fast, title, note) => {
      frames.push(cells(arr, { title, note, on: [slow, fast].filter((index) => index < arr.length), tags: { [slow]: "慢", [fast]: "快" } }));
    };
    snap(0, "非零的往前挤", "快指针看到非零，就和慢指针交换，然后慢指针才前进。");
    for (let fast = 0; fast < arr.length; fast += 1) {
      if (arr[fast] !== 0) {
        [arr[slow], arr[fast]] = [arr[fast], arr[slow]];
        snap(fast, `把 ${arr[slow]} 换到下标 ${slow}`, "交换之后，慢指针左边全是已经就位的非零数。");
        slow += 1;
      } else {
        snap(fast, "这是 0，跳过", "慢指针不动，等下一个非零数来占这个坑。");
      }
    }
    frames.push(cells(arr, { title: "1,3,12,0,0", note: "非零数的顺序还是 1、3、12。零全被换到了右边。", on: [0, 1, 2], off: [3, 4] }));
    return frames;
  },
});
