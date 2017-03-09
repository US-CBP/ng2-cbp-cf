import {
    Component,
    EventEmitter,
    Input,
    Output,
    ViewEncapsulation,
}                       from '@angular/core';

@Component({
    selector: 'cf-cbp-header',
    templateUrl: 'cbp-header.component.html',
    styleUrls: ['cbp-header.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class CbpHeaderComponent {
    @Input() homeUrl: string = '';
    @Input() disableFeedback: boolean = false;

    @Output() feedbackClicked: EventEmitter<void> = new EventEmitter<void>();

    constructor() {
    }
}
