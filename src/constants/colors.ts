import {Color} from "../common/color";
import {PheromoneType} from "../types/pheromone-type";

export namespace Colors {
    export const ANT_COLOR = new Color('#6688DD');
    export const FOOD_COLOR = new Color('#dbde23');
    export const FOOD_P_COLOR = new Color('#64d916');
    export const NEST_COLOR = new Color('#9966FF');
    export const NEST_P_COLOR = new Color('#ff4444');
    export const BACKGROUND_COLOR = new Color('#061639');

    export function pheromoneColor(type: PheromoneType) {
        switch(type) {
            case PheromoneType.FOOD:
                return FOOD_P_COLOR;
            case PheromoneType.NEST:
                return NEST_P_COLOR;
        }
    }
}