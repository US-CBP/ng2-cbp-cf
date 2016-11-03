import {
    forwardRef,
    Component,
    Directive,
    ElementRef,
    Host,
    Input,
    OnDestroy,
    Optional,
    Renderer,
    ViewChild
}                           from '@angular/core';
import {
    NG_VALUE_ACCESSOR,
    ControlValueAccessor
}                           from '@angular/forms';

let nextId = 1;

export const selectFieldControlValueAccessor: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SelectFieldComponent),
    multi: true
};

function _buildValueString(id: string, value: any): string {
    if(id == null) {
        return `${value}`;
    }
    if(value !== null && (typeof value === 'function' || typeof value === 'object')) {
        value = 'Object';
    }

    return `${id}: ${value}`.slice(0, 50);
}

function _extractId(valueString: string) {
    return valueString.split(':')[0];
}

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
    @Input() usePlaceholderLabel: boolean = false;

    isFocused: boolean = false;
    value: any;
    optionMap: Map<string, any> = new Map<string, any>();

    @ViewChild('select') private _select: ElementRef;
    private _idCounter: number = 0;

    onSelectChange: (value: any) => void = (value) => { };

    private _onTouched: () => any = () => {};

    constructor(private _renderer: Renderer) {
    }

    get selectId(): string {
        return `${this.id}-input`;
    }

    get isDirty(): boolean {
        let value = (<HTMLSelectElement>this._select.nativeElement).value;
        return (value != null) && value.length > 0;
    }

    get isInvalid(): boolean {
        // TODO: use ngModel on host if provided
        return !(<HTMLSelectElement>this._select.nativeElement).validity.valid;
    }

    onSelectFocus() {
        this.isFocused = true;
    }

    onSelectBlur() {
        this.isFocused = false;
        this._onTouched();
    }

    registerOption(): string {
        return (this._idCounter++).toString();
    }

    private _getOptionId(value: any): string {
        for(let id of Array.from(this.optionMap.keys())) {
            let v = this.optionMap.get(id);
            if(value === v || typeof value === 'number' && typeof v === 'number' && isNaN(value) && isNaN(v)) {
                return id;
            }
        }
        return null;
    }

    private _getOptionValue(valueString: string): any {
        let value = this.optionMap.get(_extractId(valueString));
        return (value != null) ? value : valueString;
    }

    writeValue(value: any) {
        this.value = value;
        let valueString = _buildValueString(this._getOptionId(value), value);
        this._renderer.setElementProperty(this._select.nativeElement, 'value', valueString);
    }

    registerOnChange(fn: (value: any) => void) {
        this.onSelectChange = (valueString: string) => {
            this.value = valueString;
            fn(this._getOptionValue(valueString));
        };
    }

    registerOnTouched(fn: any) {
        this._onTouched = fn;
    }

    setDisabledState(isDisabled: boolean) {
        this.disabled = isDisabled;
    }
}

@Directive({
    /* tslint:disable */
    selector: 'option'
    /* tslint:enable */
})
export class SelectFieldOptionDirective implements OnDestroy {
    id: string;

    constructor(
        private _element: ElementRef,
        private _renderer: Renderer,
        @Optional() @Host() private _selectField: SelectFieldComponent) {

        if(this._selectField != null) {
            this.id = this._selectField.registerOption();
        }
    }

    ngOnDestroy() {
        if(this._selectField != null) {
            this._selectField.optionMap.delete(this.id);
            this._selectField.writeValue(this._selectField.value);
        }
    }

    @Input()
    set ngValue(value: any) {
        if(this._selectField == null) {
            return;
        }

        this._selectField.optionMap.set(this.id, value);
        this._setElementValue(_buildValueString(this.id, value));
        this._selectField.writeValue(this._selectField.value);
    }

    @Input()
    set value(value: any) {
        this._setElementValue(value);
        if(this._selectField != null) {
            this._selectField.writeValue(this._selectField.value);
        }
    }

    private _setElementValue(value: string) {
        this._renderer.setElementProperty(this._element.nativeElement, 'value', value);
    }
}
