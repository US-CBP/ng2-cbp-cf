export class ButtonSize {
    constructor(private _classes: string[]) {
    }

    get classes(): string[] {
        return this._classes.slice();
    }
}

export class ButtonSizes {
    static readonly normal: ButtonSize = new ButtonSize([]);
    static readonly large: ButtonSize = new ButtonSize(["btn-lg"]);
    static readonly small: ButtonSize = new ButtonSize(["btn-sm"]);
    static readonly extraSmall: ButtonSize = new ButtonSize(["btn-xs"]);
}
