#version 300 es

const int MAX_TRANSFORMS = 100;

in vec4 aVertexPosition;
in vec4 aVertexColour;

out vec4 colour;

uniform mat4 transforms[MAX_TRANSFORMS];
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
void main() {
  int idx = gl_InstanceID;
  gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition * transforms[idx];
  colour = aVertexColour;
}