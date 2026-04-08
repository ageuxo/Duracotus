#version 300 es

const int MAX_TRANSFORMS = 100;

in vec4 vertexPosition;
in vec4 vertexColour;

out vec4 colour;

uniform mat4 transforms[MAX_TRANSFORMS];
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
void main() {
  int idx = gl_InstanceID;
  gl_Position = projectionMatrix * viewMatrix * transforms[idx] * vertexPosition;
  colour = vertexColour;
}