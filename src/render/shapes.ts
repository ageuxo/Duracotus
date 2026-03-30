import { vec3 } from "gl-matrix";

export const equilateralTri = [
  -1.0, 1.0, 0.0,
  1.0, 1.0, 0.0,
  0.0, -1.0, 0.0
];

export const tri = [
  -1.0, -1.0, 0.0,
  -1.0, 1.0, 0.0,
  1.0, 1.0, 0.0
];

export function createTriangle([ x, y, z ]: vec3) {
  const vertices: number[] = [];

  function pushVert(x: number, y: number, z: number) {
    vertices.push(x);
    vertices.push(y);
    vertices.push(z);
  }

  pushVert(x - 1, y - 1, z);
  pushVert(x - 1, y + 1, z);
  pushVert(x + 1, y + 1, z);

  return vertices;
}

export function createNGon([ x, y, z ]: vec3, n: number, radius: number) {
  const points: vec3[] = [];

  for (let i = 0; i < n; i++) {
    const point: vec3 = [
      (x + radius * Math.cos(i * 2 * Math.PI / n)),
      (y + radius * Math.sin(i * 2 * Math.PI / n)),
      z
    ];
    points.push(point);
  }

  const vertices: number[] = [];

  function pushVert([ x, y, z ]: vec3) {
    vertices.push(x);
    vertices.push(y);
    vertices.push(z);
  }

  function fromIdx(idx: number) {
    if (idx < 0) {
      idx = idx + points.length;
    }
    return points[idx];
  }

  // Make a triangle fan from the center of the circle
  for (let idx = 0; idx < points.length; idx++) {
    const v0: vec3 = fromIdx(idx - 1);
    const v1: vec3 = [x, y, z];
    const v2: vec3 = fromIdx(idx);

    pushVert(v0);
    pushVert(v1);
    pushVert(v2);
  }

  return vertices;
}