import {Location2D} from "./location";
import {BoundingBox, Entity} from "./entity";
import {Pheromone} from "../types/pheromone";
import {Ant} from "../entities/ant";


const defaultScale = 40;
const defaultMagnitude = 50;


export function buildPheromonePath(start: Location2D, target: Pheromone): Array<Location2D> {
    let path: Array<Location2D> = new Array<Location2D>();
    let distanceToTarget = distance(start, target);

    // p1 is 10 steps in front of the ant, with ant rotation maintained.
    let p1: Location2D = targetPoint(start, 10);
    path.push(p1);
    let pEnd, pathRotation;

    if (target.previous) {
        pathRotation = angle(target, target.previous);
        pEnd = targetPoint({x: p1.x, y: p1.y, rotation: pathRotation}, 30);
    } else {
        pathRotation = angle(target.next, target);
        pEnd = targetPoint({x: p1.x, y: p1.y, rotation: pathRotation}, 30);
    }

    path.push(pEnd);

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
    try {
        return Math.atan2(c2.y - c1.y, c2.x - c1.x);
    } catch (e) {
        console.log("Caught error in angle()!\n" + e);
        return undefined;
    }
}

/**
 * Get a point in front of the ant on the current rotational heading with no deviation.
 *
 * @param start The point to start from, includes x, y, and rotation
 * @param magnitude The amount to advance with each leg
 * @returns {{rotation, x: *, y: *}} The extrapolated point following the rotational line.
 */
function targetPoint(start: Location2D, magnitude: number) {
    return {
        x: start.x + (magnitude * Math.cos(start.rotation)),
        y: start.y + (magnitude * Math.sin(start.rotation)),
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

function distance(p1: Location2D, p2: Location2D): number {
    return Math.hypot(p1.x - p2.x, p1.y - p2.y);
}

export function rotationDiff(ant: Location2D, other: Location2D): number {
    let a1 = angle(ant, other);
    let unWrappedAnt = unwrapRads(ant.rotation);
    let unWrappedA1 = unwrapRads(a1);
    return diff(unWrappedAnt, unWrappedA1);
}

const _2PI = Math.PI * 2;

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
    v2 = {x: v2.x/v2Magnitude, y: v2.y/v2Magnitude};

    return Math.abs(Math.acos(dot(v1,v2)));
}

function dot(v1: Location2D, v2: Location2D) {
    return (v1.x * v2.x) + (v1.y * v2.y);
}