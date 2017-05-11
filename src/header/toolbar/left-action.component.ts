import {
    ChangeDetectionStrategy,
    Component,
    Input,
}                       from '@angular/core';

import { LeftAction }   from './left-action.model';

@Component({
    selector: 'cf-toolbar-left-action',
    templateUrl: 'left-action.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LeftActionComponent {
    @Input() leftAction: LeftAction;

    constructor() {
    }
}
