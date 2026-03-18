import { RenderState } from "../render/render";
import { SpriteRenderState } from "../render/spriteRender";
import { Vec } from "./physics";

export interface Entity {
  getMass(): number;
  getPos(): Vec;
  getVelocity(): Vec;
  extractRenderState(): RenderState;
  stateNeedsUpdate(): boolean;
}

export class SpriteEntity implements Entity {
  spriteId: number;
  mass: number;
  pos: Vec;
  velocity: Vec;
  hasChanged: boolean;

  constructor(spriteId: number, mass: number, pos: Vec, velocity: Vec) {
    this.spriteId = spriteId;
    this.mass = mass;
    this.pos = pos;
    this.velocity = velocity;
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