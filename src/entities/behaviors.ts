import {BoundingBox, Entity, MovableEntity} from "../generics/entity";
import {gsap} from "gsap";
import {RoughEase} from "gsap/EasePack";
import {MotionPathPlugin} from "gsap/MotionPathPlugin";
import Callback = gsap.Callback;
import {buildPath} from "../generics/movement-utils";
import {Location2D} from "../generics/location";

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

export interface Behavior<E extends Entity, V extends BehaviorVars> {
    execute(entity: E, vars: V): void;
}

export enum BehaviorState {
    IDLE, TARGET_MOVE, SEARCHING, MOVING, PICKUP_FOOD, LOOKING_FOR_TRAIL
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

export class MoveRandomly implements Behavior<MovableEntity, MoveRandomlyVars> {
    execute(entity: MovableEntity, vars: MoveRandomlyVars) {
        stop();
        entity.behaviorState = BehaviorState.MOVING;

        let path = buildPath(entity, vars.numPoints, [], vars.bounds);

        if (window.DEBUG) {
            window.DEBUG_GRAPHICS.getGraphics(entity.name).clear();
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

export interface MoveToTargetVars extends BehaviorVars {
    numPoints: number
    time: number
    target: Location2D
    delay?: number
}

export class MoveToTarget implements Behavior<MovableEntity, MoveToTargetVars> {
    execute(entity: MovableEntity, vars: MoveToTargetVars) {
        stop();
        entity.behaviorState = BehaviorState.MOVING;

        let path = buildPath(entity, vars.numPoints, [], vars.bounds);

        if (window.DEBUG) {
            window.DEBUG_GRAPHICS.getGraphics(entity.name).clear();
            for (let i = 1; i < path.length; i++) {
                let p1 = path[i - 1];
                let p2 = path[i];

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

export const moveRandomly: MoveRandomly = new MoveRandomly();
