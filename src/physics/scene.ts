import { RenderState } from "../render/render";
import { Entity } from "./entities";

export class SimpleScene {
  entities: Entity[];

  /**
   * Run physics logic
   */
  public update() {
    // Do all the stuff
  }

  public extractStates(states: RenderState[]) {

    this.entities.forEach((e, i) => {
      if (e.stateNeedsUpdate()) {
        states[i] = e.extractRenderState();
      }
    })

    return states;
  }

  public addEntity(entity: Entity) {
    this.entities.push(entity);
  }

}