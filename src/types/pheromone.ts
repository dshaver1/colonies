import {Location2D} from "../generics/location";
import {Entity} from "../generics/entity";

class Pheromone extends Entity implements Location2D {
    private _next!: Pheromone;
    private _previous!: Pheromone;
    private _p: number;

    constructor(x: number, y: number, p: number, previous?: Pheromone, parent?: Entity) {
        super(x, y, parent);
        this._p = p;

        if (previous) {
            this._previous = previous;
            previous.next = this;
        }

        this.drawDebug();
    }

    private drawDebug() {
        this.debugGraphics.alpha = 0.5;
        this.debugGraphics.beginFill(window.NEST_P_COLOR.color, 1);
        this.debugGraphics.drawRect(0, 0, 4, 4);
        this.debugGraphics.endFill();
        if (this._previous) {
            this.debugGraphics.lineStyle(1, window.NEST_P_COLOR.color, 1);
            this.debugGraphics.moveTo(2, 2);

            let prevPoint = this.debugGraphics.toLocal({x: this.debugGraphics.x, y: this.debugGraphics.y}, this.previous);

            this.debugGraphics.lineTo(prevPoint.x + 2, prevPoint.y + 2);
        }
    }

    decay(amount: number) {
        this._p -= amount;
        this.updateAlpha();
    }

    addP(amount: number) {
        this._p += amount;
        this.updateAlpha();
    }

    private updateAlpha() {
        this.debugGraphics.alpha = this._p * 0.5;
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

    logString(): string {
        return `_p: ${this._p}`;
    }
}

export { Pheromone }