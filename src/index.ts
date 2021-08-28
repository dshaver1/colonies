import * as PIXI from 'pixi.js';
import {Application, Container} from 'pixi.js';
import {gsap} from 'gsap';
import {PixiPlugin} from 'gsap/PixiPlugin';
import {MotionPathPlugin} from "gsap/MotionPathPlugin";
import {Game} from "./types/game";
import {BoundingBox} from "./common/entity";
import {GlobalDebugContainer} from "./common/global-debug-container";
import {Surface} from "./types/surface";
import {Colors} from "./constants/colors";
import {Textures} from "./constants/textures";

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
        SURFACE: Surface;
        BOUNDS: BoundingBox;
        P_CELL_SIZE: number;
        P_DECAY_SPEED: number;
        DEBUG_GRAPHICS: GlobalDebugContainer;
        TEXTURES: Textures;
    }
}

/**
 * App settings
 */
window.PIXI = PIXI; // Needed for chrome pixi devtools
window.APP = new PIXI.Application({
    view: document.getElementById("pixiView") as HTMLCanvasElement,
    resolution: window.devicePixelRatio || 1,
    backgroundColor: Colors.BACKGROUND_COLOR.color,
    width: window.innerWidth,
    height: window.innerHeight
    //antialias: true
});
window.APP.renderer.resize(window.innerWidth, window.innerHeight);

/**
 * Pheromone settings
 */
window.P_CELL_SIZE = 20;
window.P_DECAY_SPEED = window.APP.screen.width / window.P_CELL_SIZE;


/**
 * BOUNDS!
 */
let halfWidth: number = window.APP.screen.width / 2;
let halfHeight: number = window.APP.screen.height / 2;

window.BOUNDS = new BoundingBox(0, window.APP.screen.width, 0, window.APP.screen.height);
//window.BOUNDS = new BoundingBox(-10000, 10000, -10000, 10000);


/**
 * Initialize the game!
 */
window.DEBUG = false;
window.TEXTURES = new Textures();
window.GAME = new Game(window.APP.stage.x,
    window.APP.stage.y,
    window.APP.screen.width,
    window.APP.screen.height,
    Colors.BACKGROUND_COLOR);

window.GAME.start();
window.DEBUG_GRAPHICS = new GlobalDebugContainer();
(window.APP.stage as Container).addChild(window.DEBUG_GRAPHICS);

/**
 * Debug settings
 */
let debugCheckbox = <HTMLInputElement>document.getElementById("debug-checkbox");
let numSpawnInput = <HTMLInputElement>document.getElementById("debug-num-ants");
let spawnButton = <HTMLInputElement>document.getElementById("debug-spawn-ants");

window.DEBUG = debugCheckbox.checked;
debugCheckbox.onclick = function () {
    window.DEBUG = debugCheckbox.checked;
    window.DEBUG_GRAPHICS.clearAll();
    console.log("debug: " + window.DEBUG);
}

spawnButton.onclick = function () {
    let parsedNumber = 1;
    try {
        parsedNumber = parseInt(numSpawnInput.value);
    } catch (e) {
        // do nothing...
    }

    window.GAME.nest.addAnts(parsedNumber)
}

window.GAME.nest.onChange('antcount', () => {
    console.log("antcount change!");
    document.getElementById("ants").innerHTML = window.GAME.nest.getAntCount() + "";
});

console.log("Done with setup...");