import { vec3 } from "gl-matrix";
import { Entity } from "./entities"

const G = 0.002;
const softening = 0.00001; // Softening to avoid infinite forces at close distances.

const vecA = vec3.create();
const vecB = vec3.create();

export function applyGravity(a: Entity, b: Entity) {
    const posA = a.getPos();
    const posB = b.getPos();
    const rSqr = vec3.sqrDist(posA, posB);
    const mRatio = a.getMass() * b.getMass();

    // Magnitude of the force
    const F = G * (mRatio / Math.sqrt(rSqr + softening));

    // Direction
    const force = vec3.sub(vecA, posB, posA);
    vec3.normalize(force, force);
    vec3.scale(force, force, F);

    // Apply action
    a.applyForce(force);
    // Apply equal reaction
    b.applyForce(vec3.negate(vecB, force));
}
