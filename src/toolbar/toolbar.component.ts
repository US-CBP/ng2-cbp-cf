import { Portal }           from '@angular/cdk/portal';
import {
    ChangeDetectionStrategy,
    Component,
}                           from '@angular/core';
import { Observable }       from 'rxjs';

import { LeftAction }       from './left-action.model';
import { ToolbarService }   from './toolbar.service';

@Component({
    selector: 'cf-toolbar',
    templateUrl: 'toolbar.component.html',
    styleUrls: ['toolbar.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToolbarComponent {
    leftAction: Observable<LeftAction | null | undefined>;
    portal: Observable<Portal<any> | null | undefined>;
    title: Observable<string | null | undefined>;

    constructor(private _service: ToolbarService) {
        this.leftAction = this._service.leftAction;
        this.portal = this._service.portal;
        this.title = this._service.title;
    }
}
