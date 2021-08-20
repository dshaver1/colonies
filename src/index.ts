import * as PIXI from 'pixi.js';
import {gsap} from 'gsap';
import {PixiPlugin} from 'gsap/PixiPlugin';
import {MotionPathPlugin} from "gsap/MotionPathPlugin";
import {Pheromone} from "./pheromone";

gsap.registerPlugin(PixiPlugin);
gsap.registerPlugin(MotionPathPlugin);
PixiPlugin.registerPIXI(PIXI);

const app = new PIXI.Application({
    view: document.getElementById("pixiView") as HTMLCanvasElement,
    resolution: window.devicePixelRatio || 1,
    backgroundColor: 0x061639,
    width: window.innerWidth,
    height: window.innerHeight,
    //antialias: true
});