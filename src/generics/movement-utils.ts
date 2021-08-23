import {Location2D} from "./location";
import {BoundingBox, Entity} from "./entity";


const defaultScale = 40;
const defaultMagnitude = 50;
/**
 * Build a path for the ant where the first point has no deviation, and all subsequent points have some random variance.
 *
 * @param start The starting point. This should be the ant itself. (Must contain x, y, and rotation)
 * @param numPoints The number of points on the path to generate.
 * @param accumulator The list of points. Note that this is used recursively to track progress.
 * @param bounds The maximum x and y values that the ant can go
 * @param magnitude The amount to advance with each leg
 * @returns {*} The list of points.
 */

export function buildPath(start: Location2D,
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

    return buildPath(point, numPoints, accumulator, bounds);
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
    boundedPosition.rotation = angle(start, boundedPosition);

    return boundedPosition;
}

function angle(c1: Location2D, c2: Location2D) {
    return Math.atan2(c2.y - c1.y, c2.x - c1.x);
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

export function hit(ant: Entity, entity: Entity): boolean {
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

function diff (num1: number, num2: number) {
    if (num1 > num2) {
        return num1 - num2
    } else {
        return num2 - num1
    }
}