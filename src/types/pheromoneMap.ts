import {Application, Point} from 'pixi.js'
import {Bucket} from "./bucket";
import {Color} from "../common/color";
import {Pheromone} from "./pheromone";
import {Entity} from "../common/entity";
import {BehaviorState} from '../entities/behaviors';
import {Location2D} from "../common/location";
import {Ant} from "../entities/ant";
import {angleDiff, rotationDiff} from "../common/movement-utils";
import {Nest} from "../entities/nest";

const detectRadius = 1;

export class PheromoneMap extends Entity<Nest> {
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

    constructor(name: string, cellSize: number, color: Color, parent?: Nest) {
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

    init(width: number, height: number) {
        this._numColumns = Math.ceil(width / this._cellSize);
        this._numRows = Math.ceil(height / this._cellSize);

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
    getIndex(incoming: number, upperLimit: number) {
        return Math.min(upperLimit, Math.max(0, Math.floor(incoming / this._cellSize)));
    }

    getXIndex(incoming: number) {
        return this.getIndex(incoming, this._numColumns);
    }

    getYIndex(incoming: number) {
        return this.getIndex(incoming, this._numRows);
    }

    getPheromone(globalX: number, globalY: number): Pheromone {
        let bucket: Bucket = this._map[this.getXIndex(globalX)][this.getYIndex(globalY)];

        if (bucket) {
            return this._map[this.getXIndex(globalX)][this.getYIndex(globalY)].pheromone;
        }
    }

    getBucket(ant: Entity<any>): Bucket {
        let globalPosition: Point = ant.getGlobalPosition();
        let bucket: Bucket = this._map[this.getXIndex(globalPosition.x)][this.getYIndex(globalPosition.y)];

        if (bucket) {
            return bucket;
        }
    }

    setPheromone(globalX: number, globalY: number, pheromone: Pheromone) {
        let bucket: Bucket = this._map[this.getXIndex(globalX)][this.getYIndex(globalY)];

        if (bucket) {
            this._map[this.getXIndex(globalX)][this.getYIndex(globalY)].pheromone = pheromone;
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

    nearbyP(ant: Ant) : Pheromone[] {
        let nearbyPs: Pheromone[] = [];
        let globalPosition: Point = ant.getGlobalPosition();
        let xIndex = this.getXIndex(globalPosition.x);
        let yIndex = this.getYIndex(globalPosition.y);
        for (let col = xIndex - detectRadius; col <= xIndex + detectRadius; col++) {
            if (col >= 0 && col < this._map.length) {
                for (let row = yIndex - detectRadius; row <= yIndex + detectRadius; row++) {
                    let bucket = this._map[col][row];
                    if (bucket && bucket.pheromone) {
                        let radDiff = rotationDiff({x: globalPosition.x, y: globalPosition.y, rotation: ant.rotation}, bucket);
                        if (radDiff < Math.PI / 1.5) {
                            nearbyPs.push(bucket.pheromone);
                        }
                    }
                }
            }
        }

        return nearbyPs.sort((a, b) => b.p - a.p);
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