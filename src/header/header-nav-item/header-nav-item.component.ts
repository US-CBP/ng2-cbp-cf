import {
    Component,
    Input,
    ViewEncapsulation,
}                                   from '@angular/core';

export type NavItemType = "href" | "route";

@Component({
    selector: 'cf-header-nav-item',
    templateUrl: 'header-nav-item.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class HeaderNavItemComponent {
    @Input() text: string;
    @Input() type: NavItemType;
    @Input() url: string;

    constructor() {
    }
}
