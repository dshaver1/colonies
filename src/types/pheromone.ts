import {Location2D} from "../common/location";
import {Entity} from "../common/entity";
import {Surface} from "./surface";
import {PheromoneType} from "./pheromone-type";

const maxValue = 100;

export class Pheromone extends Entity<Surface> implements Location2D {
    private _next: Array<Pheromone> = [];
    private _previous!: Pheromone;
    private _type: PheromoneType;
    private _p: number;

    constructor(x: number, y: number, p: number, type: PheromoneType, previous?: Pheromone, parent?: Surface) {
        super(x, y, getTexture(type), parent);
        this._p = p;
        this._type = type;

        if (window.DEBUG) {
            this.renderable = true;
            this.visible = true;
        } else {
            this.renderable = false;
            this.visible = false;
        }

        if (previous) {
            this._previous = previous;
            previous.next = this;
        }

        this.updateAlpha();
    }

    get next(): Pheromone {
        if (this._next && this._next.length > 1) {
            return this._next.sort((a, b) => b.p - a.p)[0]
        } else if (this._next && this._next.length === 1) {
            return this._next[0];
        }

        return undefined;
    }

    set next(value: Pheromone) {
        this._next.push(value);
    }

    get previous(): Pheromone {
        return this._previous;
    }

    set previous(value: Pheromone) {
        this._previous = value;
    }

    get type(): PheromoneType {
        return this._type;
    }

    set type(value: PheromoneType) {
        this._type = value;
    }

    get p(): number {
        return this._p;
    }

    set p(value: number) {
        this._p = value;
    }

    public update(delta: number): void {
        throw new Error("Method not implemented.");
    }

    decay(amount: number) {
        this._p -= amount;
        this.updateAlpha();
    }

    addP(amount: number, previous: Pheromone) {
        if (this._p + amount > maxValue) {
            this._p = maxValue;
        } else {
            this._p += amount;
        }

        if (previous && this.previous && this !== previous && previous.p > this.previous.p + 0.1) {
            this.previous = previous;
        }

        this.updateAlpha();
    }

    logString(): string {
        return `_p: ${this._p}`;
    }

    private updateAlpha() {
        this.alpha = this._p * 0.01;
    }
}

function getTexture(type: PheromoneType) {
    return type === PheromoneType.NEST ? window.TEXTURES.NEST_PHEROMONE : window.TEXTURES.FOOD_PHEROMONE;
}