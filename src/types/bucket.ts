import {Pheromone} from "./pheromone";
import {Location2D} from "../common/location";
import {Ant} from "../entities/ant";
import {PheromoneType} from "./pheromone-type";

const DELTA = 0.001;

export class Bucket implements Location2D {
    x: number;
    y: number;
    locked: boolean = false;
    ants: Array<Ant>;
    foodPheromone: Pheromone;
    nestPheromone: Pheromone;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.ants = [];
    }

    decayAll(px: number) {
        if (this.nestPheromone) {
            this.nestPheromone.decay(px);

            if (this.nestPheromone.p < DELTA) {
                // Delete very small ps...
                this.nestPheromone.renderable = false;
            }
        }

        if (this.foodPheromone) {
            this.foodPheromone.decay(px);

            if (this.foodPheromone.p < DELTA) {
                // Delete very small ps...
                this.foodPheromone.renderable = false;
            }
        }
    }

    getPheromone(type: PheromoneType): Pheromone {
        switch (type) {
            case PheromoneType.NEST:
                return this.nestPheromone;
            case PheromoneType.FOOD:
                return this.foodPheromone;
        }
    }

    addPheromone(type: PheromoneType, previous: Pheromone, p: number) {
        switch (type) {
            case PheromoneType.NEST:
                if (!this.nestPheromone) {
                    this.nestPheromone = new Pheromone(this.x, this.y, p, type, previous, window.SURFACE);
                } else {
                    this.nestPheromone.addP(p);
                }

                if (!this.nestPheromone.renderable && window.DEBUG) {
                    this.nestPheromone.renderable = true;
                }

                break;
            case PheromoneType.FOOD:
                if (!this.foodPheromone) {
                    this.foodPheromone = new Pheromone(this.x, this.y, p, type, previous, window.SURFACE);
                } else {
                    this.foodPheromone.addP(p);
                }

                if (!this.foodPheromone.renderable && window.DEBUG) {
                    this.foodPheromone.renderable = true;
                }

                break;
        }
    }

    addAnt(ant: Ant) {

    }

    toString(): string {
        return `Bucket(${this.x},${this.y}){locked: ${this.locked}, foodPheromone: ${this.foodPheromone}, nestPheromone: ${this.nestPheromone}}`
    }
}