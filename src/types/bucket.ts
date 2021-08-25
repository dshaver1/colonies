import {Pheromone, PheromoneType} from "./pheromone";
import {Location2D} from "../common/location";
import {Container} from "pixi.js";
import {Ant} from "../entities/ant";
import {distance} from "../common/movement-utils";

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
        switch (type) {
            case PheromoneType.NEST:
                return this.nestPheromones;
            case PheromoneType.FOOD:
                return this.foodPheromones;
        }
    }

    addPheromone(pheromone: Pheromone) {
        switch (pheromone.type) {
            case PheromoneType.NEST:
                if (this.nestPheromones.length === 0) {
                    this.nestPheromones.push(pheromone);
                    pheromone.drawDebug();
                } else if (this.nestPheromones.length === 1) {
                    this.nestPheromones[0].p += pheromone.p;
                } else {
                    this.nestPheromones.sort((a, b) => distance(pheromone, b) - distance(pheromone, a))[0].p += pheromone.p;
                }
                break;
            case PheromoneType.FOOD:
                if (this.foodPheromones.length === 0) {
                    this.foodPheromones.push(pheromone);
                    pheromone.drawDebug();
                } else if (this.foodPheromones.length === 1) {
                    this.foodPheromones[0].p += pheromone.p;
                } else {
                    this.foodPheromones.sort((a, b) => distance(pheromone, b) - distance(pheromone, a))[0].p += pheromone.p;
                }
                break;
        }
    }

    addAnt(ant: Ant) {

    }
}