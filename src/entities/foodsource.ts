import {Circle, Container, Graphics, Texture} from "pixi.js";
import {BehaviorState} from "./behaviors";
import {Entity} from "../common/entity";
import {Food} from "./food";
import {Colors} from "../constants/colors";

const foodToSizeRatio: number = 0.01;

export class FoodSource extends Entity<any> {
    foodValue: number;

    constructor(x: number, y: number, initialFoodValue: number) {
        super(x, y, window.TEXTURES.FOOD_SOURCE);
        this.foodValue = initialFoodValue;
        this.hitArea = new Circle(0, 0, this.foodValue * foodToSizeRatio);
    }

    decrementFoodValue(amount: number) {
        this.foodValue -= amount;
        this.width -= amount * foodToSizeRatio;
        this.height -= amount * foodToSizeRatio;
    }

    logString(): string {
        return "foodValue: " + this.foodValue;
    }

    convertFoodValueToWidth(): number {
        return this.foodValue * foodToSizeRatio;
    }

    update(delta: number): void {
        let diameter = this.convertFoodValueToWidth();
        this.width = diameter;
        this.height = diameter;
    }

    determineState(): BehaviorState {
        throw new Error("Method not implemented.");
    }

    evaluate(state: BehaviorState): void {
        throw new Error("Method not implemented.");
    }

    createFood(x: number, y: number, parent?: Container) {
        console.log("Adding food to x: " + x + ", y: " + y);

        let food: Food = new Food(x, y, 1);
        food.x = 10;

        parent.addChild(food);

        this.decrementFoodValue(1);

        return food;
    }
}