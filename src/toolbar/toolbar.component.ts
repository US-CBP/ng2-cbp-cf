import { Portal }           from '@angular/cdk/portal';
import {
    ChangeDetectionStrategy,
    Component,
}                           from '@angular/core';
import { Observable }       from 'rxjs/Observable';

import { LeftAction }       from './left-action.model';
import { ToolbarService }   from './toolbar.service';

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

    constructor(private _service: ToolbarService) {
        this.leftAction = this._service.leftAction;
        this.portal = this._service.portal;
        this.title = this._service.title;
    }
}
