import {Location2D} from "../generics/location";

class Pheromone implements Location2D {
    x: number;
    y: number;
    private _next!: Pheromone;
    private _previous!: Pheromone;
    private _p: number;

    constructor(x: number, y: number, p: number) {
        this.x = x;
        this.y = y;
        this._p = p;
    }

    decay(amount : number) {
        this._p -= amount;
    }

    get next(): Pheromone {
        return this._next;
    }

    set next(value: Pheromone) {
        this._next = value;
    }

    get previous(): Pheromone {
        return this._previous;
    }

    set previous(value: Pheromone) {
        this._previous = value;
    }

    get p(): number {
        return this._p;
    }

    set p(value: number) {
        this._p = value;
    }
}

export { Pheromone }