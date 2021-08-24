import {Location2D} from "./location";
import {Container, Graphics} from "pixi.js";
import {Behavioral, BehaviorState} from "../entities/behaviors";
import Tween = gsap.core.Tween;
import {Color} from "./color";

export abstract class Entity<T extends Entity<any>> extends Container implements Location2D {
    debugGraphics: Graphics;
    tween: Tween;
    target: Entity<any>;
    parentRef: T;

    constructor(x: number, y: number, parent?: T) {
        super();
        this.x = x;
        this.y = y;
        this.debugGraphics = new Graphics();
        this.addChild(this.debugGraphics);
        this.parentRef = parent;
        this.addToParent(parent);
    }

    abstract logString(): string;

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

    get location2D(): Location2D {
        return {x: this.x, y: this.y, rotation: this.rotation};
    }

    toString(): string {
        return this.constructor.name + '(' + this.x + ',' + this.y + ') {' + this.logString() + '}';
    }
}

export abstract class GraphicsEntity<T extends Entity<any>> extends Entity<T> {
    g: Graphics;
    color: number;

    protected constructor(x: number, y: number, color: Color, parent?: T) {
        super(x, y, parent);
        this.g = new Graphics();
        this.color = color.color;
        this.addChild(this.g);
        this.draw(false, parent);
    }

    /**
     * Public method to call to draw the entity.
     * @param clear Whether or not we should clear the graphics prior to drawing.
     * @param parent Optional parent. If not supplied, adds the entity to the main stage.
     */
    draw(clear: boolean = false, parent?: T): void {
        if (clear) {
            this.g.clear();
        }
        this.drawInternal();
    }

    /**
     * Override this to provide draw instructions.
     */
    protected abstract drawInternal(): void;

    public abstract update(delta: number): void;
}

export abstract class MovableEntity<T extends Entity<any>> extends GraphicsEntity<T> implements Behavioral {
    behaviorState: BehaviorState;

    protected constructor(x: number, y: number, color: Color, parent?: T) {
        super(x, y, color, parent);
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