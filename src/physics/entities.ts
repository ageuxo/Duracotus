import { RenderState } from "../render/render";
import { SpriteRenderer, SpriteRenderState } from "../render/spriteRender";
import { Vec } from "./physics";

export interface Entity {
  getMass(): number;
  getPos(): Vec;
  getVelocity(): Vec;
  extractRenderState(): RenderState;
  stateNeedsUpdate(): boolean;
}

export class SpriteEntity implements Entity {
  sprite: number;
  mass: number;
  pos: Vec;
  velocity: Vec;
  hasChanged: boolean;

  constructor(mass: number, pos: Vec, velocity: Vec) {
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
    return this.sprite;
  }
  stateNeedsUpdate(): boolean {
    return this.hasChanged;
  }
  extractRenderState(): SpriteRenderState {
    return {
      type: "sprite",
      sprite: this.sprite,
      position: this.getPos(),
    }
  }
  
}