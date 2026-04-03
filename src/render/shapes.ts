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

export function createNGon(n: number, radius: number) {
  const vertices: vec3[] = [];
  const indices: number[] = [];

  // make origin
  vertices.push([0, 0, 0]);
  for (let i = 0; i < n; i++) {
    const point: vec3 = [
      (radius * Math.cos(i * 2 * Math.PI / n)),
      (radius * Math.sin(i * 2 * Math.PI / n)),
      0
    ];
    vertices.push(point);
  }

  // Make a triangle fan from the center of the circle
  for (let idx = 1; idx < vertices.length; idx++) {
    const v0 = idx;
    const v1 = 0;
    const v2 = idx + 1;

    indices.push(v0, v1, v2);
  }

  return { vertices, indices };
}