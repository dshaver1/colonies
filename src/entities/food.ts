import {Entity, GraphicsEntity} from "../generics/entity";

export class Food extends GraphicsEntity {
    foodValue: number;

    constructor(x: number, y: number, foodValue: number, parent?: Entity) {
        super(x, y, window.FOOD_COLOR, parent);
        this.foodValue = foodValue;
    }

    protected drawInternal(): void {
        this.g.beginFill(window.FOOD_COLOR.color);
        this.g.drawCircle(3, 3, 5);
        this.g.endFill();
    }

    logString(): string {
        return "";
    }

    update(delta: number): void {
    }
}