import { GLContext } from "./render";

export type Buffers = {
  [key: string]: WebGLBuffer;
};

export function createBuffers({ gl }: GLContext) {
  const buffers: Buffers = {
    position: createPosBuffer(gl)
  }

  return buffers;
}

export function createPosBuffer(gl: WebGL2RenderingContext) {
  const positionBuf = gl.createBuffer();

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuf);

  const positions = [1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0];

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  return positionBuf;
}
