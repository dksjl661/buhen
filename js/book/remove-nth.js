import { chain, lesson } from "../snap.js";

export default lesson({
  id: "remove-nth",
  chapter: "链表",
  title: "删除倒数第 N 个结点",
  solved: "1 → 2 → 3 → 5",
  thesis: "先让快指针多走 n 步，快慢再一起走。快指针到头时，慢指针正好停在待删结点的前一个。这样只要一遍，不用先数长度。",
  complexity: "时间 O(n)，空间 O(1)。",
  build() {
    const labels = ["哑", "1", "2", "3", "4", "5"];
    const frames = [];
    const n = 2;
    let fast = 0;
    let slow = 0;
    const draw = (title, note, dead) => {
      frames.push(
        chain(
          labels.map((label, index) => ({
            label,
            tag: index === slow && index === fast ? "慢 快" : index === slow ? "慢" : index === fast ? "快" : "",
            tone: index === dead ? "off" : index === slow || index === fast ? "on" : "",
            points: index === labels.length - 1 ? "空" : labels[index + 1],
          })),
          { title, note },
        ),
      );
    };
    draw("删掉倒数第 2 个，也就是 4", "哑结点在最前面，这样要删的如果是头结点，也有一个前驱可以改。", -1);
    for (let step = 0; step < n; step += 1) {
      fast += 1;
      draw(`快指针先走，现在在 ${labels[fast]}`, "先把快慢拉开 n 步。这里 n 是 2。", -1);
    }
    while (fast < labels.length - 1) {
      fast += 1;
      slow += 1;
      draw(`一起走，慢在 ${labels[slow]}，快在 ${labels[fast]}`, "快指针到尾时，慢指针的下一个就是要删的。", -1);
    }
    const dead = slow + 1;
    draw("1 → 2 → 3 → 5", `让 ${labels[slow]} 跳过 ${labels[dead]}。4 不再有人指向它。`, dead);
    return frames;
  },
});
