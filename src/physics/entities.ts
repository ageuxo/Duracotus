import { SpriteRenderState } from "../render/spriteRender";
import { Vec } from "./physics";

export interface Entity {
  getMass(): number;
  getPos(): Vec;
  getVelocity(): Vec;
}

export class SimpleEntity implements Entity {
  mass: number;
  pos: Vec;
  velocity: Vec;

  constructor(mass: number, pos: Vec, velocity: Vec) {
    this.mass = mass;
    this.pos = pos;
    this.velocity = velocity;
  }

  getMass(): number {
    return this.mass;
  }
  getPos(): Vec {
    return this.pos;
  }
  getVelocity(): Vec {
    return this.velocity;
  }
}

export class SpriteEntity extends SimpleEntity {
  spriteId: number;
  hasChanged: boolean;

  constructor(spriteId: number, mass: number, pos: Vec, velocity: Vec) {
    super(mass, pos, velocity);
    this.spriteId = spriteId;
    this.hasChanged = true;
  }

  getMass(): number {
    return this.mass;
  }
  getPos(): Vec {
    return this.pos;
  }
  getVelocity(): Vec {
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