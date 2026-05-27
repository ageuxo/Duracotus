#version 300 es

in vec4 vertexPosition;
in vec2 texCoord;

out vec2 vTexCoord;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vertexPosition;
  vTexCoord = texCoord;
}