function snapshot(items, sorted, focus, action, title, note) {
  return {
    items: items.map((item) => ({ ...item })),
    sorted: sorted.slice(),
    focus,
    action,
    title,
    note,
  };
}

export function binarySearchFrames(arr, target) {
  const frames = [];
  let lo = 0;
  let hi = arr.length - 1;

  frames.push({
    lo,
    hi,
    mid: null,
    found: false,
    missing: false,
    title: "先圈出整段",
    note: `数组从小到大排好了。${target} 如果在里面，一定在下标 ${lo} 到 ${hi} 之间。`,
  });

  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    const value = arr[mid];
    frames.push({
      lo,
      hi,
      mid,
      found: false,
      missing: false,
      title: `只看中点 ${value}`,
      note: `中点下标是 ⌊(${lo} + ${hi}) / 2⌋ = ${mid}。问这一个数，就够决定扔掉哪一半。`,
    });

    if (value === target) {
      frames.push({
        lo,
        hi,
        mid,
        found: true,
        missing: false,
        title: "找到了",
        note: `${target} 在下标 ${mid}。因为有序，旁边不用再核对。`,
      });
      return frames;
    }

    if (value < target) {
      lo = mid + 1;
      frames.push({
        lo,
        hi,
        mid,
        found: false,
        missing: false,
        title: "丢掉左半",
        note: `${value} 比 ${target} 小。中点和它左边只会更小，整段扔掉。新的左边界是 ${lo}。`,
      });
    } else {
      hi = mid - 1;
      frames.push({
        lo,
        hi,
        mid,
        found: false,
        missing: false,
        title: "丢掉右半",
        note: `${value} 比 ${target} 大。中点和它右边只会更大，整段扔掉。新的右边界是 ${hi}。`,
      });
    }
  }

  frames.push({
    lo,
    hi,
    mid: null,
    found: false,
    missing: true,
    title: "区间空了",
    note: `左边界越过了右边界。不是没找完，是可能的位置已经没有了。${target} 不在这个数组里。`,
  });
  return frames;
}

export function bubbleFrames(values) {
  const items = values.map((value, id) => ({ id, value }));
  const sorted = Array(items.length).fill(false);
  const frames = [];
  const n = items.length;
  const snap = (title, note, focus, action) => {
    frames.push(snapshot(items, sorted, focus, action, title, note));
  };

  snap(
    "只和邻居比",
    "冒泡排序每一轮从左往右看相邻的两个。左边更大就交换。一轮结束，剩下的数里最大的会停在最右边。",
    [],
    "intro",
  );

  for (let i = 0; i < n - 1; i += 1) {
    let swapped = false;
    for (let j = 0; j < n - 1 - i; j += 1) {
      const left = items[j].value;
      const right = items[j + 1].value;
      if (left > right) {
        snap(
          `${left} 比 ${right} 大`,
          "相邻，而且左边更大。下一手交换。",
          [j, j + 1],
          "compare",
        );
        [items[j], items[j + 1]] = [items[j + 1], items[j]];
        swapped = true;
        snap(
          "交换这两个邻居",
          `${left} 往右走一格，${right} 往左走一格。大的继续往右冒。`,
          [j, j + 1],
          "swap",
        );
      } else {
        snap(
          `${left} 和 ${right} 顺序对`,
          "相邻而且左边不大，就不动。冒泡只在必要时交换。",
          [j, j + 1],
          "compare",
        );
      }
    }
    sorted[n - 1 - i] = true;
    snap(
      `${items[n - 1 - i].value} 落到了右边`,
      `下标 ${n - 1 - i} 固定了。后面的轮次不再碰它。`,
      [],
      "mark",
    );
    if (!swapped) {
      sorted.fill(true);
      snap(
        "这一轮没有交换",
        "相邻的数都已经按顺序排着。再比下去也不会动，所以提前停。",
        [],
        "done",
      );
      return frames;
    }
  }

  sorted[0] = true;
  snap(
    "整排都固定了",
    "最坏的时候每一对邻居都要交换。数据越乱，冒泡走得越久。",
    [],
    "done",
  );
  return frames;
}

export function selectionFrames(values) {
  const items = values.map((value, id) => ({ id, value }));
  const n = items.length;
  const sorted = Array(n).fill(false);
  const frames = [];
  const snap = (title, note, focus, action) => {
    frames.push(snapshot(items, sorted, focus, action, title, note));
  };

  snap(
    "每一轮只换一次",
    "在还没排好的一段里找出最小的，把它换到这段开头。开头从此固定。",
    [],
    "intro",
  );

  for (let i = 0; i < n - 1; i += 1) {
    let min = i;
    snap(
      `先假定 ${items[i].value} 最小`,
      `第 ${i + 1} 轮从下标 ${i} 开始。后面碰到更小的，就改记那个位置。`,
      [i],
      "pick",
    );
    for (let j = i + 1; j < n; j += 1) {
      const better = items[j].value < items[min].value;
      snap(
        `拿 ${items[j].value} 来比`,
        better
          ? `${items[j].value} 比记下的 ${items[min].value} 更小，改记它。`
          : `${items[j].value} 没有更小，记下的仍是 ${items[min].value}。`,
        [min, j],
        "compare",
      );
      if (better) min = j;
    }
    sorted[i] = true;
    if (min !== i) {
      const small = items[min].value;
      [items[i], items[min]] = [items[min], items[i]];
      snap(
        `把 ${small} 换到下标 ${i}`,
        "这一轮扫描可以很多次，交换只有这一次。",
        [i, min],
        "swap",
      );
    }
    snap(
      `下标 ${i} 固定了`,
      `${items[i].value} 已经是剩下的数里最小的，之后不再移动。`,
      [],
      "mark",
    );
  }

  sorted[n - 1] = true;
  snap(
    "最后一个不用挑了",
    "前面都固定之后，剩下的那个就是最大的。选择排序交换少，但每一轮仍要把剩下的数看完。",
    [],
    "done",
  );
  return frames;
}

export function insertionFrames(values) {
  const items = values.map((value, id) => ({ id, value }));
  const sorted = Array(items.length).fill(false);
  sorted[0] = true;
  const frames = [];
  const snap = (title, note, focus, action) => {
    frames.push(snapshot(items, sorted, focus, action, title, note));
  };

  snap(
    "先承认第一个数有序",
    "插入排序的不变量：左边这一段永远有序。新来的数只在这段里找自己的位置，插完，段长加一。",
    [],
    "intro",
  );

  for (let i = 1; i < items.length; i += 1) {
    snap(
      `取出 ${items[i].value}`,
      `左边 ${i} 个数已经排好。它要从右往左滑，直到左边不再比它大。`,
      [i],
      "pick",
    );
    let j = i;
    while (j > 0 && items[j - 1].value > items[j].value) {
      const moving = items[j].value;
      const blocker = items[j - 1].value;
      snap(
        `${moving} 比 ${blocker} 小`,
        "左边更大，就让它往右挪一格，空位跟着往左。",
        [j - 1, j],
        "compare",
      );
      [items[j - 1], items[j]] = [items[j], items[j - 1]];
      j -= 1;
      snap(
        "空位往左移",
        "这一下是在腾位置，不是随便交换。",
        [j, j + 1],
        "swap",
      );
    }
    for (let k = 0; k <= i; k += 1) sorted[k] = true;
    snap(
      `${items[j].value} 落定`,
      `它停在下标 ${j}。前 ${i + 1} 个数重新有序，不变量还在。`,
      [],
      "mark",
    );
  }

  snap(
    "前缀长成了整排",
    "每个新数最多滑过已经有序的前缀。数据越接近有序，滑动越少。三种里面，插入排序最喜欢差不多排好的数据。",
    [],
    "done",
  );
  return frames;
}

const ADJACENCY = {
  A: ["B", "C"],
  B: ["A", "D", "E"],
  C: ["A", "E", "F"],
  D: ["B"],
  E: ["B", "C", "G"],
  F: ["C"],
  G: ["E"],
};

function classifyNeighbors(current, visited, container) {
  const fresh = [];
  const seen = [];
  const waiting = [];
  ADJACENCY[current].forEach((name) => {
    if (visited.includes(name)) seen.push(name);
    else if (container.includes(name)) waiting.push(name);
    else fresh.push(name);
  });
  return { fresh, seen, waiting };
}

function neighborSentence(groups, structure) {
  const place = structure === "queue" ? "队尾" : "栈里";
  const box = structure === "queue" ? "队列" : "栈";
  const parts = [];
  if (groups.fresh.length) {
    parts.push(`${groups.fresh.join("、")} 是新的，放进${place}。`);
  }
  if (groups.waiting.length) {
    parts.push(`${groups.waiting.join("、")} 已经在${box}里，不重复放。`);
  }
  if (groups.seen.length) {
    parts.push(`${groups.seen.join("、")} 走过了，跳过。`);
  }
  if (!parts.length) parts.push("没有邻居。");
  return parts.join("");
}

export function bfsFrames() {
  const frames = [];
  const visited = [];
  const queue = ["A"];

  frames.push({
    current: null,
    visited: [],
    frontier: ["A"],
    structure: "queue",
    title: "起点进队列",
    note: "广度优先用队列。左边先出去。现在队列里只有 A，所以先从 A 走。",
  });

  while (queue.length) {
    const current = queue.shift();
    visited.push(current);
    const groups = classifyNeighbors(current, visited, queue);
    groups.fresh.forEach((name) => queue.push(name));
    const next = queue[0];
    const follow = next ? `接下来先走左边的 ${next}。` : "队列空了。";
    frames.push({
      current,
      visited: visited.slice(),
      frontier: queue.slice(),
      structure: "queue",
      title: `走到 ${current}`,
      note: `${neighborSentence(groups, "queue")}${follow}`,
    });
  }

  frames.push({
    current: null,
    visited: visited.slice(),
    frontier: [],
    structure: "queue",
    title: "近的先走完",
    note: `顺序是 ${visited.join(" → ")}。队列会把同一层走完，再往更远的一层去。`,
  });
  return frames;
}

export function dfsFrames() {
  const frames = [];
  const visited = [];
  const stack = ["A"];

  frames.push({
    current: null,
    visited: [],
    frontier: ["A"],
    structure: "stack",
    title: "起点进栈",
    note: "深度优先用栈。右边是栈顶，后放进去的先走。现在栈里只有 A。",
  });

  while (stack.length) {
    const current = stack.pop();
    visited.push(current);
    const groups = classifyNeighbors(current, visited, stack);
    for (let i = groups.fresh.length - 1; i >= 0; i -= 1) {
      stack.push(groups.fresh[i]);
    }
    const top = stack[stack.length - 1];
    const follow = top ? `栈顶在右边，下一步去 ${top}。` : "栈空了。";
    frames.push({
      current,
      visited: visited.slice(),
      frontier: stack.slice(),
      structure: "stack",
      title: `走到 ${current}`,
      note: `${neighborSentence(groups, "stack")}${follow}`,
    });
  }

  frames.push({
    current: null,
    visited: visited.slice(),
    frontier: [],
    structure: "stack",
    title: "一条路走到头",
    note: `顺序是 ${visited.join(" → ")}。栈会沿一条路走到底，走不动再退回来看岔路。`,
  });
  return frames;
}
