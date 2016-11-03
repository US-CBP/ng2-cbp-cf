import {
    Directive,
    ElementRef,
    Input,
    OnInit,
    Renderer
}                   from '@angular/core';

import {
    ButtonRole,
    ButtonRoles
}                   from './button-roles.model';
import {
    ButtonSize,
    ButtonSizes
}                   from './button-sizes.model';
@Directive({
    /* tslint:disable */
    selector: 'button[cfButton], a[cfButton]',
    host: {
        '[class.btn]': 'true',
        '[class.btn-hover]': 'borderless',
        '[class.btn-block]': 'block',
        '[class.btn-icon-only]': 'iconOnly'
    }
    /* tslint:enable */
})
export class ButtonDirective implements OnInit {
    @Input('cfBorderless') borderless: boolean = false;
    @Input('cfBlock') block: boolean = false;
    @Input('cfIconOnly') iconOnly: boolean = false;

    private _role: ButtonRole = ButtonRoles.default;
    private _size: ButtonSize = ButtonSizes.normal;

    constructor(private element: ElementRef, private renderer: Renderer) {
    }

    @Input('cfRole')
    get role(): ButtonRole {
        return this._role;
    }
    set role(newValue: ButtonRole) {
        newValue = newValue || ButtonRoles.default;

        if(this._role !== newValue) {
            this.removeClasses(this._role.classes);

            this._role = newValue;

            this.addClasses(newValue.classes);
        }
    }

    @Input('cfSize')
    get size(): ButtonSize {
        return this._size;
    }
    set size(newValue: ButtonSize) {
        newValue = newValue || ButtonSizes.normal;

        if(this._size !== newValue) {
            this.removeClasses(this._size.classes);

            this._size = newValue;

            this.addClasses(newValue.classes);
        }
    }

    ngOnInit() {
        this.addClasses(this.role.classes);
        this.addClasses(this.size.classes);
    }

    protected addClasses(classes: string[]) {
        for(let c of classes) {
            this.renderer.setElementClass(this.element.nativeElement, c, true);
        }
    }

    protected removeClasses(classes: string[]) {
        for(let c of classes) {
            this.renderer.setElementClass(this.element.nativeElement, c, false);
        }
    }
}
