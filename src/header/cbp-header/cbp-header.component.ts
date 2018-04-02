﻿import { ViewportRuler }    from '@angular/cdk/scrolling';
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
})
export class CbpHeaderComponent extends BaseHeader {
    @Input() homeUrl: string = '';
    @Input() homeUrlType: NavItemType = 'href';
    @Input() disableFeedback: boolean = false;

    @Output() feedbackClicked: EventEmitter<void> = new EventEmitter<void>();

    constructor(viewportRuler: ViewportRuler) {
        super(viewportRuler);
    }
}
