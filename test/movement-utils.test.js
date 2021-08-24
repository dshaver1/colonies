import {rotationDiff, unwrapRads} from "../src/common/movement-utils";

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

test('rotationDiff 90 degrees south', () => {
    let ant = {x: 100, y: 100, rotation: 0};
    let other = {x: 100, y: 200, rotation: 0};
    let _90degrees = 90 * Math.PI/180;
    expect(rotationDiff(ant, other)).toBeCloseTo(_90degrees, 5);
});

test('rotationDiff 90 degrees north', () => {
    let ant = {x: 100, y: 100, rotation: 0};
    let other = {x: 100, y: 0, rotation: 0};
    let _90degrees = 90 * Math.PI/180;
    expect(rotationDiff(ant, other)).toBeCloseTo(_90degrees, 5);
});

test('rotationDiff 179 degrees north', () => {
    let ant = {x: 100, y: 100, rotation: 0};
    let other = {x: 0, y: 99, rotation: 0};
    let _179degrees = 179.42 * Math.PI/180;
    expect(rotationDiff(ant, other)).toBeCloseTo(_179degrees, 2);
});

test('rotationDiff 179 degrees south', () => {
    let ant = {x: 100, y: 100, rotation: 0};
    let other = {x: 0, y: 101, rotation: 0};
    let _179degrees = 179.42 * Math.PI/180;
    expect(rotationDiff(ant, other)).toBeCloseTo(_179degrees, 2);
});

test('rotationDiff no diff', () => {
    let ant = {x: 100, y: 100, rotation: Math.PI};
    let other = {x: 0, y: 100, rotation: 0};
    expect(rotationDiff(ant, other)).toBeCloseTo(0, 2);
});