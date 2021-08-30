import {Location2D} from "./location";
import {distance} from "./movement-utils";

export class Path {
    path: Array<Location2D> = [];
    distance: number = 0;

    addPoint(point: Location2D) {
        if (this.path.length > 0) {
            this.addDistance(distance(this.path[this.path.length-1], point));
        }
        if (point.x !== 0 && point.y !== 0) {
            this.path.push(point);
        }
    }

    addDistance(value: number) {
        this.distance += value;
    }

    length(): number {
        return this.path.length;
    }

    get(index: number): Location2D {
        return this.path[index];
    }
}