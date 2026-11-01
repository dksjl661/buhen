import { cells, lanes, lesson } from "../snap.js";

export default lesson({
  id: "two-sum",
  chapter: "哈希表",
  title: "两数之和",
  solved: "0 和 1",
  thesis: "边扫边问：目标减去当前数，之前见过没有。见过就配对成功。哈希表把“见过的值”变成 O(1) 的查找，所以整趟只要一遍。",
  complexity: "时间 O(n)，空间 O(n)。",
  build() {
    const arr = [2, 7, 11, 15];
    const target = 9;
    const frames = [];
    const seen = [];
    for (let index = 0; index < arr.length; index += 1) {
      const need = target - arr[index];
      const found = seen.find((item) => item.value === need);
      frames.push(
        cells(arr, {
          title: found ? `0 和 1` : `看 ${arr[index]}，需要 ${need}`,
          note: found
            ? `${need} 在下标 ${found.index} 见过。${found.value} + ${arr[index]} = ${target}。`
            : `${need} 还没出现过。先把 ${arr[index]} 记下来，下标是 ${index}。`,
          on: found ? [found.index, index] : [index],
          below: seen.map((item) => item.value).concat(found ? [] : [arr[index]]),
          belowLabel: "哈希表里见过的值",
        }),
      );
      if (found) break;
      seen.push({ value: arr[index], index });
    }
    frames.push(
      lanes([{ name: "答案", items: ["下标 0", "下标 1"], hot: null }], {
        title: "0 和 1",
        note: "2 在表里，7 进来时一减就找到了。后面的 11 和 15 不用再看。",
      }),
    );
    return frames;
  },
});
