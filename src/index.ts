import * as PIXI from 'pixi.js';
import {gsap} from 'gsap';
import {PixiPlugin} from 'gsap/PixiPlugin';
import {MotionPathPlugin} from "gsap/MotionPathPlugin";
import {Game} from "./types/game";
import {Color} from "./generics/color";
import {PheromoneMap} from "./types/pheromoneMap";
import {Application, Container} from "pixi.js";
import {BoundingBox} from "./generics/entity";
import {GlobalDebugContainer} from "./generics/global-debug-container";

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
        APP: Application;
        GAME: Game;
        BOUNDS: BoundingBox;
        P_CELL_SIZE: number;
        P_DECAY_SPEED: number;
        ANT_COLOR: Color;
        FOOD_COLOR: Color;
        FOOD_P_COLOR: Color;
        NEST_COLOR: Color;
        NEST_P_COLOR: Color;
        BACKGROUND_COLOR: Color;
        DEBUG_GRAPHICS: GlobalDebugContainer;
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
    height: window.innerHeight
    //antialias: true
});
window.APP.renderer.resize(window.innerWidth, window.innerHeight);
window.DEBUG = true;

let halfWidth: number = window.APP.screen.width/2;
let halfHeight: number = window.APP.screen.height/2;

window.BOUNDS = new BoundingBox(-halfWidth, halfWidth, -halfHeight, halfHeight);

/**
 * Pheromone settings
 */
window.P_CELL_SIZE = 20;
window.P_DECAY_SPEED = window.APP.screen.width / window.P_CELL_SIZE;


/**
 * Initialize the game!
 */
window.GAME = new Game(window.APP.stage.x,
    window.APP.stage.y,
    window.APP.screen.width,
    window.APP.screen.height,
    window.BACKGROUND_COLOR);

window.GAME.start();
window.DEBUG_GRAPHICS = new GlobalDebugContainer();
(window.APP.stage as Container).addChild(window.DEBUG_GRAPHICS)

console.log("Done with setup...");