import {Location2D} from "./location";
import {BoundingBox, Entity} from "./entity";
import {Pheromone} from "../types/pheromone";
import {Path} from "./path";


const defaultScale = 40;
const defaultMagnitude = 50;
const _45degrees = 45 * Math.PI / 180;


/**
 * Attempts to stay on a pheromone path that the ant is already on.
 *
 * @param start The ant's location
 * @param target The pheromone that the ant is current standing on.
 */
export function followPheromonePath(start: Location2D,
                                    target: Pheromone,
                                    numPoints: number,
                                    path: Path,
                                    bounds: BoundingBox,
                                    magnitude: number = defaultMagnitude): Path {
    let point: Location2D;
    let nextAngleDiff: number = 0;
    if (path.length() === 0) {
        point = targetPoint(start, 10);
    } else {
        if (target) {
            if (target.previous) {
                let nextAngle = angle(target, target.previous);
                nextAngleDiff = rotationDiff(start.rotation, nextAngle);
                // point = targetPoint({x: target.x, y: target.y, rotation: angle(target, target.previous)}, magnitude);
                point = {x: target.x + (Math.random() - 0.5) * 4, y: target.y + (Math.random() - 0.5) * 4, rotation: nextAngle}
            } else {
                point = targetPoint({x: target.x, y: target.y, rotation: start.rotation}, magnitude);
            }
        } else {
            point = targetPoint({x: start.x, y: start.y, rotation: start.rotation}, magnitude);
        }
    }

    if (Math.abs(nextAngleDiff) < _45degrees) {
        path.addPoint(point);
    }

    if (path.length() === numPoints || !target) {
        //console.log("Built path: " + JSON.stringify(accumulator, null, 2));
        return path;
    }

    return followPheromonePath(point, target.previous, numPoints, path, bounds, magnitude);
}

/**
 * Attempts to get the ant onto a pheromone path without being too jarring.
 *
 * @param start The ant's location
 * @param target The pheromone path's location
 */
export function goToPheromonePath(start: Location2D, target: Pheromone): Array<Location2D> {
    let path: Array<Location2D> = new Array<Location2D>();
    let distanceToTarget = distance(start, target);

    // p1 is 10 steps in front of the ant, with ant rotation maintained.
    let p1: Location2D = targetPoint(start, 10);
    path.push(p1);

    // p3 is X steps in from of p1, but in the direction the path is pointing.
    let p3, pEnd, pathRotation;

    if (target.previous) {
        pathRotation = angle(target, target.previous);
    } else {
        pathRotation = invertAngle(angle(target.next, target));
    }

    p3 = targetPoint({x: target.x, y: target.y, rotation: pathRotation}, 30);
    pEnd = midwayVector(p1, p3, 30);
    path.push(pEnd);

    //path.push(pEnd);

    //console.log("Built pheromone path: " + JSON.stringify(path, null, 2));

    path.filter(point => {
        if (point.x && point.y && point.x !== 0 && point.y !== 0) {
            return true;
        } else {
            console.log("Found an undefined or 0,0 point!");
            return false;
        }
    });

    return path;
}


/**
 * Build a path for the ant where the first point has no deviation, and all subsequent points have some random variance. This
 * path is based entirely on the starting rotation of the ant.
 *
 * @param start The starting point. This should be the ant itself. (Must contain x, y, and rotation)
 * @param numPoints The number of points on the path to generate.
 * @param accumulator The list of points. Note that this is used recursively to track progress.
 * @param bounds The maximum x and y values that the ant can go
 * @param magnitude The amount to advance with each leg
 * @returns {*} The list of points.
 */
export function buildSearchPath(start: Location2D,
                                numPoints: number,
                                accumulator: Array<Location2D>,
                                bounds: BoundingBox,
                                magnitude: number = defaultMagnitude): Array<Location2D> {
    let point: Location2D;
    if (accumulator.length === 0) {
        point = targetPoint(start, magnitude);
    } else {
        point = randomPoint(start, bounds);
    }

    accumulator.push(point);

    if (accumulator.length === numPoints) {
        //console.log("Built path: " + JSON.stringify(accumulator, null, 2));
        return accumulator;
    }

    return buildSearchPath(point, numPoints, accumulator, bounds);
}

/**
 * Get a point in front of the ant with some random deviation included.
 */
function randomPoint(start: Location2D, bounds: BoundingBox, magnitude: number = defaultMagnitude, scale: number = defaultScale) {
    let xSeed = Math.random() - 0.5;
    let targetPoint = {x: start.x + (magnitude * Math.cos(start.rotation)), y: start.y + (magnitude * Math.sin(start.rotation))}
    let xRand = xSeed * scale;
    let yRand = (Math.random() - 0.5) * scale;
    let boundedPosition = bounds.bound({x: targetPoint.x + xRand, y: targetPoint.y + yRand});
    let newAngle = angle(start, boundedPosition);
    boundedPosition.rotation = newAngle ? newAngle : start.rotation;

    return boundedPosition;
}

function angle(c1: Location2D, c2: Location2D) {
    if (c1 && c2) {
        return Math.atan2(c2.y - c1.y, c2.x - c1.x);
    }

    if (c1 && !c2) {
        return c1.rotation;
    }

    if (c2 && !c1) {
        return c2.rotation;
    }

    return 0;
}

/**
 * Get a point in front of the ant on the current rotational heading with no deviation.
 *
 * @param start The point to start from, includes x, y, and rotation
 * @param magnitude The amount to advance with each leg
 * @returns {{rotation, x: *, y: *}} The extrapolated point following the rotational line.
 */
function targetPoint(start: Location2D, magnitude: number, delta?: number) {
    let adjustedRotation = delta ? start.rotation + (Math.random() - 0.5) * delta : start.rotation;
    return {
        x: start.x + (magnitude * Math.cos(adjustedRotation)),
        y: start.y + (magnitude * Math.sin(adjustedRotation)),
        rotation: start.rotation
    }
}

export function hit(ant: Entity<any>, entity: Entity<any>): boolean {
    let antGlobal = ant.getGlobalPosition();
    let entityGlobal = entity.getGlobalPosition();

    let a = antGlobal.x - entityGlobal.x;
    let b = antGlobal.y - entityGlobal.y;
    let c = Math.hypot(a, b);
    if (c <= entity.width / 2) {
        return true;
    }
    return false;
}

function invertAngle(angle: number) {
    return (angle + Math.PI) % (2 * Math.PI);
}

function modNearestInt(a: number, b: number) {
    return a - b * Math.round(a / b);
}

export function diff(num1: number, num2: number) {
    if (num1 > num2) {
        return num1 - num2
    } else {
        return num2 - num1
    }
}

const _2PI = Math.PI * 2;

export function distance(p1: Location2D, p2: Location2D): number {
    return Math.hypot(p1.x - p2.x, p1.y - p2.y);
}

/**
 * Get a point midway (rotationally) between 2 points
 *
 * @param v1 The origin point
 * @param v2 The destination point
 * @param magnitude Magnitude to move in the new direction.
 */
function midwayVector(v1: Location2D, v2: Location2D, magnitude: number): Location2D {
    let rotation = v1.rotation + entityRotationDiff(v1, v2) / 2;

    return targetPoint({x: v1.x, y: v1.y, rotation: rotation}, magnitude);
}

/**
 * Calculates the shortest rotational difference between 2 angles.
 *
 * @param ant The origin point
 * @param other The destination point
 */
export function entityRotationDiff(ant: Location2D, other: Location2D): number {
    let otherAngle = angle(ant, other);

    return rotationDiff(ant.rotation, otherAngle);
}

export function rotationDiff(a1: number, a2: number): number {
    let diff = (a2 - a1 + Math.PI) % _2PI - Math.PI;

    return diff < -Math.PI ? diff + _2PI : diff;
}

/**
 * Calculates the absolute shortest rotational difference between 2 angles, ignoring direction.
 *
 * @param ant The origin point
 * @param other The destination point
 */
export function rotationDiffAbs(ant: Location2D, other: Location2D): number {
    let a1 = angle(ant, other);
    let unWrappedAnt = unwrapRads(ant.rotation);
    let unWrappedA1 = unwrapRads(a1);
    return Math.PI - Math.abs(Math.abs(unWrappedAnt - unWrappedA1) - Math.PI);
}

export function unwrapRads(rotation: number): number {
    let angle = rotation % _2PI;
    angle = (angle + _2PI) % _2PI;
    if (angle > Math.PI) {
        angle -= _2PI;
    }

    return angle;
}

export function angleDiff(ant: Location2D, other: Location2D) {
    let v1 = {x: Math.cos(ant.rotation), y: Math.sin(ant.rotation)};
    let v2 = {x: other.x - ant.x, y: other.y - ant.y};
    let v2Magnitude = Math.hypot(v2.x, v2.y);
    v2 = {x: v2.x / v2Magnitude, y: v2.y / v2Magnitude};

    return Math.abs(Math.acos(dot(v1, v2)));
}

function dot(v1: Location2D, v2: Location2D) {
    return (v1.x * v2.x) + (v1.y * v2.y);
}