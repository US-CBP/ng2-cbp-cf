import {
    Directive,
    ElementRef,
    EventEmitter,
    HostBinding,
    HostListener,
    Input,
    Output,
    Renderer,
}                           from '@angular/core';

import { ButtonDirective }  from '../button';

@Directive({
    /* tslint:disable:use-host-property-decorator */
    selector: 'button[cfToggleButton], a[cfToggleButton]',
    host: {
        '[class.btn]': 'true',
        '[class.btn-hover]': 'borderless',
        '[class.btn-block]': 'block',
        '[class.btn-icon-only]': 'iconOnly',
        '[class.active]': 'active',
    },
    /* tslint:enable */
})
export class ToggleButtonDirective extends ButtonDirective {
    /* tslint:disable:no-input-rename */
    @Input('cfToggleButton') active: boolean = false;
    /* tslint:enable */
    @Output() change: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor(element: ElementRef, renderer: Renderer) {
        super(element, renderer);
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
}
