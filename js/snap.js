export function cells(values, extra = {}) {
  return { view: "cells", values: values.map((value) => String(value)), ...extra };
}

export function matrix(rows, extra = {}) {
  return {
    view: "matrix",
    rows: rows.map((row) => row.map((value) => String(value))),
    ...extra,
  };
}

export function lanes(rows, extra = {}) {
  return { view: "lanes", rows, ...extra };
}

export function chain(nodes, extra = {}) {
  return { view: "chain", nodes, ...extra };
}

export function tree(spec, extra = {}) {
  return { view: "tree", ...spec, ...extra };
}

export function dp(spec, extra = {}) {
  return { view: "dp", ...spec, ...extra };
}

export function lesson(spec) {
  return spec;
}

export function binaryTree(labels, tones = {}) {
  const nodes = [];
  const edges = [];
  function walk(index, depth, left, right) {
    if (index >= labels.length || labels[index] == null) return;
    const x = (left + right) / 2;
    const y = 14 + depth * 30;
    nodes.push({
      id: String(index),
      label: String(labels[index]),
      x,
      y,
      tone: tones[index] || "",
    });
    if (labels[index * 2] != null) {
      edges.push([String(index), String(index * 2)]);
      walk(index * 2, depth + 1, left, x);
    }
    if (labels[index * 2 + 1] != null) {
      edges.push([String(index), String(index * 2 + 1)]);
      walk(index * 2 + 1, depth + 1, x, right);
    }
  }
  walk(1, 0, 8, 92);
  return { nodes, edges };
}
