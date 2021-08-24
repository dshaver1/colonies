import {Pheromone} from "./pheromone";
import {Location2D} from "../common/location";
import {PheromoneMap} from "./pheromoneMap";
import { Container } from "pixi.js";

export class Bucket implements Location2D {
    x: number;
    y: number;
    locked: boolean = false;
    pheromone: Pheromone;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    decayAll(px: number) {
        if (this.pheromone) {
            this.pheromone.decay(px);

            if (this.pheromone.p < 0.0001) {
                (this.pheromone.parent as Container).removeChild(this.pheromone);
                this.pheromone = undefined;
            }
        }
    }
}