import {Application, Point} from 'pixi.js'
import {Bucket} from "./bucket";
import {Color} from "../common/color";
import {getColor, Pheromone, PheromoneType} from "./pheromone";
import {Entity} from "../common/entity";
import {BehaviorState} from '../entities/behaviors';
import {Location2D} from "../common/location";
import {Ant} from "../entities/ant";
import {angleDiff, distance, rotationDiff, rotationDiff2} from "../common/movement-utils";
import {Nest} from "../entities/nest";

const detectRadius = 1;

export class AntGrid {
    readonly _map: Array<Array<Bucket>>;
    readonly _cellSize: number;
    readonly _halfCell: number;
    readonly _alphaFactor: number;
    _numColumns: number;
    _numRows: number;
    lastDecayTimestamp: number = Date.now();
    nextDecayIdx: number;

    constructor(cellSize: number) {
        console.log("Creating ant grid...");
        this._map = [];
        this._cellSize = cellSize;
        this._halfCell = cellSize / 2;
        this._alphaFactor = 0.01;
        this.nextDecayIdx = 0;
    }

    init(width: number, height: number) {
        this._numColumns = Math.ceil(width / this._cellSize);
        this._numRows = Math.ceil(height / this._cellSize);

        try {
            for (let col = 0; col < this._numColumns; col++) {
                //console.log("Creating column " + col);
                this._map[col] = [];
                for (let row = 0; row < this._numRows; row++) {
                    this._map[col][row] = new Bucket(col * this._cellSize, row * this._cellSize);
                }
            }
        } catch (e) {
            console.log(e);
        }

        console.log("Initialized ant grid with " + this._numColumns + " columns and " + this._numRows + " rows with size " + this._cellSize);
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
        return this.getIndex(incoming, this._numColumns - 1);
    }

    getYIndex(incoming: number) {
        return this.getIndex(incoming, this._numRows - 1);
    }

    getPheromones(globalX: number, globalY: number, type: PheromoneType): Array<Pheromone> {
        let bucket: Bucket = this._map[this.getXIndex(globalX)][this.getYIndex(globalY)];

        if (bucket) {
            return this._map[this.getXIndex(globalX)][this.getYIndex(globalY)].getPheromones(type);
        }
    }

    getBucket(ant: Entity<any>): Bucket {
        let globalPosition: Point = ant.getGlobalPosition();
        let bucket: Bucket = this._map[this.getXIndex(globalPosition.x)][this.getYIndex(globalPosition.y)];

        if (bucket) {
            return bucket;
        }
    }

    setPheromone(globalX: number, globalY: number, pheromone: Pheromone, locked: boolean = false) {
        let bucket: Bucket = this._map[this.getXIndex(globalX)][this.getYIndex(globalY)];

        if (bucket) {
            this._map[this.getXIndex(globalX)][this.getYIndex(globalY)].addPheromone(pheromone);
            if (locked) {
                this._map[this.getXIndex(globalX)][this.getYIndex(globalY)].locked = true;
            }
        }
    }

    addPheromone(ant: Ant, pType: PheromoneType, p: number): Pheromone {
        console.log("Adding pheromone...");
        let globalPosition: Point = ant.getGlobalPosition();
        let selectedPheromone: Pheromone = new Pheromone(globalPosition.x, globalPosition.y, p, pType, ant.lastPheromone, window.SURFACE);
        this.setPheromone(globalPosition.x, globalPosition.y, selectedPheromone);

        return selectedPheromone;
    }

    nearbyP(ant: Ant, pheromoneType: PheromoneType): Pheromone[] {
        let nearbyPs: Pheromone[] = [];
        let globalPosition: Point = ant.getGlobalPosition();
        let xIndex = this.getXIndex(globalPosition.x);
        let yIndex = this.getYIndex(globalPosition.y);
        let currentBucket = this._map[xIndex][yIndex];
        for (let col = xIndex - detectRadius; col <= xIndex + detectRadius; col++) {
            if (col >= 0 && col < this._map.length) {
                for (let row = yIndex - detectRadius; row <= yIndex + detectRadius; row++) {
                    let bucket: Bucket = this._map[col][row];
                    if (bucket) {
                        if (bucket.getPheromones(pheromoneType).length) {
                            let radDiff = rotationDiff2({x: currentBucket.x, y: currentBucket.y, rotation: ant.rotation}, bucket);
                            if (radDiff < Math.PI / 1.5) {
                                /*                                if (window.DEBUG) {
                                                                    window.DEBUG_GRAPHICS.getGraphics(ant.name).alpha = 0.4
                                                                    window.DEBUG_GRAPHICS.getGraphics(ant.name)
                                                                        .beginFill(getColor(pheromoneType))
                                                                        .drawRect(bucket.x, bucket.y, window.P_CELL_SIZE, window.P_CELL_SIZE)
                                                                        .endFill();
                                                                }*/
                                bucket.getPheromones(pheromoneType).forEach(currentP => nearbyPs.push(currentP));
                            }

                        }
                    }
                }
            }
        }

        return nearbyPs.sort((a,b) => b.p - a.p);}

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