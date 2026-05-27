import { vec2, vec3 } from "gl-matrix"

interface Mesh {
  vertices: vec3[]
  texCoords: vec2[]
  indices: number[]
}

export const quad: Mesh = {
  vertices: [
    [ 1,  1, 0],
    [ 1, -1, 0],
    [-1, -1, 0],
    [-1,  1, 0]
  ],
  texCoords: [
    [1, 1],
    [1, 0],
    [0, 0],
    [0, 1]
  ],
  indices: [
    0, 1, 3,
    1, 2, 3,
    0, 3, 1,
    1, 3, 2
  ]
}

