export class Color {
    color: number;
    hexColor: string;

    constructor(hexColor: string) {
        this.hexColor = hexColor;
        this.color = convertColor(hexColor);
    }

}

function convertColor(hexColor: string) {
    return parseInt(hexColor.substr(1), 16);
}