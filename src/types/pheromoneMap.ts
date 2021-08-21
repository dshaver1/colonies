import {Application} from 'pixi.js'
import {Bucket} from "./bucket";

export class PheromoneMap {
    readonly _map: Array<Array<Bucket>>;
    readonly _name: string;
    readonly _cellSize: number;
    readonly _halfCell: number;
    readonly _color: number;
    readonly _alphaFactor: number;
    _numColumns: number;
    _numRows: number;
    nextDecay: number;

    constructor(name: string, cellSize: number, color: number) {
        console.log("Creating pheromone map...");
        this._name = name;
        this._map = [];
        this._cellSize = cellSize;
        this._halfCell = cellSize / 2;
        this._color = color;
        this._alphaFactor = 0.01;
        this.nextDecay = 0;
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

    addPheromone(x: number, y: number, p: number) {
        console.log("Adding pheromone...");
    }
}