import { ViewportRuler }    from '@angular/cdk/scrolling';

export class BaseHeader {
    constructor(private _viewportRuler: ViewportRuler) {
    }

    get isCondensed(): boolean {
        return this._viewportRuler.getViewportSize().width < 960;
    }
}
