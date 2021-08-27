import {Entity} from "../common/entity";

export class Food extends Entity<any> {
    foodValue: number;

    constructor(x: number, y: number, foodValue: number, parent?: Entity<any>) {
        super(x, y, window.TEXTURES.FOOD, parent);
        this.foodValue = foodValue;
    }

    logString(): string {
        return "";
    }

    update(delta: number): void {
    }
}