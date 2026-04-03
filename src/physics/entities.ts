import { mat4, quat, vec3 } from "gl-matrix";
import { SpriteRenderState } from "../render/spriteRender";

export interface Entity {
  getMass(): number;
  getPos(): vec3;
  getScale(): vec3;
  getRotation(): quat;
  makeTransform(): mat4;
  setPos(pos: vec3): void;
  getVelocity(): vec3;
  applyForce(force: vec3): void;
}

export class SimpleEntity implements Entity {
  mass: number;
  pos: vec3;
  scale: vec3;
  rotation: quat;
  transform: mat4 = mat4.create();
  velocity = vec3.create();

  constructor(mass: number, pos: vec3, scale: vec3 = [1, 1, 1], rotation: quat = quat.create() ) {
    this.mass = mass;
    this.pos = pos;
    this.scale = scale;
    this.rotation = rotation;
  }
  getScale(): vec3 {
    return this.scale;
  }
  getRotation(): quat {
    return this.rotation;
  }
  makeTransform(): mat4 {
    return mat4.fromRotationTranslationScale(this.transform, this.getRotation(), this.getPos(), this.getScale())
  }
  getMass(): number {
    return this.mass;
  }
  getPos(): vec3 {
    return this.pos;
  }
  setPos(pos: vec3): void {
    this.pos = pos
  }
  getVelocity(): vec3 {
    return this.velocity;
  }
  applyForce(force: vec3) {
    const acceleration = vec3.create();
    vec3.scale(acceleration, force, 1 / this.mass);
    vec3.add(this.velocity, this.velocity, acceleration);
  }
}

export class SpriteEntity extends SimpleEntity {
  spriteId: number;
  hasChanged: boolean;

  constructor(spriteId: number, mass: number, pos: vec3) {
    super(mass, pos);
    this.spriteId = spriteId;
    this.hasChanged = true;
  }

  getMass(): number {
    return this.mass;
  }
  getPos(): vec3 {
    return this.pos;
  }
  getVelocity(): vec3 {
    return this.velocity;
  }
  getSpriteId() {
    return this.spriteId;
  }
  stateNeedsUpdate(): boolean {
    return this.hasChanged;
  }
  extractRenderState(): SpriteRenderState {
    return {
      type: "sprite",
      sprite: this.spriteId,
      position: this.getPos(),
    }
  }
  
}