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

export function createTriangle({ x, y, z }: { x: number, y: number, z: number }) {
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