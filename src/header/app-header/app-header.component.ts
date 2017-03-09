import {
    Component,
    EventEmitter,
    Input,
    Output,
    ViewEncapsulation,
}                       from '@angular/core';

@Component({
    selector: 'cf-app-header',
    templateUrl: 'app-header.component.html',
    styleUrls: ['app-header.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class AppHeaderComponent {
    @Input() disableSearch: boolean = false;
    @Input() searchText: string = '';

    @Output() searchClicked: EventEmitter<string> = new EventEmitter<string>();

    constructor() {
    }
}
