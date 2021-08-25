import {Color} from "../common/color";
import {Behavioral, BehaviorState, moveRandomly, moveToTarget} from "./behaviors";
import {Nest} from "./nest";
import {Entity, MovableEntity} from "../common/entity";
import {Pheromone, PheromoneType} from "../types/pheromone";
import {hit} from "../common/movement-utils";
import {FoodSource} from "./foodsource";

const detectHomeRange = 25;

export class Ant extends MovableEntity<Nest> implements Behavioral {
    lastPheromoneTimestamp: number = Date.now();
    lastStateCheck: number = Date.now();
    lastPheromone: Pheromone;
    nestPCounter: number = 10;
    carrying: Entity<any>;
    target: Entity<any>;

    constructor(x: number, y: number, color: Color, parent: Nest) {
        super(x, y, color, parent);
        this.rotation = (Math.random() - 0.5) * Math.PI * 2;
    }

    update(delta: number) {
        if (this.isNearHome()) {
            this.nestPCounter = 10;

            if (this.carrying) {
                this.stopCarrying();
                this.behaviorState = BehaviorState.IDLE;
            }
        }

        this.evaluate(this.behaviorState);
    }


    private isNearHome(): boolean {
        return (this.x < detectHomeRange && this.x > -detectHomeRange) && (this.y < detectHomeRange && this.y > -detectHomeRange);
    }

    determineState(): BehaviorState {
        this.lastStateCheck = Date.now();
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

        //console.log("New state: " + this.behaviorState);

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
                    onUpdateFunction: () => this.dropNestPheromone(200)
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
                            this.dropNestPheromone(400)
                        }

                        let now: number = Date.now()
                        if (now - this.lastStateCheck > 400) {
                            this.lastStateCheck = now;
                            let nearbyP: Pheromone[] = window.SURFACE.antGrid.nearbyP(this, PheromoneType.FOOD);

                            if (nearbyP && nearbyP.length > 0) {
                                this.target = nearbyP[0];
                                this.behaviorState = BehaviorState.TARGET_MOVE;
                                this.stop();
                                return;
                            }

                            this.determineState();
                        }
                    }
                });
                break;
            }
            case BehaviorState.TARGET_MOVE: {
                console.log("TARGET_MOVE!");
                moveToTarget.execute(this, {
                    target: this.target,
                    bounds: this.parentRef.bounds,
                    numPoints: 3,
                    time: 0.2,
                    delay: 0,
                    onCompleteFunction: () => {
                        this.behaviorState = BehaviorState.LOOKING_FOR_TRAIL;
                        this.determineState();
                    },
                    onUpdateFunction: () => {
                        if (this.carrying) {
                            this.dropFoodPheromone(200);
                        } else if (this.nestPCounter >= 0) {
                            this.dropNestPheromone(200);
                        }

                        if (Date.now() - this.lastStateCheck > 100) {
                            this.determineState();
                        }
                    }
                });
                break;
            }
            case BehaviorState.MOVING: {
                //console.log("MOVING!");
                break;
            }
            case BehaviorState.PICKUP_FOOD: {
                console.log("PICKUP_FOOD!");
                this.lastPheromone = undefined;
                this.nestPCounter = 0;
                this.stop();
                this.carrying = (this.target as FoodSource).createFood(0, 0, this);
                this.rotation = this.rotation + Math.PI;

                moveRandomly.execute(this, {
                    bounds: this.parentRef.bounds,
                    numPoints: 2,
                    time: 1,
                    delay: 0.5,
                    onCompleteFunction: () => {
                        this.behaviorState = BehaviorState.LOOKING_FOR_TRAIL;
                        this.determineState();
                    },
                    onUpdateFunction: () => this.dropFoodPheromone(200)
                });
                break;
            }
            case BehaviorState.LOOKING_FOR_TRAIL: {
                console.log("LOOKING_FOR_TRAIL!");
                let pType: PheromoneType = this.carrying ? PheromoneType.NEST : PheromoneType.FOOD;
                let nearbyP: Pheromone[] = window.SURFACE.antGrid.nearbyP(this, pType);

                if (nearbyP && nearbyP.length > 0) {
                    this.stop();
                    this.target = nearbyP[0];
                    this.behaviorState = BehaviorState.TARGET_MOVE;
                    break;
                }

                moveRandomly.execute(this, {
                    bounds: this.parentRef.bounds,
                    numPoints: 5,
                    time: 1.5,
                    delay: 0.01,
                    onCompleteFunction: () => {
                        this.behaviorState = BehaviorState.LOOKING_FOR_TRAIL;
                        this.determineState();
                    },
                    onUpdateFunction: () => {
                        if (this.carrying) {
                            this.dropFoodPheromone(200)
                        }

                        let now: number = Date.now()
                        if (now - this.lastStateCheck > 400) {
                            this.lastStateCheck = now;
                            let nearbyP: Pheromone[] = window.SURFACE.antGrid.nearbyP(this, pType);

                            if (nearbyP && nearbyP.length > 0) {
                                this.target = nearbyP[0];
                                this.behaviorState = BehaviorState.TARGET_MOVE;
                                this.stop();
                            }
                        }
                    }
                });

                break;
            }
            default: {
                console.log("Not sure what to do!");
                break;
            }
        }
    }

    dropFoodPheromone(interval: number) {
        let now = Date.now();
        if (now - this.lastPheromoneTimestamp > interval) {
            this.lastPheromone = window.SURFACE.antGrid.addPheromone(this, PheromoneType.FOOD, 1);
            this.lastPheromoneTimestamp = now;
        }
    }

    dropNestPheromone(interval: number) {
        let now = Date.now();
        //console.log("Trying to drop food pheromone! now: " + now + " lastP: " + this.lastPheromone + " diff: " + (now - this.lastPheromone) + " interval: " + interval);
        if (now - this.lastPheromoneTimestamp > interval) {
            this.lastPheromone = window.SURFACE.antGrid.addPheromone(this, PheromoneType.NEST, 1);
            this.lastPheromoneTimestamp = now;

            if (this.nestPCounter-- === 0) {
                this.lastPheromone = undefined;
            }
        }
    }

    stopCarrying() {
        if (this.carrying) {
            console.log("Dropping!");
            this.removeChild(this.carrying);
            this.carrying = undefined;
            this.stop();
            this.rotation += Math.PI;
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