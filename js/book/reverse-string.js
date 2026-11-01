import { cells, lesson } from "../snap.js";

export default lesson({
  id: "reverse-string",
  chapter: "字符串",
  title: "反转字符串",
  solved: "o,l,l,e,h",
  thesis: "左指针和右指针交换，然后一起往中间靠。它们相遇时，每个字符都换到了对称的位置，正好一遍。",
  complexity: "时间 O(n)，空间 O(1)。",
  build() {
    const arr = ["h", "e", "l", "l", "o"];
    const frames = [];
    let left = 0;
    let right = arr.length - 1;
    const snap = (title, note) => {
      frames.push(cells(arr, { title, note, on: [left, right], tags: { [left]: "左", [right]: "右" } }));
    };
    snap("hello", "原地反转，不另开一条字符串。");
    while (left < right) {
      [arr[left], arr[right]] = [arr[right], arr[left]];
      snap(`交换 ${arr[right]} 和 ${arr[left]}`, "交换之后，这两个位置就再也不用动了。");
      left += 1;
      right -= 1;
    }
    frames.push(cells(arr, { title: "o,l,l,e,h", note: "左右相遇。olleh 就是 hello 的反转。", on: [2] }));
    return frames;
  },
});
