class Pheromone {
    private _next!: Pheromone;
    private _previous!: Pheromone;
    private _x: number;
    private _y: number;
    private _p: number;

    constructor(x: number, y: number, p: number) {
        this._x = x;
        this._y = y;
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

    get x(): number {
        return this._x;
    }

    set x(value: number) {
        this._x = value;
    }

    get y(): number {
        return this._y;
    }

    set y(value: number) {
        this._y = value;
    }

    get p(): number {
        return this._p;
    }

    set p(value: number) {
        this._p = value;
    }
}

export { Pheromone }