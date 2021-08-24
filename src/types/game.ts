import {PheromoneMap} from "./pheromoneMap";
import {Graphics, Rectangle, Container} from "pixi.js";
import {FoodSource} from "../entities/foodsource";
import {Color} from "../generics/color";
import {Nest} from "../entities/nest";
import {safeToString} from "../generics/entity";

export class Game {
    readonly surface: Graphics;
    nest: Nest;
    foodSources: Array<FoodSource> = [];
    state: Function;
    now: number = Date.now();
    lastDebugLog: number = this.now;

    constructor(lowerX: number, lowerY: number, upperX: number, upperY: number, surfaceColor: Color) {
        console.log("Creating Game Surface...");

        this.surface = new Graphics();
        this.surface.beginFill(surfaceColor.color);
        this.surface.drawRect(lowerX, lowerY, upperX, upperY);
        this.surface.endFill();
        this.surface.interactive = true;
        this.surface.hitArea = new Rectangle(lowerX, lowerY, upperX, upperY);
        this.surface.on('click', function (mouseData) {
            console.log("Surface click! (" + mouseData.data.global.x + "," + mouseData.data.global.y + ")");
            /*        let mouseX = mouseData.data.global.x;
                    let mouseY = mouseData.data.global.y;

                    if (bezierPoints.length < 8) {
                        bezierPoints.push(mouseX, mouseY);
                        debugGraphics.beginFill(0xDD1740)
                        debugGraphics.drawRect(mouseX, mouseY, 5, 5);
                        debugGraphics.endFill();
                    } else {
                        console.log("Built bezier controls: " + JSON.stringify(bezierPoints, null, 2));

                        bezierToTarget(bezierPoints);
                    }*/
            if (this.foodSources.length === 0) {
                let foodSource: FoodSource = new FoodSource(mouseData.data.global.x, mouseData.data.global.y, 50);
                foodSource.draw();
                this.foodSources.push(foodSource);
            }
            //FOOD_PHEROMONES.addPheromone(mouseData.data.global.x, mouseData.data.global.y, 10);
        }, this);
        (window.APP.stage as Container).addChild(this.surface);


        this.nest = new Nest(upperX/2, upperY/2, 1);
    }

    start() {
        window.APP.ticker.add(delta => this.gameLoop(delta));
        this.state = this.play;
    }

    gameLoop(delta: number) {
        this.state(delta);
        this.nest.update(delta);
        this.nest.nestTrails.decayNextColumn(0.2);
        this.nest.foodTrails.decayNextColumn(0.2);
    }

    play(delta: number) {
        this.now = Date.now();
        if (this.now - this.lastDebugLog > 10000) {
            console.log(safeToString(this.foodSources[0]) + '\n' + safeToString(this.nest));
            this.lastDebugLog = this.now;
        }
    }
}
