import {GraphicsEntity} from "../generics/graphics-entity";
import {Ant} from "./ant";
import { Circle } from "pixi.js";
import { BehaviorState } from "./behaviors";

export class Nest extends GraphicsEntity {
    antsPerClick: number;
    ants: Array<Ant> = [];

    constructor(x:number, y:number, antsPerClick:number) {
        super(x, y, window.FOOD_COLOR);
        this.antsPerClick = antsPerClick;
    }

    drawInternal(): void {
        this.g.beginFill(0x9966FF);
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
                let ant = new Ant(this.x, this.y, window.ANT_COLOR);//new Ant(this.x, this.y, {x: this.app.screen.width, y: this.app.screen.height});
                ant.draw();
                this.ants.push(ant);
                //this.app.stage.addChild(ant.container);
                //this.app.stage.addChild(ant.debugGraphics);
            }
        });

        // TODO Add static pheromones leading to nest!
        /*
                let radius 60;

                for (let px = -radius; px <= radius; px += NEST_PHEROMONES.cellSize) {
                    for (let py = -radius; py <= radius; py += NEST_PHEROMONES.cellSize) {
                        let addedX = this.x + px;
                        let addedY = this.y + py;
                        let angle = Math.atan2(addedY - this.y, addedX - this.x);

                        NEST_PHEROMONES.addPheromone(addedX, addedY, 20, angle, true);
                    }
                }*/
    }

    update(delta: number): void {
        this.ants.forEach(ant => ant.update(delta));
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