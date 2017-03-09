import { ObservableMedia }  from '@angular/flex-layout';

export class BaseHeader {
    constructor(private media: ObservableMedia) {
    }

    get isCondensed(): boolean {
        return this.media.isActive('xs') || this.media.isActive('sm');
    }
}
