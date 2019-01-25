import { ViewportRuler }    from '@angular/cdk/scrolling';
import {
    Component,
    EventEmitter,
    Input,
    Output,
    ViewEncapsulation,
}                           from '@angular/core';

import { BaseHeader }       from '../base-header.model';
import { NavItemType }      from '../nav-item-type.type';

@Component({
    selector: 'cf-cbp-header',
    templateUrl: 'cbp-header.component.html',
    styleUrls: ['cbp-header.component.scss'],
    encapsulation: ViewEncapsulation.None,
    host: {
        class: 'cf-legacy-box-sizing', // tslint:disable-line:use-host-property-decorator
    },
})
export class CbpHeaderComponent extends BaseHeader {
    @Input() homeUrl: string = '';
    @Input() homeUrlType: NavItemType = 'href';
    @Input() disableFeedback: boolean = false;

    @Output() readonly feedbackClicked: EventEmitter<void> = new EventEmitter<void>();

    constructor(viewportRuler: ViewportRuler) {
        super(viewportRuler);
    }
}
