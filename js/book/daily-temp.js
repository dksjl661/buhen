import { cells, lesson } from "../snap.js";

export default lesson({
  id: "daily-temp",
  chapter: "单调栈",
  title: "每日温度",
  solved: "1,1,4,2,1,1,0,0",
  thesis: "问的是还要等几天才会更暖和。栈里存下标，温度从栈底到栈顶递减。出现一个更暖和的日子，就把栈里比它冷的那些天一次结算，距离就是下标差。",
  complexity: "时间 O(n)，每个日子进出栈一次。",
  build() {
    const temps = [73, 74, 75, 71, 69, 72, 76, 73];
    const wait = Array(temps.length).fill(0);
    const stack = [];
    const frames = [];
    temps.forEach((temp, index) => {
      while (stack.length && temps[stack.at(-1)] < temp) {
        const prev = stack.pop();
        wait[prev] = index - prev;
        frames.push(
          cells(temps, {
            title: `${temps[prev]} 等到了 ${temp}`,
            note: `下标差 ${index - prev}，所以要等 ${wait[prev]} 天。`,
            on: [prev, index],
            below: wait.map(String),
            belowLabel: "等待天数",
          }),
        );
      }
      stack.push(index);
    });
    frames.push(
      cells(wait, {
        title: "1,1,4,2,1,1,0,0",
        note: "最后两天右边没有更暖和的，等待是 0。单调栈把“找右边第一个更大的”收成一遍扫描。",
        on: [0, 1, 2, 3, 4, 5],
      }),
    );
    return frames;
  },
});
