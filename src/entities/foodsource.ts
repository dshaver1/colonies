import {Circle} from "pixi.js";
import {GraphicsEntity} from "../generics/graphics-entity";
import {BehaviorState} from "./behaviors";

export class FoodSource extends GraphicsEntity {
    foodValue: number;

    constructor(x: number, y: number, initialFoodValue: number) {
        super(x,y,window.FOOD_COLOR);
        this.foodValue = initialFoodValue;
    }

    drawInternal() {
        this.g.beginFill(window.FOOD_COLOR.color);
        this.g.hitArea = new Circle(0, 0, this.foodValue);
        this.g.drawCircle(0, 0, this.foodValue);
        this.g.endFill();
    }

    logString(): string {
        return "foodValue: " + this.foodValue;
    }

    convertFoodValueToWidth(): number {
        return this.foodValue / 10;
    }

    update(delta: number): void {
        let diameter = this.convertFoodValueToWidth();
        this.g.width = diameter;
        this.g.height = diameter;
    }

    determineState(): BehaviorState {
        throw new Error("Method not implemented.");
    }

    evaluate(state: BehaviorState): void {
        throw new Error("Method not implemented.");
    }
}
