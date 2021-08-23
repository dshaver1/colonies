import {Application, Point} from 'pixi.js'
import {Bucket} from "./bucket";
import {Color} from "../generics/color";
import {Pheromone} from "./pheromone";
import {Entity} from "../generics/entity";
import {BehaviorState} from '../entities/behaviors';
import {Location2D} from "../generics/location";
import {Ant} from "../entities/ant";

export class PheromoneMap extends Entity {
    readonly _map: Array<Array<Bucket>>;
    readonly _name: string;
    readonly _cellSize: number;
    readonly _halfCell: number;
    readonly _color: number;
    readonly _alphaFactor: number;
    _numColumns: number;
    _numRows: number;
    lastDecayTimestamp: number = Date.now();
    nextDecayIdx: number;

    constructor(name: string, cellSize: number, color: Color, parent?: Entity) {
        super(0, 0, parent);
        console.log("Creating pheromone map...");
        this._name = name;
        this._map = [];
        this._cellSize = cellSize;
        this._halfCell = cellSize / 2;
        this._color = color.color;
        this._alphaFactor = 0.01;
        this.nextDecayIdx = 0;
        this.addToParent(parent);
    }

    init(app: Application) {
        this._numColumns = Math.ceil(app.screen.width / this._cellSize);
        this._numRows = Math.ceil(app.screen.height / this._cellSize);

        try {
            for (let col = 0; col < this._numColumns; col++) {
                //console.log("Creating column " + col);
                this._map[col] = [];
                for (let row = 0; row < this._numRows; row++) {
                    this._map[col][row] = new Bucket(col * this._cellSize + this._halfCell, row * this._cellSize + this._halfCell);
                }
            }
        } catch (e) {
            console.log(e);
        }

        console.log("Initialized pheromone map with " + this._numColumns + " columns and " + this._numRows + " rows with size " + this._cellSize + " and color " + this._color);
    }

    /**
     * Convert a number from pixel-space into pheromone index-space.
     *
     * @param incoming one part of a coordinate.
     * @returns {number} The index corresponding to the coordinate.
     */
    getIndex(incoming: number) {
        return Math.max(0, Math.floor(incoming / this._cellSize));
    }

    getPheromone(globalX: number, globalY: number): Pheromone {
        let bucket: Bucket = this._map[this.getIndex(globalX)][this.getIndex(globalY)];

        if (bucket) {
            return this._map[this.getIndex(globalX)][this.getIndex(globalY)].pheromone;
        }
    }

    setPheromone(globalX: number, globalY: number, pheromone: Pheromone) {
        let bucket: Bucket = this._map[this.getIndex(globalX)][this.getIndex(globalY)];

        if (bucket) {
            this._map[this.getIndex(globalX)][this.getIndex(globalY)].pheromone = pheromone;
        }
    }

    addPheromone(ant: Ant, p: number): Pheromone {
        console.log("Adding pheromone...");
        let globalPosition: Point = ant.getGlobalPosition();
        let pheromone: Pheromone = this.getPheromone(globalPosition.x, globalPosition.y);

        if (pheromone) {
            pheromone.addP(p);
        } else {
            pheromone = new Pheromone(ant.x, ant.y, p, ant.lastPheromone, this);
        }

        this.setPheromone(globalPosition.x, globalPosition.y, pheromone);

        return pheromone;
    }

    logString(): string {
        return `name: ${this._name}`;
    }

    determineState(): BehaviorState {
        throw new Error('Method not implemented.');
    }

    evaluate(state: BehaviorState): void {
        throw new Error('Method not implemented.');
    }

    decayColumn(column: number, px: number) {
        this._map[column].filter((bucket: Bucket) => !bucket.locked).map(bucket => bucket.decayAll(px));
    }

    decayNextColumn(px: number) {
        let now = Date.now();
        if (now - this.lastDecayTimestamp > 500) {
            this.decayColumn(this.nextDecayIdx, px);
            this.nextDecayIdx++;
            if (this.nextDecayIdx >= this._map.length) {
                this.nextDecayIdx = 0;
            }
            this.lastDecayTimestamp = now;
        }
    }
}