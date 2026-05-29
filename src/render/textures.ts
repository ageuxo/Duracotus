import { RenderCtx } from "./render";

interface Texture {
  location: WebGLTexture
  image: HTMLImageElement
}

export function loadTexture(ctx: RenderCtx, url: string): Texture {
  const { gl } = ctx;
  const location = gl.createTexture();

  gl.bindTexture(gl.TEXTURE_2D, location);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

  uploadFallbackTexture(gl);

  const image = new Image();

  // Upload when loaded
  image.onload = () => {
    // Upload texture
    gl.bindTexture(gl.TEXTURE_2D, location);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      image
    )

    // Set filtering and wrapping params of texture
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  }
  image.src = url;

  return {
    location,
    image
  }

}

const missingTexture = createFallbackTexture();

function createFallbackTexture() {
  const magenta = [255, 0, 255, 255];
  const black = [0, 0, 0, 255];

  const pixels: number[] = [];

  // Simple 4x4 grid
  pixels.push(...magenta, ...black, ...magenta, ...black);
  pixels.push(...black, ...magenta, ...black, ...magenta);
  pixels.push(...magenta, ...black, ...magenta, ...black);
  pixels.push(...black, ...magenta, ...black, ...magenta);

  return new Uint8Array(pixels);
}

function uploadFallbackTexture(gl: WebGL2RenderingContext) {
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    4,
    4,
    0,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    missingTexture
  )

  gl.generateMipmap(gl.TEXTURE_2D);
}