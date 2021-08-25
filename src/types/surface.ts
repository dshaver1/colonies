import {Game} from "./game";
import {Container, Graphics, Rectangle} from "pixi.js";
import {FoodSource} from "../entities/foodsource";
import {Color} from "../common/color";
import {BoundingBox, Entity} from "../common/entity";
import {AntGrid} from "./antGrid";

export class Surface extends Entity<any>{
    game: Game;
    graphics: Graphics;
    bounds: BoundingBox;
    color: Color;
    antGrid: AntGrid;

    constructor(bounds: BoundingBox, surfaceColor: Color, game: Game) {
        super(0,0)
        this.bounds = bounds;
        this.color = surfaceColor;
        this.game = game;
        this.antGrid = new AntGrid(window.P_CELL_SIZE);
        this.antGrid.init(window.APP.screen.width, window.APP.screen.height);
        this.graphics = new Graphics();
        this.draw();
    }

    draw() {
        this.graphics.beginFill(this.color.color);
        this.graphics.drawRect(0, 0, window.APP.screen.width, window.APP.screen.height);
        this.graphics.endFill();
        this.graphics.interactive = true;
        this.graphics.hitArea = new Rectangle(0, 0, window.APP.screen.width, window.APP.screen.height);
        this.graphics.on('click', function (mouseData) {
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
            if (this.game.foodSources.length === 0) {
                let foodSource: FoodSource = new FoodSource(mouseData.data.global.x, mouseData.data.global.y, 5000);
                foodSource.draw();
                this.game.foodSources.push(foodSource);
            }
            //FOOD_PHEROMONES.addPheromone(mouseData.data.global.x, mouseData.data.global.y, 10);
        }, this);
        this.addChild(this.graphics);
    }

    logString(): string {
        throw new Error("Method not implemented.");
    }
}