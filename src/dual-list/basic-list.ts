export class BasicList {
    last: any;
    dragStart: boolean;
    dragOver: boolean;
    pick: any[];
    list: any[];

    private _name: string;

    constructor(name: string) {
        this._name = name;
        this.last = null;
        this.dragStart = false;
        this.dragOver = false;
        this.pick = [] as any;
        this.list = [] as any;
    }

    get name(): string {
        return this._name;
    }
}
