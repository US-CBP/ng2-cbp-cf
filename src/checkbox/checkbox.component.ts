import {
    Component,
    EventEmitter,
    Input,
    forwardRef,
    Output
}                               from '@angular/core';
import {
    NG_VALUE_ACCESSOR,
    ControlValueAccessor
}                               from '@angular/forms';
import { BooleanFieldValue }    from '../shared';

let nextId = 0;

export const CF_CHECKBOX_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => CheckboxComponent),
  multi: true
};

export class CheckboxChange {
    source: CheckboxComponent;
    checked: boolean;
}

@Component({
    selector: 'cf-checkbox',
    templateUrl: 'checkbox.component.html',
    styleUrls: ['checkbox.component.scss'],
    providers: [CF_CHECKBOX_CONTROL_VALUE_ACCESSOR]
})
export class CheckboxComponent implements ControlValueAccessor {
    @Input() id: string = `cf-checkbox-${nextId++}`;
    @Input() name: string;
    @Input('aria-label') ariaLabel: string;
    @Input('aria-labelledby') ariaLabelledby: string;
    @Input() @BooleanFieldValue() required: boolean = false;
    @Input() disabled: boolean = false;
    @Input() tabindex: number = 0;
    @Input('in-cbp-table') inCbpTable: string = '';

    @Output() change: EventEmitter<CheckboxChange> = new EventEmitter<CheckboxChange>();

    isInline: boolean = false;
    focus: boolean = false;

    private _indeterminate: boolean = false;
    private _checked: boolean;
    private _controlValueAccessorChangeFn: (value: any) => void = (value) => {};

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
        /* tslint:disable */
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

    toggle() {
        this.checked = !this.checked;
    }

    onInputClick($event: Event) {
         $event.stopPropagation();
    }

    onInputChange($event: Event) {
        $event.stopPropagation();
        if(!this.disabled) {
            this.toggle();
            this._emitChangeEvent();
        }
        window.setTimeout(() => {
            this.focus = false;
        }, 0.0001);
    }

    onInputFocus() {
        this.focus = true;
    }

    onInputBlur() {
        this.focus = false;
        this.onTouched();
    }

    onMouseUp() {
        this.focus = false;
    }

    private _emitChangeEvent() {
        let event = new CheckboxChange();
        event.source = this;
        event.checked = this.checked;

        this._controlValueAccessorChangeFn(this.checked);
        this.change.emit(event);
    }

    writeValue(value: any) {
        this.checked = !!value;
    }

    registerOnChange(fn: (value: any) => void) {
        this._controlValueAccessorChangeFn = fn;
    }

    registerOnTouched(fn: any) {
        this.onTouched = fn;
    }
}
