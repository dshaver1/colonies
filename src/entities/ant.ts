import * as PIXI from 'pixi.js';
import {Entity, MovableEntity} from "../common/entity";
import {BehaviorState, followTrail, moveRandomly, moveToTarget} from "./behaviors";
import {gsap as gsapcore} from "gsap";
import {RoughEase} from "gsap/EasePack";
import {MotionPathPlugin} from "gsap/MotionPathPlugin";
import {Nest} from "./nest";
import {Pheromone} from "../types/pheromone";
import {PheromoneType} from "../types/pheromone-type";
import {FoodSource} from "./foodsource";
import {hit} from "../common/movement-utils";

gsapcore.registerPlugin(MotionPathPlugin);
gsapcore.registerPlugin(RoughEase);

export class ParticleAntContainer extends PIXI.Container {
    ants: Array<Ant> = [];
    antTexture: PIXI.Texture;

    constructor() {
        super();
        //super(10000, {rotation: true});
        this.antTexture = window.TEXTURES.ANT;
        (window.APP.stage as PIXI.Container).addChild(this);
    }

    addAnt(nest: Nest): Ant {
        let ant: Ant = new Ant(this.antTexture, nest);
        ant.name = `ant-${this.ants.length}`;
        this.ants.push(ant);
        this.addChild(ant);

        return ant;
    }

    removeAnt(ant: Ant) {
        this.removeChild(ant);
        this.ants = this.ants.filter(a => a !== ant);
        ant.destroy();
    }

    update(delta: number): void {
        this.ants.forEach(ant => ant.update(delta));
    }
}

export class Ant extends MovableEntity<Nest> {
    lastPheromoneTimestamp: number = Date.now();
    lastStateCheck: number = Date.now();
    lastPheromone: Pheromone;
    currentP: Pheromone;
    nestPCounter: number = 20;
    carrying: Entity<any>;
    target: Entity<any>;

    constructor(texture: PIXI.Texture, nest: Nest) {
        super(nest.x, nest.y, texture, nest);
        this.behaviorState = BehaviorState.SEARCHING;
        this.rotation = (Math.random() - 0.5) * Math.PI * 2;
    }

    update(delta: number) {
        this.behaviorState = this.determineState();
        this.evaluate(this.behaviorState);
    }

    determineState(): BehaviorState {
        if (!this.carrying && this.behaviorState !== BehaviorState.PICKUP_FOOD) {
            window.GAME.foodSources.forEach(foodSource => {
                if (hit(this, foodSource)) {
                    console.log("New food hit!");
                    this.behaviorState = BehaviorState.PICKUP_FOOD;
                    this.target = foodSource;
                }
            });
        }

        if (this.carrying) {
            if (hit(this, this.parentRef)) {
                console.log("New nest hit!");
                this.stopCarrying();
                this.behaviorState = BehaviorState.SEARCHING;
            }
        }

        return this.behaviorState;
    }

    evaluate(state: BehaviorState): void {
        switch (state) {
            case BehaviorState.SEARCHING:
                //console.log("Searching!");
                moveRandomly.execute(this, {
                    bounds: window.BOUNDS,
                    numPoints: 10,
                    time: 3,
                    delay: 0.01,
                    onCompleteFunction: () => {
                        this.behaviorState = BehaviorState.SEARCHING;
                        this.determineState();
                    },
                    onUpdateFunction: () => {
                        if (this.nestPCounter >= 0) {
                            this.dropPheromone(100)
                        }

                        this.checkPheromones();
                    }
                });
                this.behaviorState = BehaviorState.IDLE;
                break;
            case BehaviorState.TARGET_MOVE: {
                console.log("TARGET_MOVE!");
                moveToTarget.execute(this, {
                    target: this.target,
                    bounds: window.BOUNDS,
                    numPoints: 3,
                    time: 1,
                    delay: 0,
                    onCompleteFunction: () => {
                        this.checkPheromones(true);
                        this.determineState();
                    },
                    onUpdateFunction: () => {
                        if (this.carrying || this.nestPCounter >= 0) {
                            this.dropPheromone(100);
                        }

                        if (Date.now() - this.lastStateCheck > 100) {
                            this.determineState();
                        }
                    }
                });
                break;
            }
            case BehaviorState.PICKUP_FOOD: {
                console.log("PICKUP_FOOD!");
                this.lastPheromone = undefined;
                this.nestPCounter = 0;
                this.stop();
                this.carrying = (this.target as FoodSource).createFood(0, 0, this);
                this.target = undefined;
                this.rotation = this.rotation + Math.PI;

                let p = this.checkPheromones(true);

                if (!p) {
                    moveRandomly.execute(this, {
                        bounds: window.BOUNDS,
                        numPoints: 2,
                        time: 1,
                        delay: 0.5,
                        onCompleteFunction: () => {
                            this.behaviorState = BehaviorState.SEARCHING;
                            this.determineState();
                        },
                        onUpdateFunction: () => this.dropPheromone(100)
                    });
                }
                break;
            }
            case BehaviorState.FOLLOWING_TRAIL:
                if (this.currentP) {
                    console.log(`Following trail! pValue: ${this.currentP.p}`);

/*                    followTrail.execute(this, {
                        bounds: window.BOUNDS,
                        pheromone: this.currentP,
                        numPoints: 5,
                        delay: 0.5,
                        onCompleteFunction: () => {
                            this.behaviorState = BehaviorState.SEARCHING;
                            this.determineState();
                        },
                        onUpdateFunction: () => this.dropPheromone(100)
                    });*/
                }
                break;
            case BehaviorState.IDLE:
                break;
        }
    }

    dropPheromone(interval: number) {
        if (this.outputPType() === PheromoneType.FOOD) {
            this.dropFoodPheromone(interval);
        } else {
            this.dropNestPheromone(interval);
        }
    }

    dropFoodPheromone(interval: number) {
        let now = Date.now();
        if (now - this.lastPheromoneTimestamp > interval) {
            this.lastPheromone = window.SURFACE.antGrid.addPheromone(this, 1);
            this.lastPheromoneTimestamp = now;
        }
    }

    dropNestPheromone(interval: number) {
        let now = Date.now();
        //console.log("Trying to drop food pheromone! now: " + now + " lastP: " + this.lastPheromone + " diff: " + (now - this.lastPheromone) + " interval: " + interval);
        if (now - this.lastPheromoneTimestamp > interval) {
            this.lastPheromone = window.SURFACE.antGrid.addPheromone(this, 1);
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

    checkPheromones(force: boolean = false): Pheromone {
        let now: number = Date.now();
        if (force || now - this.lastStateCheck > 200) {
            this.lastStateCheck = now;
            console.log(`Checking for ${PheromoneType[this.inputPType()]} pheromones...`)

            this.currentP = window.SURFACE.antGrid.currentP(this, this.inputPType());

            if (this.currentP) {
                this.behaviorState = BehaviorState.FOLLOWING_TRAIL;

                return this.currentP;
            }

            let nearbyP: Pheromone[] = window.SURFACE.antGrid.nearbyP(this, this.inputPType());

            if (nearbyP && nearbyP.length > 0) {
                this.target = nearbyP[0];
                this.behaviorState = BehaviorState.TARGET_MOVE;
                this.stop();
                return nearbyP[0];
            }

            this.determineState();
        }
    }

    inputPType() {
        if (this.carrying) {
            return PheromoneType.NEST;
        }

        return PheromoneType.FOOD;
    }

    outputPType() {
        if (this.carrying) {
            return PheromoneType.FOOD;
        }

        return PheromoneType.NEST;
    }

    logString(): string {
        return this.name;
    }
}

/*
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
 */