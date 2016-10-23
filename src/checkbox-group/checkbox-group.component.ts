import {
    AfterContentInit ,
    Component,
    ContentChildren,
    Input,
    QueryList
}                           from '@angular/core';

import {
    CheckboxComponent
}                           from '../checkbox';

@Component({
    selector: 'cf-checkbox-group',
    templateUrl: 'checkbox-group.component.html',
})
export class CheckboxGroupComponent implements AfterContentInit {
    @ContentChildren(CheckboxComponent) _checkboxes: QueryList<CheckboxComponent>;
    private _isInline: boolean = false;

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
