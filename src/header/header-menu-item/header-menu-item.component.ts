import {
    Component,
    Input,
    ViewEncapsulation,
}                           from '@angular/core';

import { HeaderMenuItem }   from '../header-menu-item.model';

@Component({
    selector: 'cf-header-menu-item',
    templateUrl: 'header-menu-item.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class HeaderMenuItemComponent {
    @Input() item: HeaderMenuItem;
    @Input() toggle: string;

    constructor() {
    }
}
