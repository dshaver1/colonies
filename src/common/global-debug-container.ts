import {Container, Graphics} from "pixi.js";


export class GlobalDebugContainer extends Container {
    map: Map<string, Graphics> = new Map();

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
        this.map.get(name).clear();
    }

    remove(name: string) {
        let g = this.map.get(name);
        g.clear();
        this.removeChild(g);
    }
}