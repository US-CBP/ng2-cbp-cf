export class ButtonRole {
    constructor(private _classes: string[]) {
    }

    get classes(): string[] {
        return this._classes.slice();
    }
}

export class ButtonRoles {
    static readonly default: ButtonRole = new ButtonRole(['btn-default']);
    static readonly primary: ButtonRole = new ButtonRole(['btn-primary']);
    static readonly danger: ButtonRole = new ButtonRole(['btn-danger']);
    static readonly success: ButtonRole = new ButtonRole(['btn-success']);
    static readonly info: ButtonRole = new ButtonRole(['btn-info']);
    static readonly warning: ButtonRole = new ButtonRole(['btn-warning']);
    static readonly link: ButtonRole = new ButtonRole(['btn-link']);
}
