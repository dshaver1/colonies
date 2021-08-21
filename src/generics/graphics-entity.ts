import {Graphics} from "pixi.js";
import {Entity} from "./entity";
import {Color} from "./color";

export abstract class GraphicsEntity extends Entity {
    g: Graphics;
    color: number;

    protected constructor(x: number, y: number, color: Color) {
        super(x, y);
        this.g = new Graphics();
        this.color = color.color;
        this.addChild(this.g);
    }

    /**
     * Public method to call to draw the entity.
     * @param clear Whethere or not we should clear the graphics prior to drawing.
     */
    draw(clear?: boolean): void {
        if (clear) {
            this.g.clear();
        }
        this.drawInternal();
        this.addToStage();
    }

    /**
     * Override this to provide draw instructions.
     */
    protected abstract drawInternal(): void;

    public abstract update(delta: number): void;
}