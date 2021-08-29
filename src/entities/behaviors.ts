import {BoundingBox, Entity, MovableEntity} from "../common/entity";
import {gsap} from "gsap";
import {RoughEase} from "gsap/EasePack";
import {MotionPathPlugin} from "gsap/MotionPathPlugin";
import {goToPheromonePath, buildSearchPath, followPheromonePath} from "../common/movement-utils";
import {Location2D} from "../common/location";
import {Pheromone} from "../types/pheromone";
import Callback = gsap.Callback;

gsap.registerPlugin(MotionPathPlugin);
gsap.registerPlugin(RoughEase);

export interface Behavioral {
    behaviorState: BehaviorState;

    /**
     * Statically determine, based on current entity state, what behavior state it is in.
     */
    determineState(): BehaviorState;

    /**
     * Given a particular BehaviorState, what should the entity do during the update?
     * @param state The entity's current behavior state.
     */
    evaluate(state: BehaviorState): void;
}

export interface Behavior<E extends Entity<any>, V extends BehaviorVars> {
    execute(entity: E, vars: V): void;
}

export enum BehaviorState {
    IDLE, TARGET_MOVE, SEARCHING, MOVING, PICKUP_FOOD, LOOKING_FOR_TRAIL, FOLLOWING_TRAIL
}

export interface BehaviorVars {
    onCompleteFunction?: Callback
    onUpdateFunction?: Callback
    bounds?: BoundingBox
}

export interface MoveRandomlyVars extends BehaviorVars {
    numPoints: number
    time: number
    delay?: number
}

export class MoveRandomly implements Behavior<MovableEntity<any>, MoveRandomlyVars> {
    execute(entity: MovableEntity<any>, vars: MoveRandomlyVars) {
        stop();
        entity.behaviorState = BehaviorState.MOVING;

        let path = buildSearchPath(entity, vars.numPoints, [], vars.bounds);

        path.filter(point => {
            if (point.x && point.y && point.x !== 0 && point.y !== 0) {
                return true;
            } else {
                console.log("Found an undefined or 0,0 point!");
                return false;
            }
        });

        if (window.DEBUG) {
            window.DEBUG_GRAPHICS.clear(entity.name);
            for (let i = 1; i < path.length; i++) {
                let p1 = entity.parent.toGlobal(path[i - 1]);
                let p2 = entity.parent.toGlobal(path[i]);

                window.DEBUG_GRAPHICS.getGraphics(entity.name).lineStyle(1, 0x203d87)
                    .moveTo(p1.x, p1.y)
                    .lineTo(p2.x, p2.y);
            }
        }

        if (entity.renderable) {
            entity.tween = gsap.to(entity, {
                duration: vars.time,
                delay: vars.delay,
                ease: "rough({template:none.out,strength:0.2,points:10,taper:'both',randomize: true,clamp: false})",
                motionPath: {
                    path: path,
                    type: 'linear',
                    autoRotate: true,
                    useRadians: true,
                    curviness: 0.5
                },
                onComplete: vars.onCompleteFunction,
                onUpdate: vars.onUpdateFunction,
                callbackScope: this
            });
        } else {
            entity.checkRenderable();
            let endPoint = path[path.length - 1];
            setTimeout(() => {
                entity.x = endPoint.x;
                entity.y = endPoint.y;
                entity.rotation = endPoint.rotation;
                entity.behaviorState = BehaviorState.SEARCHING;
            }, vars.time * 1000)
        }
    }
}

export interface MoveToTargetVars extends BehaviorVars {
    numPoints: number
    time: number
    target: Location2D
    delay?: number
}

export class MoveToTarget implements Behavior<MovableEntity<any>, MoveToTargetVars> {
    execute(entity: MovableEntity<any>, vars: MoveToTargetVars) {
        stop();
        entity.behaviorState = BehaviorState.MOVING;

        let path = goToPheromonePath(entity, entity.target as Pheromone)

        if (window.DEBUG) {
            window.DEBUG_GRAPHICS.clear(entity.name);
            for (let i = 1; i < path.length; i++) {
                let p1 = entity.parent.toGlobal(path[i - 1]);
                let p2 = entity.parent.toGlobal(path[i]);

                window.DEBUG_GRAPHICS.getGraphics(entity.name).lineStyle(1, 0x203d87)
                    .moveTo(p1.x, p1.y)
                    .lineTo(p2.x, p2.y);
            }
        }

        entity.tween = gsap.to(entity, {
            duration: vars.time,
            delay: vars.delay,
            ease: "rough({template:none.out,strength:0.2,points:10,taper:'both',randomize: true,clamp: false})",
            motionPath: {
                path: path,
                type: 'linear',
                autoRotate: true,
                useRadians: true,
                curviness: 0.5
            },
            onComplete: vars.onCompleteFunction,
            onUpdate: vars.onUpdateFunction,
            callbackScope: this
        });
    }
}

export interface FollowTrailVars extends BehaviorVars {
    numPoints: number
    pheromone: Pheromone
    delay?: number
}

export class FollowTrail implements Behavior<MovableEntity<any>, FollowTrailVars> {
    execute(entity: MovableEntity<any>, vars: FollowTrailVars) {
        stop();
        entity.behaviorState = BehaviorState.MOVING;

        let path = followPheromonePath(entity, vars.pheromone)

        if (window.DEBUG) {
            window.DEBUG_GRAPHICS.clear(entity.name);
            for (let i = 1; i < path.length; i++) {
                let p1 = entity.parent.toGlobal(path[i - 1]);
                let p2 = entity.parent.toGlobal(path[i]);

                window.DEBUG_GRAPHICS.getGraphics(entity.name).lineStyle(1, 0x203d87)
                    .moveTo(p1.x, p1.y)
                    .lineTo(p2.x, p2.y);
            }
        }

        entity.tween = gsap.to(entity, {
            duration: vars.numPoints / 3,
            delay: vars.delay,
            ease: "rough({template:none.out,strength:0.2,points:10,taper:'both',randomize: true,clamp: false})",
            motionPath: {
                path: path,
                type: 'linear',
                autoRotate: true,
                useRadians: true,
                curviness: 0.5
            },
            onComplete: vars.onCompleteFunction,
            onUpdate: vars.onUpdateFunction,
            callbackScope: this
        });
    }
}

export const moveRandomly: MoveRandomly = new MoveRandomly();
export const moveToTarget: MoveToTarget = new MoveToTarget();
export const followTrail: FollowTrail = new FollowTrail();
