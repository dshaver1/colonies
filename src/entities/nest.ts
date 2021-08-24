import {Ant} from "./ant";
import { Circle } from "pixi.js";
import { BehaviorState } from "./behaviors";
import {PheromoneMap} from "../types/pheromoneMap";
import {BoundingBox, GraphicsEntity} from "../common/entity";

export class Nest extends GraphicsEntity<any> {
    antsPerClick: number;
    antCount: number = 0;
    ants: Array<Ant> = [];
    foodTrails: PheromoneMap;
    nestTrails: PheromoneMap;
    bounds: BoundingBox;

    constructor(x:number, y:number, antsPerClick:number) {
        super(x, y, window.NEST_COLOR);
        this.antsPerClick = antsPerClick;
        this.foodTrails = new PheromoneMap('food', window.P_CELL_SIZE, window.FOOD_P_COLOR, this);
        this.foodTrails.init(window.APP.screen.width, window.APP.screen.height);
        this.nestTrails = new PheromoneMap('nest', window.P_CELL_SIZE, window.NEST_P_COLOR, this);
        this.nestTrails.init(window.APP.screen.width, window.APP.screen.height);
        this.bounds = window.BOUNDS;
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
                let ant = new Ant(0, 0, window.ANT_COLOR, this);
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