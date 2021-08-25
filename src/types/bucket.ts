import {Pheromone, PheromoneType} from "./pheromone";
import {Location2D} from "../common/location";
import {Container} from "pixi.js";
import {Ant} from "../entities/ant";

const DELTA = 0.001;

export class Bucket implements Location2D {
    x: number;
    y: number;
    locked: boolean = false;
    ants: Array<Ant>;
    foodPheromones: Array<Pheromone>;
    nestPheromones: Array<Pheromone>;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.ants = [];
        this.foodPheromones = [];
        this.nestPheromones = [];
    }

    decayAll(px: number) {
        this.nestPheromones.forEach(pheromone => {
            // Decay...
            pheromone.decay(px);

            if (pheromone.p < DELTA) {
                // Delete very small ps...
                (pheromone.parent as Container).removeChild(pheromone);
            }
        });

        this.foodPheromones.forEach(pheromone => {
            // Decay...
            pheromone.decay(px);

            if (pheromone.p < DELTA) {
                // Delete very small ps...
                (pheromone.parent as Container).removeChild(pheromone);
            }
        });

        // Remove very small ps from grid
        this.foodPheromones = this.foodPheromones.filter(pheromone => pheromone.p > DELTA);
        this.nestPheromones = this.nestPheromones.filter(pheromone => pheromone.p > DELTA);
    }

    getPheromones(type: PheromoneType): Array<Pheromone> {
        switch(type) {
            case PheromoneType.NEST:
                return this.nestPheromones;
            case PheromoneType.FOOD:
                return this.foodPheromones;
        }
    }

    addPheromone(pheromone: Pheromone) {
        // TODO implement logic to combine ps if they're close to each other...
    }

    addAnt(ant: Ant) {

    }
}