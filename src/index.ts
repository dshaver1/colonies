import * as PIXI from 'pixi.js';
import {gsap} from 'gsap';
import {PixiPlugin} from 'gsap/PixiPlugin';
import {MotionPathPlugin} from "gsap/MotionPathPlugin";
import {Game} from "./types/game";
import {Color} from "./generics/color";
import {PheromoneMap} from "./types/pheromoneMap";
import {Application} from "pixi.js";
import {Entity} from "./generics/entity";

gsap.registerPlugin(PixiPlugin);
gsap.registerPlugin(MotionPathPlugin);
PixiPlugin.registerPIXI(PIXI);

/**
 * Global configuration options
 */
declare global {
    interface Window {
        PIXI: any;
        DEBUG: boolean;
        FOOD_TRAILS: PheromoneMap;
        NEST_TRAILS: PheromoneMap;
        APP: Application;
        BOUNDS: any;
        P_CELL_SIZE: number;
        P_DECAY_SPEED: number;
        ANT_COLOR: Color;
        FOOD_COLOR: Color;
        FOOD_P_COLOR: Color;
        NEST_COLOR: Color;
        NEST_P_COLOR: Color;
        BACKGROUND_COLOR: Color;
    }
}

/**
 * Colors
 */
window.ANT_COLOR = new Color('#6688DD');
window.FOOD_COLOR = new Color('#dbde23');
window.FOOD_P_COLOR = new Color('#64d916');
window.NEST_COLOR = new Color('#9966FF');
window.NEST_P_COLOR = new Color('#ff4444');
window.BACKGROUND_COLOR = new Color('#061639');

/**
 * App settings
 */
window.PIXI = PIXI; // Needed for chrome pixi devtools
window.APP = new PIXI.Application({
    view: document.getElementById("pixiView") as HTMLCanvasElement,
    resolution: window.devicePixelRatio || 1,
    backgroundColor: window.BACKGROUND_COLOR.color,
    width: window.innerWidth,
    height: window.innerHeight,
    //antialias: true
});
window.APP.renderer.resize(window.innerWidth, window.innerHeight);
window.DEBUG = true;
window.BOUNDS = {left: 0, up: 0, right: window.APP.screen.width, down: window.APP.screen.height}

/**
 * Pheromone settings
 */
window.P_CELL_SIZE = 40;
window.P_DECAY_SPEED = window.APP.screen.width / window.P_CELL_SIZE;


/**
 * Initialize the game!
 */
let game = new Game(window.APP.stage.x,
    window.APP.stage.y,
    window.APP.screen.width,
    window.APP.screen.height,
    window.BACKGROUND_COLOR);

game.start();

console.log("Done with setup...");