import {Ant} from "./ant";
import {Circle, Point} from "pixi.js";
import {BehaviorState} from "./behaviors";
import {BoundingBox, GraphicsEntity} from "../common/entity";
import {Pheromone, PheromoneType} from "../types/pheromone";
import {ParticleAntContainer} from "./particle-ant";

export class Nest extends GraphicsEntity<any> {
    antsPerClick: number;
    antCount: number = 0;
    ants: Array<Ant> = [];
    bounds: BoundingBox;
    particleAntContainer: ParticleAntContainer;

    constructor(x: number, y: number, antsPerClick: number) {
        super(x, y, window.NEST_COLOR);
        this.antsPerClick = antsPerClick;
        this.bounds = window.BOUNDS;
        this.particleAntContainer = new ParticleAntContainer();
    }

    drawInternal(): void {
        this.g.beginFill(this.color);
        this.g.alpha = 0.5;
        this.g.hitArea = new Circle(0, 0, 30);
        this.g.drawCircle(0, 0, 30);
        this.g.endFill();
        this.g.interactive = true;
        this.g.on('mouseover', function (mouseData) {
            this.alpha = 1;
        });

        this.g.on('mouseout', function (mouseData) {
            this.alpha = 0.5;
        });

        this.g.on('click', e => {
            console.log("nest click! antsPerClick: " + this.antsPerClick);
            for (let i = 0; i < this.antsPerClick; i++) {
                this.particleAntContainer.addAnt();
                // let ant = new Ant(0, 0, window.ANT_COLOR, this);
                // this.ants.push(ant);
                //this.app.stage.addChild(ant.container);
                //this.app.stage.addChild(ant.debugGraphics);
            }
        });

        // TODO Add static pheromones leading to nest!
        let globalPosition: Point = this.getGlobalPosition();
        let nestPheromone = new Pheromone(globalPosition.x, globalPosition.y, 100, PheromoneType.NEST, undefined, window.SURFACE);
        window.SURFACE.antGrid.setPheromone(globalPosition.x, globalPosition.y, nestPheromone, true);

        let radius = 60;
        for (let px = -radius; px <= radius; px += window.P_CELL_SIZE) {
            for (let py = -radius; py <= radius; py += window.P_CELL_SIZE) {
                if (px === -radius || px === radius || py === -radius || py === radius) {
                    let addedX = globalPosition.x + px;
                    let addedY = globalPosition.y + py;
                    let newPheromone = new Pheromone(addedX, addedY, 100, PheromoneType.NEST, nestPheromone, window.SURFACE)

                    window.SURFACE.antGrid.setPheromone(addedX, addedY, newPheromone, true);
                }
            }
        }
    }

    addAnt(): Ant {
        let ant = new Ant(0, 0, window.ANT_COLOR, this);
        ant.name = `ant-${++this.antCount}`;
        this.ants.push(ant);

        return ant;
    }

    deleteAnt(ant: Ant) {
        this.removeChild(ant);
        this.ants = this.ants.filter(a => a !== ant);
    }

    update(delta: number): void {
        this.particleAntContainer.ants.forEach(ant => ant.update(delta));
    }

    determineState(): BehaviorState {
        throw new Error("Method not implemented.");
    }

    evaluate(state: BehaviorState): void {
        throw new Error("Method not implemented.");
    }

    logString(): string {
        return "ants: " + this.ants.length;
    }
}