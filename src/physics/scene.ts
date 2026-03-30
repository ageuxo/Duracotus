import { vec3 } from "gl-matrix";
import { createNGon, createTriangle } from "../render/shapes";
import { Entity } from "./entities";
import { applyGravity } from "./physics";
import { forEachPair } from "../main";

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

  public extractVertices() {
    const vertices: number[] = [];

    function pushVert([ x, y, z ]: vec3) {
      vertices.push(x);
      vertices.push(y);
      vertices.push(z);
    }

    function pushVerts(verts: vec3[]) {
      verts.forEach(e => {
        pushVert(e);
      })
    }

    this.entities.forEach((e) => {
      const verts = createNGon(e.getPos(), 9, e.getMass());
      verts.forEach(v => vertices.push(v));
    })

    return vertices;
  }

  public addEntity(entity: Entity) {
    this.entities.push(entity);
  }

}