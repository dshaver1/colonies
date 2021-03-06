const {Pheromone} = require("../src/types/pheromone");
const {AntGrid} = require("../src/types/antGrid");
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
    nest = new Nest(500, 500);
    pheromoneMap = new AntGrid("nest", 20, new Color("#ffffff"), nest);
    pheromoneMap.init(1000, 1000);
})

test('add and delete an ant', () => {
    let ant = nest.addAnt();

    expect(nest.ants.length).toEqual(1);
    expect(nest.getChildAt(5)).toBeDefined();

    nest.deleteAnt(ant);

    expect(nest.ants.length).toEqual(0);
    expect(() => nest.getChildAt(5)).toThrowError('does not exist');
});