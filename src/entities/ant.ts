import {Color} from "../generics/color";
import {Behavioral, BehaviorState, moveRandomly} from "./behaviors";
import {PheromoneMap} from "../types/pheromoneMap";
import {Nest} from "./nest";
import {Entity, MovableEntity} from "../generics/entity";
import {Pheromone} from "../types/pheromone";
import {hit} from "../generics/movement-utils";
import {FoodSource} from "./foodsource";

const detectHomeRange = 25;

export class Ant extends MovableEntity implements Behavioral {
    lastPheromoneTimestamp: number = Date.now();
    lastStateCheck: number = Date.now();
    lastPheromone: Pheromone;
    nestPCounter: number = 10;
    carrying: Entity;
    target: Entity;

    constructor(x: number, y: number, color: Color, parent: Entity) {
        super(x, y, color, parent);
        this.rotation = (Math.random() - 0.5) * Math.PI * 2
    }

    update(delta: number) {
        if (this.isNearHome()) {
            this.nestPCounter = 10;
        }

        this.evaluate(this.behaviorState);
    }


    private isNearHome(): boolean {
        return (this.x < detectHomeRange && this.x > -detectHomeRange) && (this.y < detectHomeRange && this.y > -detectHomeRange);
    }

    determineState(): BehaviorState {
        let newState: BehaviorState = this.behaviorState;

        if (!this.carrying) {
            let foodSourceHits = window.GAME.foodSources.filter(foodSource => hit(this, foodSource));
            if (foodSourceHits && foodSourceHits.length > 0) {
                newState = BehaviorState.PICKUP_FOOD;
                this.target = foodSourceHits[0];
            }
        } else if (newState === BehaviorState.IDLE) {
            // IDLE ants should start searching for food.
            newState = BehaviorState.SEARCHING
        }

        this.behaviorState = newState;

        console.log("New state: " + this.behaviorState);

        return newState;
    }

    evaluate(state: BehaviorState): void {
        switch (state) {
            case BehaviorState.IDLE: {
                console.log("IDLE!");
                let nest: Nest = this.parent as Nest;
                moveRandomly.execute(this, {
                    bounds: nest.bounds,
                    numPoints: 3,
                    time: 1,
                    delay: 0.5,
                    onCompleteFunction: () => {
                        this.behaviorState = BehaviorState.SEARCHING;
                        this.determineState();
                    },
                    onUpdateFunction: () => this.dropNestPheromone(nest.nestTrails, 400)
                });
                break;
            }
            case BehaviorState.SEARCHING: {
                console.log("SEARCHING!");
                let nest: Nest = this.parent as Nest;
                moveRandomly.execute(this, {
                    bounds: nest.bounds,
                    numPoints: 10,
                    time: 3,
                    delay: 0.01,
                    onCompleteFunction: () => {
                        this.behaviorState = BehaviorState.SEARCHING;
                        this.determineState();
                    },
                    onUpdateFunction: () => {
                        if (this.nestPCounter >= 0) {
                            this.dropNestPheromone(nest.nestTrails, 400)
                        }

                        if (Date.now() - this.lastStateCheck > 1000) {
                            this.determineState();
                        }
                    }
                });
                break;
            }
            case BehaviorState.TARGET_MOVE: {
                console.log("TARGET_MOVE!");
                break;
            }
            case BehaviorState.MOVING: {
                //console.log("MOVING!");
                break;
            }
            case BehaviorState.PICKUP_FOOD: {
                let nest: Nest = this.parent as Nest;
                this.nestPCounter = 0;
                this.stop();
                this.carrying = (this.target as FoodSource).createFood(0, 0, this);
                this.rotation = this.rotation + Math.PI;

                moveRandomly.execute(this, {
                    bounds: nest.bounds,
                    numPoints: 3,
                    time: 1,
                    delay: 0.5,
                    onCompleteFunction: () => {
                        this.behaviorState = BehaviorState.IDLE;
                        this.determineState();
                    },
                    onUpdateFunction: () => this.dropNestPheromone(nest.foodTrails, 200)
                });
                break;
            }
            default: {
                console.log("Not sure what to do!");
                break;
            }
        }
    }

    dropFoodPheromone(pMap: PheromoneMap, interval: number) {
        let now = Date.now();
        if (now - this.lastPheromoneTimestamp > interval) {
            this.lastPheromone = pMap.addPheromone(this, 1);
            this.lastPheromoneTimestamp = now;
        }
    }

    dropNestPheromone(pMap: PheromoneMap, interval: number) {
        let now = Date.now();
        //console.log("Trying to drop food pheromone! now: " + now + " lastP: " + this.lastPheromone + " diff: " + (now - this.lastPheromone) + " interval: " + interval);
        if (now - this.lastPheromoneTimestamp > interval) {
            this.lastPheromone = pMap.addPheromone(this, 1);
            this.lastPheromoneTimestamp = now;

            if (this.nestPCounter-- === 0) {
                this.lastPheromone = undefined;
            }
        }
    }

    drawInternal(): void {
        console.log("Drawing ant at " + this.x + ", " + this.y);
        this.g.beginFill(0x6688DD);
        this.g.drawRect(-3, 1, 3, 4);
        this.g.drawRect(-4, 2, 1, 2);
        this.g.drawRect(-8, 1, 4, 4);
        this.g.drawRect(-12, 2, 2, 2);
        this.g.drawRect(-15, 1, 6, 4);
        this.g.endFill();
    }

    logString(): string {
        return "behavior: ";
    }
}