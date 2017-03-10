import {
    Component,
    Input,
    Optional,
    ViewEncapsulation,
}                                   from '@angular/core';

import { AppHeaderComponent }       from '../app-header';
import { BaseHeader }               from '../base-header.model';
import { CbpHeaderComponent }       from '../cbp-header';

@Component({
    selector: 'cf-header-menu',
    templateUrl: 'header-menu.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class HeaderMenuComponent {
    @Input('class') classes: string;

    private header: BaseHeader;

    constructor(
        @Optional() appHeader: AppHeaderComponent,
        @Optional() cbpHeader: CbpHeaderComponent) {

        this.header = appHeader || cbpHeader;
    }

    get isCondensed(): boolean {
        return this.header.isCondensed;
    }
}
