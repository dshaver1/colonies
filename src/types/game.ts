import {FoodSource} from "../entities/foodsource";
import {Color} from "../common/color";
import {Nest} from "../entities/nest";
import {safeToString} from "../common/entity";
import {Surface} from "./surface";

export class Game {
    nest: Nest;
    foodSources: Array<FoodSource> = [];
    state: Function;
    now: number = Date.now();
    lastDebugLog: number = this.now;
    surface: Surface;

    constructor(lowerX: number, lowerY: number, upperX: number, upperY: number, surfaceColor: Color) {
        console.log("Creating Game Surface...");

        this.surface = new Surface(window.BOUNDS, surfaceColor, this);
        this.nest = new Nest(upperX/2, upperY/2, 1);
    }

    start() {
        window.SURFACE = this.surface;
        window.APP.ticker.add(delta => this.gameLoop(delta));
        this.state = this.play;
    }

    gameLoop(delta: number) {
        this.state(delta);
        this.nest.update(delta);
        this.surface.antGrid.decayNextColumn(0.5);
        this.surface.antGrid.decayNextColumn(0.5);
    }

    play(delta: number) {
        this.now = Date.now();
        if (this.now - this.lastDebugLog > 10000) {
            console.log(safeToString(this.foodSources[0]) + '\n' + safeToString(this.nest));
            this.lastDebugLog = this.now;
        }
    }
}
