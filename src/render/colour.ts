import { vec3 } from "gl-matrix";

// simple integer hash -> float in [0,1)
function hashFloat(x: number) {
    let u = x;
    u = (u ^ 61) ^ (u >> 16);
    u *= 9;
    u = u ^ (u >> 4);
    u *= 0x27d4eb2d;
    u = u ^ (u >> 15);
    return u / 4294967295.0;
}

export function colorFromIndex(idx: number) {
    const r = hashFloat(idx * 374761393); // different multipliers to decorrelate
    const g = hashFloat(idx * 668265263 + 1);
    const b = hashFloat(idx * 15485863 + 2);

    // Optional boost/contrast
    const c = [r, g, b];
    vec3.scaleAndAdd(c, [0.15, 0.15, 0.15], c, 0.85);
    
    return c;
}

export let colourCache: number[] = []
let lastEntities = -1;
let lastVertices = -1;

export function colourArray(entities: number, vertices: number) {
  function pushColour(arr: number[], [r, g, b]: vec3, a: number) {
    arr.push(r);
    arr.push(g);
    arr.push(b);
    arr.push(a);
  }

  if (lastEntities === entities && lastVertices === vertices) {
    return colourCache;
  }

  colourCache = [];
  lastEntities = entities;
  lastVertices = vertices;

  for (let i = 0; i < entities; i++) {
    const colour = colorFromIndex(i);

    for (let j = 0; j < vertices * 3; j++) {
      pushColour(colourCache, colour, 1);
    }
    
  }

  return colourCache;
}