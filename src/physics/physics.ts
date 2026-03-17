
export interface Vec {
  x: number
  y: number
  z: number
}

export class Vector implements Vec {
  x: number
  y: number
  z: number

  constructor(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

}