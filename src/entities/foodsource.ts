import {Circle} from "pixi.js";
import {BehaviorState} from "./behaviors";
import {Entity, GraphicsEntity} from "../common/entity";
import {Food} from "./food";

const foodToSizeRatio: number = 0.01;

export class FoodSource extends GraphicsEntity<any> {
    foodValue: number;

    constructor(x: number, y: number, initialFoodValue: number) {
        super(x,y,window.FOOD_COLOR);
        this.foodValue = initialFoodValue;
    }

    decrementFoodValue(amount: number) {
        this.foodValue -= amount;
        this.width -= amount * foodToSizeRatio;
        this.height -= amount * foodToSizeRatio;
    }

    drawInternal() {
        this.g.beginFill(window.FOOD_COLOR.color);
        this.g.hitArea = new Circle(0, 0, this.foodValue * foodToSizeRatio);
        this.g.drawCircle(0, 0, this.foodValue * foodToSizeRatio);
        this.g.endFill();
    }

    logString(): string {
        return "foodValue: " + this.foodValue;
    }

    convertFoodValueToWidth(): number {
        return this.foodValue * foodToSizeRatio;
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

    createFood(x: number, y: number, parent?: Entity<any>) {
        console.log("Adding food to x: " + x + ", y: " + y);

        let food: Food = new Food(x, y, 1, parent);

        parent.addChild(food);

        this.decrementFoodValue(1);

        return food;
    }
}
