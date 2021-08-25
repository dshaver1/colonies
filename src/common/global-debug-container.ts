import {Container, Graphics} from "pixi.js";


export class GlobalDebugContainer extends Container {
    map: Map<string, Graphics> = new Map();
    lastCleared: number = Date.now();

    getGraphics(name: string): Graphics {
        let g = this.map.get(name);

        if (!g) {
            g = new Graphics();
            this.addChild(g);
            this.map.set(name, g);
        }

        return g;
    }

    clear(name: string) {
        let now: number = Date.now();
        if (now - this.lastCleared > 10000) {
            if (this.map.get(name)) {
                this.map.get(name).clear();
                this.lastCleared = now;
            }
        }
    }

    remove(name: string) {
        let g = this.map.get(name);
        g.clear();
        this.removeChild(g);
    }
}