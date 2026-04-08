import { Buffers } from "./buffers";

export function createShader(gl: WebGL2RenderingContext, type: GLenum, source: string) {
  const shader = gl.createShader(type);
  if (!shader) {
    throw new Error("Failed constructing shader!");
  }
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);

  if (success) {
    return shader;
  } else {
    const error = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(`Failed compiling shader: ${error}`);
  }
}

export function createProgram(gl: WebGL2RenderingContext, vertShader: WebGLShader, fragShader: WebGLShader) {
  const program = gl.createProgram();

  gl.attachShader(program, vertShader);
  gl.attachShader(program, fragShader);

  gl.linkProgram(program);

  const success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  } else {
    const error = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    throw new Error(`Failed linking program: ${error}`);
  }

}

export interface AttributeInfo {
  location: GLuint,
  buffer: keyof Buffers,
  type: GLenum,
  numComponents: number,
  normalise: boolean,
  stride: number,
  offset: number
}

export type UniformLocations = {
  [key: string]: WebGLUniformLocation
}

export interface ProgramInfo {
  program: WebGLProgram;
  vertexArrayObj: WebGLVertexArrayObject;
  uniformLocations: UniformLocations;
  uniforms: UniformLookup;
  attributes: {
    [key: string]: AttributeInfo;
  }
};

export class UniformLookup {
  program: WebGLProgram;
  uniforms: {
    [key: string]: WebGLUniformLocation
  }

  constructor(gl: WebGL2RenderingContext, program: WebGLProgram, uniforms: string[], uniformArrays: { name: string, count: number }[]) {
    this.program = program;
    this.uniforms = {};

    uniforms.forEach(u => {
      this.bindUniform(gl, u);
    });

    uniformArrays.forEach(u => {
      this.bindUniformArray(gl, u.name, u.count);
    })
  }

  public get(name: string, idx?: number) {
    const key = typeof idx == 'number' ? `${name}[${idx}]` : name;
    const cached = this.uniforms[key];
    if (cached == null) {
        throw new Error(`Attempted looking up unbound uniform '${key}'!`);
    }
    return cached;
  }

  public bindUniform(gl: WebGL2RenderingContext, name: string) {
    const location = gl.getUniformLocation(this.program, name);
    if (location == null) {
        throw new Error(`Attempted binding nonexistent uniform '${name}'!`);
    }
    this.uniforms[name] = location;
  }

  public bindUniformArray(gl: WebGL2RenderingContext, name: string, count: number) {
    for (let i = 0; i < count; i++) {
      const key = `${name}[${i}]`;
      const location = gl.getUniformLocation(this.program, key);
      if (location == null) {
        throw new Error(`Attempted binding nonexistent uniform with index '${i}' in array '${key}'!`);
      }
      this.uniforms[key] = location;
    }
  }
}
