import {entityRotationDiff, rotationDiffAbs, unwrapRads} from "../src/common/movement-utils";

test('unwrapRads 0 wrap arounds', () => {
    expect(unwrapRads(0)).toEqual(0);
    expect(unwrapRads(Math.PI)).toEqual(Math.PI);
    expect(unwrapRads(Math.PI * 2)).toEqual(0);
    expect(unwrapRads(Math.PI * 3)).toEqual(Math.PI);
    expect(unwrapRads(Math.PI * 4)).toEqual(0);
});

test('unwrapRads negative wrap arounds', () => {
    expect(unwrapRads(-1)).toEqual(-1);
    let _1degree = Math.PI/180;
    expect(unwrapRads(-_1degree)).toBeCloseTo(-_1degree, 5);
    let _181degrees = 181 * Math.PI/180;
    let _179degrees = 179 * Math.PI/180;
    expect(unwrapRads(-_181degrees)).toBeCloseTo(_179degrees, 5);
});

test('unwrapRads positive wrap arounds', () => {
    let _181degrees = 181 * Math.PI/180;
    let _179degrees = 179 * Math.PI/180;
    expect(unwrapRads(_181degrees)).toBeCloseTo(-_179degrees, 5);
    let _721degrees = 721 * Math.PI/180;
    let _1degree = Math.PI/180;
    expect(unwrapRads(_721degrees)).toBeCloseTo(_1degree, 5);
    let _541degrees = 541 * Math.PI/180;
    expect(unwrapRads(_541degrees)).toBeCloseTo(-_179degrees, 5);
});

test('rotationDiffAbs 90 degrees south', () => {
    let ant = {x: 100, y: 100, rotation: 0};
    let other = {x: 100, y: 200, rotation: 0};
    let _90degrees = 90 * Math.PI/180;
    expect(rotationDiffAbs(ant, other)).toBeCloseTo(_90degrees, 5);
});

test('rotationDiffAbs 90 degrees north', () => {
    let ant = {x: 100, y: 100, rotation: 0};
    let other = {x: 100, y: 0, rotation: 0};
    let _90degrees = 90 * Math.PI/180;
    expect(rotationDiffAbs(ant, other)).toBeCloseTo(_90degrees, 5);
});

test('rotationDiffAbs 179 degrees north', () => {
    let ant = {x: 100, y: 100, rotation: 0};
    let other = {x: 0, y: 99, rotation: 0};
    let _179degrees = 179.42 * Math.PI/180;
    expect(rotationDiffAbs(ant, other)).toBeCloseTo(_179degrees, 2);
});

test('rotationDiffAbs 179 degrees south', () => {
    let ant = {x: 100, y: 100, rotation: 0};
    let other = {x: 0, y: 101, rotation: 0};
    let _179degrees = 179.42 * Math.PI/180;
    expect(rotationDiffAbs(ant, other)).toBeCloseTo(_179degrees, 2);
});

test('rotationDiffAbs no diff', () => {
    let ant = {x: 100, y: 100, rotation: Math.PI};
    let other = {x: 0, y: 100, rotation: 0};
    expect(rotationDiffAbs(ant, other)).toBeCloseTo(0, 2);
});

test('rotationDiffAbs ant rotated 180', () => {
    let ant = {x: 100, y: 100, rotation: Math.PI};
    let other = {x: 0, y: 101, rotation: 0};
    expect(rotationDiffAbs(ant, other)).toBeCloseTo(0.0099, 3);
});

test('rotationDiffAbs ant rotated -179', () => {
    let _179degrees = 179.42 * Math.PI/180;
    let ant = {x: 100, y: 100, rotation: -_179degrees};
    let other = {x: 0, y: 101, rotation: 0};
    expect(rotationDiffAbs(ant, other)).toBeCloseTo(0.0201, 3);
});

test('rotationDiff ant rotated 90 degrees', () => {
    let ant = {x: 100, y: 100, rotation: 0};
    let other = {x: 100, y: 200, rotation: 0};
    let _90degrees = 90 * Math.PI/180;
    expect(entityRotationDiff(ant, other)).toBeCloseTo(_90degrees, 5);
});

test('rotationDiff ant rotated -90 degrees', () => {
    let ant = {x: 100, y: 100, rotation: 0};
    let other = {x: 100, y: 0, rotation: 0};
    let _90degrees = 90 * Math.PI/180;
    expect(entityRotationDiff(ant, other)).toBeCloseTo(-_90degrees, 5);
});

test('rotationDiff ant rotated 180', () => {
    let ant = {x: 100, y: 100, rotation: Math.PI};
    let other = {x: 0, y: 101, rotation: 0};
    expect(entityRotationDiff(ant, other)).toBeCloseTo(0.0099, 3);
});

test('rotationDiff ant rotated -179', () => {
    let _179degrees = 179.42 * Math.PI/180;
    let ant = {x: 100, y: 100, rotation: -_179degrees};
    let other = {x: 0, y: 101, rotation: 0};
    expect(entityRotationDiff(ant, other)).toBeCloseTo(-0.0201, 3);
});