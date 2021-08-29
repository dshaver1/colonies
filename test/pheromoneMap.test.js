const {Pheromone} = require("../src/types/pheromone");
const {AntGrid} = require("../src/types/antGrid");
const {Color} = require("../src/common/color");
const {Nest} = require("../src/entities/nest");
const {Game} = require("../src/types/game");
const PIXI = require("pixi.js");
const webglMock = require('jest-webgl-canvas-mock');
const {Textures} = require("../src/constants/textures");
const {Surface} = require("../src/types/surface");
const {PheromoneType} = require("../src/types/pheromone-type");

let nest, pheromoneMap;

beforeAll(() => {
    PIXI.settings.FAIL_IF_MAJOR_PERFORMANCE_CAVEAT = false;
    window.APP = new PIXI.Application({
        width: 1000,
        height: 1000
    });
    window.P_CELL_SIZE = 20;
    window.NEST_COLOR = new Color("#00FF00");
    window.FOOD_P_COLOR = new Color("#FF0000");
    window.NEST_P_COLOR = new Color("#FF00FF");
    window.ANT_COLOR = new Color("#FF00DF");
    window.TEXTURES = new Textures();
    window.SURFACE = new Surface(window.BOUNDS, window.ANT_COLOR, this);
    pheromoneMap = new AntGrid( 20);
    pheromoneMap.init(1000, 1000);
    window.SURFACE.antGrid = pheromoneMap;
    nest = new Nest(500, 500);
})

test('getBucket(0,0)', () => {
    let bucket = pheromoneMap.getBucketAtPosition(0,0);
    expect(bucket.x).toEqual(10);
    expect(bucket.y).toEqual(10);
});

test('getBucket(10,0)', () => {
    let bucket = pheromoneMap.getBucketAtPosition(10,0);
    expect(bucket.x).toEqual(10);
    expect(bucket.y).toEqual(10);
});

test('getBucket(15,0)', () => {
    let bucket = pheromoneMap.getBucketAtPosition(15,0);
    expect(bucket.x).toEqual(10);
    expect(bucket.y).toEqual(10);
});

test('getBucket(5,5)', () => {
    let bucket = pheromoneMap.getBucketAtPosition(5,5);
    expect(bucket.x).toEqual(10);
    expect(bucket.y).toEqual(10);
});

test('getBucket(15,15)', () => {
    let bucket = pheromoneMap.getBucketAtPosition(15,15);
    expect(bucket.x).toEqual(10);
    expect(bucket.y).toEqual(10);
});

test('getBucket(20,0)', () => {
    let bucket = pheromoneMap.getBucketAtPosition(20,0);
    expect(bucket.x).toEqual(30);
    expect(bucket.y).toEqual(10);
});

test('getBucket(25,25)', () => {
    let bucket = pheromoneMap.getBucketAtPosition(25,25);
    expect(bucket.x).toEqual(30);
    expect(bucket.y).toEqual(30);
});

test('nearbyP values should be sorted by pheromone value.', () => {
    let ant = nest.addAnt();
    pheromoneMap.addPheromone(ant, 1);
    ant.x = 100;
    ant.y = 100;
    pheromoneMap.addPheromone(ant, 1);
    ant.x = 110;
    ant.y = 110;
    pheromoneMap.addPheromone(ant, 1);
    ant.x = 120;
    ant.y = 120;
    pheromoneMap.addPheromone(ant, 1);
    let nearby = pheromoneMap.nearbyP(ant, PheromoneType.NEST);

    expect(nearby.length).toEqual(2);
    expect(nearby[0].p).toEqual(2);
    expect(nearby[1].p).toEqual(1);

    nest.deleteAnt(ant);
});

test('nearbyP() should return values for all 9 adjacent buckets', () => {
    let ant = nest.addAnt();
    ant.x = 90;
    ant.y = 90;
    pheromoneMap.addPheromone(ant, 10);
    ant.x = 90;
    ant.y = 110;
    pheromoneMap.addPheromone(ant, 1);
    ant.x = 90;
    ant.y = 130;
    pheromoneMap.addPheromone(ant, 1);
    ant.x = 110;
    ant.y = 90;
    pheromoneMap.addPheromone(ant, 1);
    ant.x = 110;
    ant.y = 110;
    pheromoneMap.addPheromone(ant, 1);
    ant.x = 110;
    ant.y = 130;
    pheromoneMap.addPheromone(ant, 1);
    ant.x = 130;
    ant.y = 90;
    pheromoneMap.addPheromone(ant, 1);
    ant.x = 130;
    ant.y = 110;
    pheromoneMap.addPheromone(ant, 1);
    ant.x = 130;
    ant.y = 130;
    pheromoneMap.addPheromone(ant, 1);
    ant.x = 110;
    ant.y = 110;
    let nearby = pheromoneMap.nearbyP(ant);

    expect(nearby.length).toEqual(9);
    expect(nearby[0].p).toEqual(10);
    expect(nearby[0].x).toEqual(90);
    expect(nearby[0].y).toEqual(90);

    nest.deleteAnt(ant);
});