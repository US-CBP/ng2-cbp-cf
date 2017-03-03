import {
    Component,
    EventEmitter,
    Input,
    Output,
    forwardRef,
}                               from '@angular/core';
import {
    ControlValueAccessor,
    NG_VALUE_ACCESSOR,
}                               from '@angular/forms';

import { BooleanFieldValue }    from '../shared';

let nextId = 0;

/* tslint:disable:no-forward-ref */
export const CF_CHECKBOX_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => CheckboxComponent),
  multi: true,
};
/* tslint:enable */

export class CheckboxChange {
    source: CheckboxComponent;
    checked: boolean;
}

@Component({
    selector: 'cf-checkbox',
    templateUrl: 'checkbox.component.html',
    styleUrls: ['checkbox.component.scss'],
    providers: [CF_CHECKBOX_CONTROL_VALUE_ACCESSOR],
})
export class CheckboxComponent implements ControlValueAccessor {
    @Input() id: string = `cf-checkbox-${nextId++}`;
    @Input() name: string;
    @Input() @BooleanFieldValue() required: boolean = false;
    @Input() disabled: boolean = false;
    @Input() tabindex: number = 0;
    /* tslint:disable:no-input-rename */
    @Input('aria-label') ariaLabel: string;
    @Input('aria-labelledby') ariaLabelledby: string;
    @Input('in-cbp-table') inCbpTable: string = '';
    /* tslint:enable */

    @Output() change: EventEmitter<CheckboxChange> = new EventEmitter<CheckboxChange>();

    isInline: boolean = false;
    focus: boolean = false;

    private _indeterminate: boolean = false;
    private _checked: boolean;
    private _controlValueAccessorChangeFn: (value: any) => void = value => {};

    onTouched: () => any = () => {};

    constructor() {}

    get inputId(): string {
        return `${this.id}-input`;
    }

    @Input()
    get checked(): boolean {
        return this._checked;
    }
    set checked(checked: boolean) {
        /* tslint:disable:triple-equals */
        if (checked != this._checked) {
        /* tslint:enable */
            this._indeterminate = false;
            this._checked = checked;
        }
    }

    @Input()
    get indeterminate(): boolean {
        return this._indeterminate;
    }
    set indeterminate(indeterminate: boolean) {
        this._indeterminate = indeterminate;
        if (this._indeterminate) {
            this.checked = false;
        }
    }

    toggle(): void {
        this.checked = !this.checked;
    }

    onInputClick($event: Event): void {
         $event.stopPropagation();
    }

    onInputChange($event: Event): void {
        $event.stopPropagation();
        if(!this.disabled) {
            this.toggle();
            this._emitChangeEvent();
        }
        window.setTimeout(() => {
            this.focus = false;
        }, 0.0001);
    }

    onInputFocus(): void {
        this.focus = true;
    }

    onInputBlur(): void {
        this.focus = false;
        this.onTouched();
    }

    onMouseUp(): void {
        this.focus = false;
    }

    private _emitChangeEvent(): void {
        let event = new CheckboxChange();
        event.source = this;
        event.checked = this.checked;

        this._controlValueAccessorChangeFn(this.checked);
        this.change.emit(event);
    }

    writeValue(value: any): void {
        this.checked = !!value;
    }

    registerOnChange(fn: (value: any) => void): void {
        this._controlValueAccessorChangeFn = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }
}
