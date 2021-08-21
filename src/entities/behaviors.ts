import {Entity} from "../generics/entity";
import {gsap} from "gsap";
import Callback = gsap.Callback;
import {buildPath} from "../generics/movement-utils";

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

export interface Behavior<T extends BehaviorVars> {
    execute(entity: Entity, args: T): void;
}

export enum BehaviorState {
    IDLE, TARGET_MOVE, SEARCHING, MOVING
}

export interface BehaviorVars {
    completionBehavior?: BehaviorState
    onUpdateFunction?: Callback
}

export interface MoveRandomlyVars extends BehaviorVars {
    numPoints: number
    time: number
    delay?: number
}

export class MoveRandomly implements Behavior<MoveRandomlyVars> {
    execute(entity: Entity, args: MoveRandomlyVars) {
        entity.behaviorState = BehaviorState.MOVING;

        let path = buildPath(entity, args.numPoints, [], window.BOUNDS);

        entity.debugGraphics.clear();
        if (window.DEBUG) {
            for (let i = 1; i < path.length; i++) {
                let p1 = path[i - 1];
                let p2 = path[i];

                entity.debugGraphics.lineStyle(1, 0x203d87)
                    .moveTo(p1.x, p1.y)
                    .lineTo(p2.x, p2.y);
            }
        }

        entity.tween = gsap.to(entity, {
            duration: args.time,
            delay: args.delay,
            ease: "rough({template:none.out,strength:0.2,points:10,taper:'both',randomize: true,clamp: false})",
            motionPath: {
                path: path,
                type: 'linear',
                autoRotate: true,
                useRadians: true,
                curviness: 0.5
            },
            onComplete: function () {
                this.behavior = args.completionBehavior;
                console.log("search path complete! new behavior: " + args.completionBehavior);
            },
            onUpdate: args.onUpdateFunction,
            callbackScope: this
        });
    }
}

export const moveRandomly: MoveRandomly = new MoveRandomly();
