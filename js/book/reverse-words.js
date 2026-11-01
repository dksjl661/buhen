import { cells, lesson } from "../snap.js";

export default lesson({
  id: "reverse-words",
  chapter: "字符串",
  title: "翻转单词",
  solved: "blue is sky the",
  thesis: "单词内部的字母顺序不动，动的是单词这个整体。先按空格拆开，丢掉多余空格，再把单词数组反转，最后用一个空格接回去。",
  complexity: "时间 O(n)，空间 O(n)。",
  build() {
    const words = "the sky is blue".split(/\s+/).filter(Boolean);
    const frames = [];
    frames.push(cells(words, { title: "先拆成单词", note: "空格只是分隔符。翻转的是单词的次序，不是每个单词里的字母。", on: [0, 1, 2, 3] }));
    let left = 0;
    let right = words.length - 1;
    while (left < right) {
      [words[left], words[right]] = [words[right], words[left]];
      frames.push(
        cells(words, {
          title: `交换两端的单词`,
          note: `现在是 ${words.join(" ")}。`,
          on: [left, right],
        }),
      );
      left += 1;
      right -= 1;
    }
    frames.push(cells(words, { title: "blue is sky the", note: "单词数组反转完，再用单个空格接起来。多余的空格不会回来。", on: [0, 1, 2, 3] }));
    return frames;
  },
});
