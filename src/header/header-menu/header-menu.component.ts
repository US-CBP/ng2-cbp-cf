import {
    Component,
    Input,
    ViewEncapsulation,
}                       from '@angular/core';

@Component({
    selector: 'cf-header-menu',
    templateUrl: 'header-menu.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class HeaderMenuComponent {
    @Input() text: string;

    constructor() {
    }
}
