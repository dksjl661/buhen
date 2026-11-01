import { chain, lesson } from "../snap.js";

export default lesson({
  id: "cycle-list",
  chapter: "链表",
  title: "环形链表",
  solved: "有环",
  thesis: "慢指针每次走一步，快指针每次走两步。有环的话，快的一定会从后面追上慢的。没有环，快指针会先走到空。",
  complexity: "时间 O(n)，空间 O(1)。不用把走过的结点存进集合。",
  build() {
    const labels = ["1", "2", "3", "4"];
    const nextOf = [1, 2, 3, 1];
    const frames = [];
    let slow = 0;
    let fast = 0;
    const draw = (title, note) => {
      frames.push(
        chain(
          labels.map((label, index) => ({
            label,
            tag: index === slow && index === fast ? "慢 快" : index === slow ? "慢" : index === fast ? "快" : "",
            tone: index === slow || index === fast ? "on" : "",
            points: labels[nextOf[index]],
          })),
          { title, note },
        ),
      );
    };
    draw("4 指回 2", "起步时两个指针都在 1。快的走得猛，如果有环，它绕回来会撞上慢的。");
    let guard = 0;
    do {
      slow = nextOf[slow];
      fast = nextOf[nextOf[fast]];
      guard += 1;
      draw(
        slow === fast ? "有环" : `慢在 ${labels[slow]}，快在 ${labels[fast]}`,
        slow === fast ? "快的从后面追上了慢的。没有环的话，快指针会先走到空，不可能相遇。" : "还没相遇。慢走一步，快走两步。",
      );
    } while (slow !== fast && guard < 8);
    return frames;
  },
});
