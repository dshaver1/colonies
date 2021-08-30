import {entityRotationDiff, rotationDiffAbs, unwrapRads} from "../src/common/movement-utils";

test('antGrid.getIndex()', () => {

    let _179degrees = 179.42 * Math.PI/180;
    let ant = {x: 100, y: 100, rotation: -_179degrees};
    let other = {x: 0, y: 101, rotation: 0};
    expect(entityRotationDiff(ant, other)).toBeCloseTo(-0.0201, 3);
});