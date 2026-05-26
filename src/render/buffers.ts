
export type Buffers = {
  [key: string]: WebGLBuffer;
};

export function uploadFloatBuffer(gl: WebGL2RenderingContext, buf: WebGLBuffer, data: number[]) {
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
}
