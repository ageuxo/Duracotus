import { createTriangle } from "../render/shapes";
import { Entity } from "./entities";
import { Vec } from "./physics";

export class SimpleScene {
  entities: Entity[] = [];

  /**
   * Run physics logic
   */
  public update() {
    // Do all the stuff
  }

  public extractVertices() {
    const vertices: number[] = [];

    function pushVert({ x, y, z }: { x: number, y: number, z: number }) {
      vertices.push(x);
      vertices.push(y);
      vertices.push(z);
    }

    function pushVerts(verts: Vec[]) {
      verts.forEach(e => {
        pushVert(e);
      })
    }

    this.entities.forEach((e) => {
      const verts = createTriangle(e.getPos());
      verts.forEach(v => vertices.push(v));
    })

    return vertices;
  }

  public addEntity(entity: Entity) {
    this.entities.push(entity);
  }

}