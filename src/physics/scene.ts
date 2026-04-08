import { createNGon } from "../render/shapes";
import { Entity } from "./entities";
import { applyGravity } from "./physics";
import { forEachPair } from "../main";
import { colorFromIndex } from "../render/colour";
import { DrawElement } from "../render/render";

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
    const drawElements: DrawElement[] = [];
    const vertices: number[] = [];
    const indices: number[] = [];
    const colours: number[] = [];

    let idxOffset = 0;
    let byteOffset = 0;

    const n = 9;
    this.entities.forEach((e, i) => {
      const { vertices: verts, indices: inds } = createNGon(n, 1);
      const colour = colorFromIndex(i);
      verts.forEach(v => {
        vertices.push(v[0], v[1], v[2]);
        colours.push(...colour, 1); // rgb + a
      });
      inds.forEach(i => indices.push(i + idxOffset));

      drawElements.push( {
          idxCount: inds.length,
          byteOffset: byteOffset * 2,
          transformIdx: i
        } );

      idxOffset += verts.length;
      byteOffset += inds.length;
    })

    return {
      drawElements,
      vertices,
      indices,
      colours,
    };
  }

  public addEntity(entity: Entity) {
    this.entities.push(entity);
  }

}