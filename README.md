# The Colonies

### TODO

- switch to using filters for ant movement?
- pheromones should be applied on a grid and added to each other to avoid having a billion points of pheromone.

### Summary

Ant colony game in which the player creates progressively more evolved colonies of ants to take over the world.

### In the beginning

The player starts with a queen and that's all. The player must start to lay eggs, choosing how long to incubate the eggs to produce the optimal size/number of workers.

### Interaction

The player can only directly control the queen. All other ants behave autonomously. The player can influence behavior of the other ants via a 'god' function of placing pheremones. Using this function costs resources.

### Resources

- Food. The main resource in the game is food. You can use food to expand your current colony, or save it up to spawn alates and thus prestige.
- Pheremone reserve. This is the 'god' function that allows the player to directly place pheremones into the world. Pheremone reserves are created from food, but also regenerate slowly.
- Evolution orbs. These allow the player to select new traits upon prestiging. Evolution orbs are awarded based on the number of alates produced over the lifetime of the colony.

### Goals

The goal of each run is survive and collect as much food as possible.

### Conflict

There will be enemies. Spiders, humans, beetles, and other ant colonies.

### Prestige

The theme of the prestige phase of the game should be that of spawning alates and founding a new colony. The more alates spawned, the more evolution points will be acquired. Thus, the full gameplay cycle goes: Queen produces workers. Workers collect food. Food is converted into alates. Alates are converted into evolution points.

The player should be able to select new traits utilizing evolution points. After selecting new traits, the gameplay will start over at the beginning with a new queen and a new map.

### Inspiration

- Sim Ant
- Melvor Idle

---
## Phase 0


Focus on core colony gameplay.

- [ ] Foraging behavior with pheromones
- [ ] Adding food to colony
- [ ] Avoid Math.random() every tick on ant movement. Instead, generate 
- [ ] Camera controls (pixi-viewport)
- [ ] Laying eggs
- [ ] Eggs need to consume food
- [ ] Basic enemies

---
## Phase 1


Focus on prestige/evolution

- [ ] Basic prestige mechanics via spawning alates
- [ ] Obtaining new traits based on actions the colony takes
- [ ] Accruing evolution points based on how many alates spawned
- [ ] Spending evolution points to get new traits

---
## Phase 2

Focus on content rather than mechanics. Traits, maps, enemies.

---
## Phase 3

Focus on the big picture. What happens to old colonies once you prestige? 

---
## References


[Pixi.js github](https://github.com/pixijs/pixijs)

[Pixi.js guides](https://pixijs.io/guides/)

[Pixi.js intro](https://github.com/kittykatattack/learningPixi#introduction)

[Sim Ant browser game](https://archive.org/details/msdos_SimAnt_-_The_Electronic_Ant_Colony_1991)

[Bootstrapping tutorial](https://medium.com/anvoevodin/how-to-set-up-pixijs-v5-project-with-npm-and-webpack-41c18942c88d)

[Ant colony simulation](https://www.youtube.com/watch?v=X-iSQQgOd1A)

[Ant colony simulation 2](https://www.youtube.com/watch?v=81GQNPJip2Y&t=0s)

[Using matter-js with pixi](https://github.com/Coder2012/pixi/tree/master/spaceshooter/src/js)

[Example from Pixi dev](https://codesandbox.io/s/smoosh-river-fie1l?file=/src/levels/circles.js)

[Example of recommended app architecture](https://codesandbox.io/s/app-architecture-3-j0di5?file=/src/entity.js)

[pixi-viewport](https://github.com/davidfig/pixi-viewport)

[Tips for using GSAP](https://css-tricks.com/tips-for-writing-animation-code-efficiently/)

[green sock pixi plugin](https://greensock.com/js-pixiplugin/)

[Guide on shaders in pixi](https://www.youtube.com/watch?v=wIC-CqsUplw)

[shadertoy](https://www.shadertoy.com/view/WtjGRc)

[shockwave filter (uses time component to move pixels...)](https://github.com/pixijs/filters/blob/main/filters/shockwave/src/shockwave.frag)

[timer plugin](https://github.com/soimy/eventemitter3-timer)

[xstate - state machine for js](https://github.com/statelyai/xstate)

[Spatial Hashing](https://www.gamedev.net/tutorials/_/technical/game-programming/spatial-hashing-r2697/)


---
## Build Stuff


Install dependencies:
```
npm i
```

Run on http://localhost:3000:
```
npm start
```

#### Building

Development build:
```
npm run build
```

Production build:
```
npm run production
```