import { Location }         from '@angular/common';

import { ToolbarService }   from './toolbar.service';

export class LeftAction {
    constructor(
        public text: string,
        public iconClasses: string,
        public action: () => void) {
    }
}

export class BackAction extends LeftAction {
    constructor(action: () => void) {
        super('Back', 'arrow_back', action);
    }
}

export class CloseAction extends LeftAction {
    constructor(action: () => void) {
        super('Close', 'close', action);
    }
}

export class LocationCloseAction extends CloseAction {
    constructor(private _location: Location) {
        super(() => this._location.back());
    }
}

export class LocationBackAction extends BackAction {
    constructor(private _location: Location) {
        super(() => this._location.back());
    }
}

export class NavigationAction extends LeftAction {
    constructor(toolbarService: ToolbarService) {
        super('Navigation', 'menu', () => toolbarService.openSideNav());
    }
}
