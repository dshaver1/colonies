import {Location2D} from "./location";
import {Container, Graphics, Sprite, Texture} from "pixi.js";
import {Behavioral, BehaviorState} from "../entities/behaviors";
import Tween = gsap.core.Tween;

export abstract class Entity<T extends Entity<any>> extends Sprite implements Location2D {
    debugGraphics: Graphics;
    tween: Tween;
    target: Entity<any>;
    parentRef: T;

    constructor(x: number, y: number, texture: Texture, parent?: T) {
        super(texture);
        this.x = x;
        this.y = y;
        this.anchor.set(0.5, 0.5);
        this.debugGraphics = new Graphics();
        this.addChild(this.debugGraphics);
        this.parentRef = parent;
        this.addToParent(parent);
    }

    get location2D(): Location2D {
        return {x: this.x, y: this.y, rotation: this.rotation};
    }

    abstract logString(): string;

    public abstract update(delta: number): void;

    checkRenderable() {
        if (this.x < -1000 || this.x > window.APP.screen.width + 1000 || this.y < -1000 || this.y > window.APP.screen.height + 1000) {
            this.renderable = false;
        } else {
            this.renderable = true;
        }
    }

    stop() {
        if (this.tween && this.tween.isActive()) {
            console.log("Killing...");
            this.tween.kill();
        }
        this.tween = undefined;
    }

    addToParent(parent?: T) {
        if (parent) {
            parent.addChild(this);
        } else {
            (window.APP.stage as Container).addChild(this);
        }
    }

    toString(): string {
        return this.constructor.name + '(' + this.x + ',' + this.y + ') {' + this.logString() + '}';
    }
}

export abstract class MovableEntity<T extends Entity<any>> extends Entity<T> implements Behavioral {
    behaviorState: BehaviorState;

    protected constructor(x: number, y: number, texture: Texture, parent?: T) {
        super(x, y, texture);
        this.behaviorState = BehaviorState.IDLE;
    }

    abstract determineState(): BehaviorState;

    abstract evaluate(state: BehaviorState): void;
}

export function safeToString(entity: Entity<any>): string {
    if (entity) {
        return entity.toString();
    }

    return "Not Defined";
}

export class BoundingBox {
    left: number;
    right: number;
    top: number;
    bottom: number;

    constructor(left: number, right: number, top: number, bottom: number) {
        this.left = left;
        this.right = right;
        this.top = top;
        this.bottom = bottom;
    }

    bound(position: Location2D): Location2D {
        let adjustedX: number = position.x;
        let adjustedY: number = position.y;

        if (adjustedX < this.left) {
            adjustedX = this.left + (this.left - adjustedX);
        } else if (adjustedX > this.right) {
            adjustedX = this.right - (adjustedX - this.right);
        }

        if (adjustedY < this.top) {
            adjustedY = this.top + (this.top - adjustedY);
        } else if (adjustedY > this.bottom) {
            adjustedY = this.bottom - (adjustedY - this.bottom);
        }

        return {x: Math.round(adjustedX), y: Math.round(adjustedY)};
    }
}