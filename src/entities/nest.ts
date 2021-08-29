import {Circle, Graphics, Point, Texture} from "pixi.js";
import {BoundingBox, Entity} from "../common/entity";
import {Pheromone} from "../types/pheromone";
import {Ant, ParticleAntContainer} from "./ant";
import {Colors} from "../constants/colors";
import {PheromoneType} from "../types/pheromone-type";

export class Nest extends Entity<any> {
    bounds: BoundingBox;
    particleAntContainer: ParticleAntContainer;
    changeListeners: any = {};

    constructor(x: number, y: number) {
        super(x, y, window.TEXTURES.NEST);
        this.bounds = window.BOUNDS;
        this.particleAntContainer = new ParticleAntContainer();
        this.alpha = 0.5;
        this.hitArea = new Circle(0, 0, 30);
        this.interactive = true;
        this.on('mouseover', function (mouseData) {
            this.alpha = 1;
        });

        this.on('mouseout', function (mouseData) {
            this.alpha = 0.5;
        });

        this.on('click', e => {
            console.log("nest click!");
        });

        this.createStaticPheromones();
    }

    createStaticPheromones(): void {
        let globalPosition: Point = this.getGlobalPosition();
        let nestPheromone = window.SURFACE.antGrid.setPheromone(globalPosition.x, globalPosition.y, PheromoneType.NEST, undefined, 100, true);

        let radius = 60;
        for (let px = -radius; px <= radius; px += window.P_CELL_SIZE) {
            for (let py = -radius; py <= radius; py += window.P_CELL_SIZE) {
                if (px === -radius || px === radius || py === -radius || py === radius) {
                    let addedX = globalPosition.x + px;
                    let addedY = globalPosition.y + py;
                    window.SURFACE.antGrid.setPheromone(addedX, addedY, PheromoneType.NEST, nestPheromone, 100,  true);
                }
            }
        }
    }

    addAnts(numAnts: number) {
        for (let i = 0; i < numAnts; i++) {
            this.addAnt();
        }
    }

    onChange(event: string, fn: Function) {
        this.changeListeners[event] = fn;
    }

    addAnt(): Ant {
        let ant = this.particleAntContainer.addAnt(this);

        if (this.changeListeners['antcount']) {
            this.changeListeners['antcount']();
        }

        return ant;
    }

    removeAnt(ant: Ant) {
        this.particleAntContainer.removeAnt(ant);
        if (this.changeListeners['antcount']) {
            this.changeListeners['antcount']();
        }
    }

    getAntCount() {
        return this.particleAntContainer.ants.length;
    }

    update(delta: number): void {
        this.particleAntContainer.update(delta);
    }

    logString(): string {
        return "ants: " + this.particleAntContainer.ants.length;
    }
}