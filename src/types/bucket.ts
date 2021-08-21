import {Pheromone} from "./pheromone";
import {Location2D} from "../generics/location";

export class Bucket implements Location2D {
    x: number;
    y: number;
    private _ps: Array<Pheromone>;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this._ps = [];
    }

    get ps(): Array<Pheromone> {
        return this._ps;
    }

    set ps(value: Array<Pheromone>) {
        this._ps = value;
    }
}