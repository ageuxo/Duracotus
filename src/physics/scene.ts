import { vec3 } from "gl-matrix";
import { createNGon, createTriangle } from "../render/shapes";
import { Entity } from "./entities";
import { applyGravity } from "./physics";
import { forEachPair } from "../main";
import { colorFromIndex, colourArray } from "../render/colour";

export class SimpleScene {
  entities: Entity[] = [];
  lastUpdate: number = 0;

  /**
   * Run physics logic
   */
  public update(t: number) {
    
    forEachPair(this.entities, applyGravity);

    this.entities.forEach(e => {
      const old = e.getPos();
      const velocity = e.getVelocity();
      const delta = [ velocity[0] * t, velocity[1] * t, velocity[2] * t ];
      e.setPos([old[0] + delta[0], old[1] + delta[1] , old[2] + delta[2] ])
    })
  }

  public extractRenderData() {
    const vertices: number[] = [];

    const n = 9;
    this.entities.forEach((e) => {
      const verts = createNGon(e.getPos(), n, e.getMass());
      
      verts.forEach(v => vertices.push(v));
    })

    return {
      vertices,
      colours: colourArray(this.entities.length, n)
    };
  }

  public addEntity(entity: Entity) {
    this.entities.push(entity);
  }

}