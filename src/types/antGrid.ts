import {Point} from 'pixi.js'
import {Bucket} from "./bucket";
import {Pheromone} from "./pheromone";
import {Entity} from "../common/entity";
import {rotationDiffAbs} from "../common/movement-utils";
import {Ant} from "../entities/ant";
import {PheromoneType} from "./pheromone-type";
import {Colors} from "../constants/colors";
import pheromoneColor = Colors.pheromoneColor;

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
        let halfCellSize = this._cellSize / 2;

        try {
            for (let col = 0; col < this._numColumns; col++) {
                //console.log("Creating column " + col);
                this._map[col] = [];
                for (let row = 0; row < this._numRows; row++) {
                    this._map[col][row] = new Bucket((col * this._cellSize) + halfCellSize, (row * this._cellSize) + halfCellSize);
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

    getPheromone(globalX: number, globalY: number, type: PheromoneType): Pheromone {
        let bucket: Bucket = this._map[this.getXIndex(globalX)][this.getYIndex(globalY)];

        if (bucket) {
            return this._map[this.getXIndex(globalX)][this.getYIndex(globalY)].getPheromone(type);
        }
    }

    getBucketAtPosition(x: number, y: number): Bucket {
        let bucket: Bucket = this._map[this.getXIndex(x)][this.getYIndex(y)];

        if (bucket) {
            return bucket;
        }
    }

    getBucket(ant: Entity<any>): Bucket {
        let globalPosition: Point = ant.getGlobalPosition();
        let bucket: Bucket = this._map[this.getXIndex(globalPosition.x)][this.getYIndex(globalPosition.y)];

        if (bucket) {
            return bucket;
        }
    }

    setPheromone(globalX: number, globalY: number, type: PheromoneType, lastPheromone: Pheromone, p: number, locked: boolean = false): Pheromone {
        let bucket: Bucket = this._map[this.getXIndex(globalX)][this.getYIndex(globalY)];

        if (bucket) {
            this._map[this.getXIndex(globalX)][this.getYIndex(globalY)].addPheromone(type, lastPheromone, p);
            if (locked) {
                this._map[this.getXIndex(globalX)][this.getYIndex(globalY)].locked = true;
            }

            return this._map[this.getXIndex(globalX)][this.getYIndex(globalY)].getPheromone(type);
        }
    }

    addPheromone(ant: Ant, p: number): Pheromone {
        console.log("Adding pheromone...");
        let globalPosition: Point = ant.getGlobalPosition();
        return this.setPheromone(globalPosition.x, globalPosition.y, ant.outputPType(), ant.lastPheromone, p);
    }

    currentP(ant: Ant, pheromoneType: PheromoneType): Pheromone {
        let globalPosition: Point = ant.getGlobalPosition();

        return this.getPheromone(globalPosition.x, globalPosition.y, pheromoneType);
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
                        if (bucket.getPheromone(pheromoneType)) {
                            let radDiff = rotationDiffAbs({x: currentBucket.x, y: currentBucket.y, rotation: ant.rotation}, bucket);
                            if (radDiff < Math.PI / 1.5) {
                                if (window.DEBUG) {
                                    window.DEBUG_GRAPHICS.clear(ant.name);
                                    window.DEBUG_GRAPHICS.getGraphics(ant.name).alpha = 0.4
                                    window.DEBUG_GRAPHICS.getGraphics(ant.name)
                                        .beginFill(pheromoneColor(pheromoneType).color)
                                        .drawRect(bucket.x, bucket.y, window.P_CELL_SIZE, window.P_CELL_SIZE)
                                        .endFill();
                                }

                                nearbyPs.push(bucket.getPheromone(pheromoneType));
                            }
                        }
                    }
                }
            }
        }

        return nearbyPs.sort((a, b) => b.p - a.p);
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