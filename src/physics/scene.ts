import { createTriangle } from "../render/shapes";
import { Entity } from "./entities";
import { Vec } from "./physics";

export class SimpleScene {
  entities: Entity[] = [];
  lastUpdate: number = 0;

  /**
   * Run physics logic
   */
  public update(now: number) {
    const t = now;// - this.lastUpdate;

    this.entities.forEach(e => {
      const old = e.getPos();
      const velocity = e.getVelocity();
      const delta = { x: velocity.x * t, y: velocity.y * t, z: velocity.z * t };
      e.setPos({x: old.x + delta.x, y: old.y + delta.y , z: old.z + delta.z })
    })
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