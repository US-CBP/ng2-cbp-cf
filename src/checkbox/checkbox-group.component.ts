import {
    AfterContentInit,
    Component,
    ContentChildren,
    Input,
    QueryList,
    forwardRef
}                           from '@angular/core';

import {
    CheckboxComponent
}                           from '../checkbox';

@Component({
    selector: 'cf-checkbox-group',
    templateUrl: 'checkbox-group.component.html',
})
export class CheckboxGroupComponent implements AfterContentInit {
    /* tslint:disable:no-forward-ref */
    @ContentChildren(forwardRef(() => CheckboxComponent)) _checkboxes: QueryList<CheckboxComponent>;
    private _isInline: boolean = false;
    /* tslint:enable */

    constructor() {}

    ngAfterContentInit() {
        this.updateCheckBoxIsInlines();
    }

    @Input()
    get isInline(): boolean {
        return this._isInline;
    }
    set isInline(newValue: boolean) {
        this._isInline = newValue;
    }

    private updateCheckBoxIsInlines() {
        if(this._checkboxes != null) {
            this._checkboxes.forEach(checkbox => {
                checkbox.isInline = this.isInline;
            });
        }
    }

}
