import {Entity, GraphicsEntity} from "../common/entity";

export class Food extends GraphicsEntity<any> {
    foodValue: number;

    constructor(x: number, y: number, foodValue: number, parent?: Entity<any>) {
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