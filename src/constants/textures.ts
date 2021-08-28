import {PheromoneType} from "../types/pheromone-type";
import * as PIXI from "pixi.js";
import {Color} from "../common/color";
import {Colors} from "./colors";
import {Graphics, Texture} from "pixi.js";

export class Textures {
    SURFACE: PIXI.Texture;
    NEST: PIXI.Texture;
    NEST_PHEROMONE: PIXI.Texture;
    FOOD_PHEROMONE: PIXI.Texture;
    FOOD_SOURCE: PIXI.Texture;
    ANT: PIXI.Texture;
    FOOD: PIXI.Texture;

    constructor() {
        this.SURFACE = surfaceTexture();
        this.NEST = nestTexture();
        this.NEST_PHEROMONE = pheromoneTexture(PheromoneType.NEST);
        this.NEST_PHEROMONE = pheromoneTexture(PheromoneType.NEST);
        this.FOOD_SOURCE = foodSourceTexture();

        let baseTexture: PIXI.BaseRenderTexture = antBaseTexture().baseTexture;
        this.ANT = new PIXI.Texture(baseTexture, new PIXI.Rectangle(0,0,15,5));
        this.FOOD = new PIXI.Texture(baseTexture, new PIXI.Rectangle(15,0,10,10));
    }
}

function nestTexture(): Texture {
    let graphics = new Graphics();
    graphics.beginFill(Colors.NEST_COLOR.color);
    graphics.drawCircle(0, 0, 30);
    graphics.endFill();

    return window.APP.renderer.generateTexture(graphics);
}

function pheromoneTexture(type: PheromoneType) {
    let graphic = new PIXI.Graphics();
    let color: Color = type === PheromoneType.NEST ? Colors.NEST_P_COLOR : Colors.FOOD_P_COLOR;
    graphic.beginFill(color.color);
    graphic.drawRect(0, 0, window.P_CELL_SIZE, window.P_CELL_SIZE);
    graphic.endFill();

    return window.APP.renderer.generateTexture(graphic);
}

function surfaceTexture(): Texture {
    let graphics: Graphics = new Graphics();
    graphics.beginFill(Colors.BACKGROUND_COLOR.color);
    graphics.drawRect(0, 0, window.APP.screen.width, window.APP.screen.height);
    graphics.endFill();

    return window.APP.renderer.generateTexture(graphics);
}

export function foodSourceTexture(): Texture {
    let graphics = new Graphics();
    graphics.beginFill(Colors.FOOD_COLOR.color);
    graphics.drawCircle(0, 0, 100);
    graphics.endFill();

    return window.APP.renderer.generateTexture(graphics);
}

export function antBaseTexture() {
    let graphic = new PIXI.Graphics()
    // Ant part
    graphic.beginFill(Colors.ANT_COLOR.color);
    graphic.drawRect(-3, 1, 3, 4);
    graphic.drawRect(-4, 2, 1, 2);
    graphic.drawRect(-8, 1, 4, 4);
    graphic.drawRect(-12, 2, 2, 2);
    graphic.drawRect(-15, 1, 6, 4);
    graphic.endFill();

    // Food part
    graphic.beginFill(Colors.FOOD_COLOR.color);
    graphic.drawCircle(5, 5, 5);
    graphic.endFill();

    return window.APP.renderer.generateTexture(graphic);
}