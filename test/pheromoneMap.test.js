const {Pheromone} = require("../src/types/pheromone");
const {PheromoneMap} = require("../src/types/pheromoneMap");
const {Color} = require("../src/common/color");
const {Nest} = require("../src/entities/nest");
const {Game} = require("../src/types/game");
const PIXI = require("pixi.js");
const webglMock = require('jest-webgl-canvas-mock');

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
    nest = new Nest(500, 500, 1);
    pheromoneMap = new PheromoneMap("nest", 20, new Color("#ffffff"), nest);
    pheromoneMap.init(1000, 1000);
})

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
    let nearby = pheromoneMap.nearbyP(ant);

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