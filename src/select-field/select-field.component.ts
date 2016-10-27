import {
    forwardRef,
    Component,
    ElementRef,
    Input,
    ViewChild
}                           from '@angular/core';
import {
    NG_VALUE_ACCESSOR,
    ControlValueAccessor
}                           from '@angular/forms';
<<<<<<< 95b94f25ba0e5a39031b784bc747cf9334670c3a
=======
import { By }               from '@angular/platform-browser';
>>>>>>> add select field

let nextId = 1;

export const selectFieldControlValueAccessor: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SelectFieldComponent),
    multi: true
};

@Component({
    selector: 'cf-select-field',
    templateUrl: 'select-field.component.html',
    providers: [selectFieldControlValueAccessor]
})
export class SelectFieldComponent implements ControlValueAccessor {
    @Input() id: string = `cf-select-field-${nextId++}`;
    @Input() autofocus: boolean = false;
    @Input() disabled: boolean = false;
    @Input() form: string;
    @Input() multiple: boolean = false;
    @Input() name: string;
    @Input() required: boolean = false;
    @Input() selected: boolean = false;
    @Input() size: number = 0;

    isFocused: boolean = false;

    @ViewChild('select') private _select: ElementRef;
    private _controlValueAccessorChangeFn: (value: any) => void = (value) => {};

    onTouched: () => any = () => {};

    constructor() {
    }

    get selectId(): string {
        return `${this.id}-input`;
    }

    @Input()
    get value(): string {
        return (<HTMLSelectElement>this._select.nativeElement).value;
    }
    set value(newValue: string) {
        (<HTMLSelectElement>this._select.nativeElement).value = newValue;
        this._controlValueAccessorChangeFn(newValue);
    }

    get isDirty(): boolean {
        let value = (<HTMLSelectElement>this._select.nativeElement).value;
        return (value != null) && value.length > 0;
    }

    get isInvalid(): boolean {
        return !(<HTMLSelectElement>this._select.nativeElement).validity.valid;
    }

    onSelectFocus() {
        this.isFocused = true;
    }

    onSelectBlur() {
        this.isFocused = false;
        this.onTouched();
    }

    writeValue(value: any) {
        this.value = value.toString();
    }

    registerOnChange(fn: (value: any) => void) {
        this._controlValueAccessorChangeFn = fn;
    }

    registerOnTouched(fn: any) {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean) {
        this.disabled = isDisabled;
    }
}
