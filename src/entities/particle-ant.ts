import * as PIXI from 'pixi.js';
import {buildSearchPath} from "../common/movement-utils";
import {BoundingBox} from "../common/entity";
import {BehaviorState} from "./behaviors";
import {gsap as gsapcore} from "gsap";
import {RoughEase} from "gsap/EasePack";
import {MotionPathPlugin} from "gsap/MotionPathPlugin";
import Tween = gsap.core.Tween;

gsapcore.registerPlugin(MotionPathPlugin);
gsapcore.registerPlugin(RoughEase);

export class ParticleAntContainer extends PIXI.ParticleContainer {
    texture: PIXI.Texture;
    ants: Array<ParticleAnt> = [];
    
    constructor() {
        super(10000, {rotation: true});
        this.texture = window.APP.renderer.generateTexture(antGraphic());
        (window.APP.stage as PIXI.Container).addChild(this);
    }

    addAnt() {
        let ant: ParticleAnt = new ParticleAnt(this.texture);
        this.ants.push(ant);
        this.addChild(ant);
    }
}

export class ParticleAnt extends PIXI.Sprite {
    tween: Tween;
    behaviorState: BehaviorState;

    constructor(texture: PIXI.Texture) {
        super(texture);
        this.behaviorState = BehaviorState.SEARCHING;
    }

    update(delta: number) {
        if (this.x < -500 || this.x > window.APP.screen.width + 500 || this.y < -500 || this.y > window.APP.screen.height + 500) {
            this.renderable = false;
        } else {
            this.renderable = true;
        }

        if (this.behaviorState === BehaviorState.SEARCHING) {
            //console.log("Searching!");
            let path = buildSearchPath(this, 10, [], window.BOUNDS);

            if (this.renderable) {
                this.tween = gsapcore.to(this, {
                    duration: 5,
                    delay: 0,
                    ease: "rough({template:none.out,strength:0.2,points:10,taper:'both',randomize: true,clamp: false})",
                    motionPath: {
                        path: path,
                        type: 'linear',
                        autoRotate: true,
                        useRadians: true,
                        curviness: 0.5
                    },
                    onComplete: () => {
                        this.behaviorState = BehaviorState.SEARCHING;
                        //this.determineState();
                    },
                    //onUpdate: vars.onUpdateFunction,
                    callbackScope: this
                });
            } else {
                let endPoint = path[path.length-1];
                setTimeout(() => {
                    this.x = endPoint.x;
                    this.y = endPoint.y;
                    this.rotation = endPoint.rotation;
                    this.behaviorState = BehaviorState.SEARCHING;
                }, 5000)
            }
            this.behaviorState = BehaviorState.IDLE;
        }
    }
}

export function antGraphic() {
    const graphic = new PIXI.Graphics()
    graphic.beginFill(0x6688DD);
    graphic.drawRect(-3, 1, 3, 4);
    graphic.drawRect(-4, 2, 1, 2);
    graphic.drawRect(-8, 1, 4, 4);
    graphic.drawRect(-12, 2, 2, 2);
    graphic.drawRect(-15, 1, 6, 4);
    graphic.endFill();
    return graphic
}