import {Location2D} from "./location";
import {Container, Graphics} from "pixi.js";
import {Behavioral, BehaviorState} from "../entities/behaviors";
import Tween = gsap.core.Tween;

export abstract class Entity extends Container implements Location2D, Behavioral {
    behaviorState: BehaviorState;
    debugGraphics: Graphics;
    tween: Tween;

    constructor(x: number, y: number) {
        super();
        this.x = x;
        this.y = y;
        this.behaviorState = BehaviorState.IDLE;
        this.debugGraphics = new Graphics();
    }

    abstract logString(): string;

    abstract determineState(): BehaviorState;

    abstract evaluate(state: BehaviorState): void;

    addToStage() {
        (window.APP.stage as Container).addChild(this);
    }

    toString(): string {
        return this.constructor.name + '(' + this.x + ',' + this.y + ') {' + this.logString() + '}';
    }
}

export function safeToString(entity: Entity): string {
    if (entity) {
        return entity.toString();
    }

    return "Not Defined";
}