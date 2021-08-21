const {Pheromone} = require("../src/types/pheromone");

test('Pheromone test', () => {
    let p = new Pheromone(0,0,1);
    let nextP = new Pheromone(100,100,1);
    p.next = nextP;

    expect(nextP).toEqual(p.next);
});