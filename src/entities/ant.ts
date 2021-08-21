import {GraphicsEntity} from "../generics/graphics-entity";
import {Color} from "../generics/color";
import {Behavioral, BehaviorState, moveRandomly} from "./behaviors";
import {PheromoneMap} from "../types/pheromoneMap";

export class Ant extends GraphicsEntity implements Behavioral {
    lastPheromone: number = Date.now();

    constructor(x: number, y: number, color: Color) {
        super(x, y, color);
    }

    update(delta: number) {
        this.evaluate(this.behaviorState);
    }

    determineState(): BehaviorState {
        return undefined;
    }

    evaluate(state: BehaviorState): void {
        switch (state) {
            case BehaviorState.IDLE: {
                console.log("IDLE!");
                break;
            }
            case BehaviorState.SEARCHING: {
                console.log("SEARCHING!");
                moveRandomly.execute(this, {
                    numPoints: 10,
                    time: 3,
                    delay: 0.01,
                    completionBehavior: BehaviorState.IDLE,
                    onUpdateFunction: () => this.dropPheromone(window.NEST_TRAILS, 200)
                });

                break;
            }
            case BehaviorState.TARGET_MOVE: {
                console.log("TARGET_MOVE!");
                break;
            }
            default: {
                console.log("Not sure what to do!");
                break;
            }
        }
    }

    dropPheromone(pMap: PheromoneMap, interval: number) {
        let now = Date.now();
        //console.log("Trying to drop food pheromone! now: " + now + " lastP: " + this.lastPheromone + " diff: " + (now - this.lastPheromone) + " interval: " + interval);
        if (now - this.lastPheromone > interval) {
            pMap.addPheromone(this.x, this.y, 1);
            this.lastPheromone = now;
        }
    }

    drawInternal(): void {
        console.log("Drawing ant at " + this.x + ", " + this.y);

        // TODO draw ant!
    }

    logString(): string {
        return "behavior: ";
    }
}