import {
    Directive,
    ElementRef,
    EventEmitter,
    HostBinding,
    HostListener,
    Input,
    Output,
    Renderer
}                           from '@angular/core';

import { ButtonDirective }  from '../button';

@Directive({
    /* tslint:disable */
    selector: 'button[cfToggleButton], a[cfToggleButton]',
    /* tslint:enable */
    host: {
        '[class.btn]': 'true',
        '[class.btn-hover]': 'borderless',
        '[class.btn-block]': 'block',
        '[class.btn-icon-only]': 'iconOnly'
    }
})
export class ToggleButtonDirective extends ButtonDirective {
    static readonly activeStyle: string = 'active';

    @Output() change: EventEmitter<boolean> = new EventEmitter<boolean>();

    private _active: boolean = false;

    constructor(element: ElementRef, renderer: Renderer) {
        super(element, renderer);
    }

    @Input('cfToggleButton')
    get active(): boolean {
        return this._active;
    }
    set active(newValue: boolean) {
        newValue = newValue || false;

        if(this._active !== newValue) {
            if(this._active) {
                this.removeClasses([ToggleButtonDirective.activeStyle]);
            }

            this._active = newValue;

            if(newValue) {
                this.addClasses([ToggleButtonDirective.activeStyle]);
            }
        }
    }

    @HostBinding('attr.aria-pressed')
    get ariaPressed(): boolean {
        return this.active ? true : undefined;
    }

    @HostListener('click')
    onClick() {
        this.active = !this.active;

        this.change.emit(this.active);
    }

    ngOnInit() {
        super.ngOnInit();

        if(this.active) {
            this.addClasses([ToggleButtonDirective.activeStyle]);
        }
    }
}
