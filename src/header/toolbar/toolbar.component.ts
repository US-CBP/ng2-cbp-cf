import {
    ChangeDetectionStrategy,
    Component,
}                                   from '@angular/core';
import { Portal }                   from '@angular/material';
import { Observable }               from 'rxjs';

import { LeftAction }               from './left-action.model';
import { ToolbarService,
         ToolbarGlobalButtonAlign,
}                                   from './toolbar.service';

@Component({
    selector: 'cf-toolbar',
    templateUrl: 'toolbar.component.html',
    styleUrls: ['toolbar.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToolbarComponent {
    leftAction: Observable<LeftAction>;
    portal: Observable<Portal<any>>;
    title: Observable<string>;
    globalButtonAlign: Observable<ToolbarGlobalButtonAlign>;

    constructor(private _service: ToolbarService) {
        this.leftAction = this._service.leftAction;
        this.portal = this._service.portal;
        this.title = this._service.title;
        this.globalButtonAlign = this._service.globalButtonAlign;
    }
}
