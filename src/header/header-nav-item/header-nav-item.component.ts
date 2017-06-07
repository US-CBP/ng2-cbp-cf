import {
    Component,
    Input,
    ViewEncapsulation,
}                                   from '@angular/core';

import { NavItemType }              from '../nav-item-type.type';

@Component({
    selector: 'cf-header-nav-item',
    templateUrl: 'header-nav-item.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class HeaderNavItemComponent {
    @Input() type: NavItemType;
    @Input() url: string;

    constructor() {
    }
}
