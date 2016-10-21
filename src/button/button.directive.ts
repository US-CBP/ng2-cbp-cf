import {
    Directive,
    ElementRef,
    Input,
    OnInit,
    Renderer
}                   from "@angular/core";

import {
    ButtonRole,
    ButtonRoles
}                   from "./button-roles.model";
import {
    ButtonSize,
    ButtonSizes
}                   from "./button-sizes.model";

@Directive({
    selector: "button[cfButton], a[cfButton]"
})
export class ButtonDirective implements OnInit {
    static readonly blockStyle: string = "btn-block";
    static readonly iconOnlyStyle: string = "btn-icon-only";

    private _role: ButtonRole = ButtonRoles.default;
    private _size: ButtonSize = ButtonSizes.normal;
    private _block: boolean = false;
    private _iconOnly: boolean = false;

    constructor(private element: ElementRef, private renderer: Renderer) {
    }

    @Input("cfRole")
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

    @Input("cfSize")
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

    @Input("cfBlock")
    get block(): boolean {
        return this._block;
    }
    set block(newValue: boolean) {
        newValue = newValue || false;

        if(this._block !== newValue) {
            if(this._block) {
                this.removeClasses([ButtonDirective.blockStyle]);
            }

            this._block = newValue;

            if(newValue) {
                this.addClasses([ButtonDirective.blockStyle]);
            }
        }
    }

    @Input("cfIconOnly")
    get iconOnly(): boolean {
        return this._iconOnly;
    }
    set iconOnly(newValue: boolean) {
        newValue = newValue || false;

        if(this._iconOnly !== newValue) {
            if(this._iconOnly) {
                this.removeClasses([ButtonDirective.iconOnlyStyle]);
            }

            this._iconOnly = newValue;

            if(newValue) {
                this.addClasses([ButtonDirective.iconOnlyStyle]);
            }
        }
    }

    ngOnInit() {
        this.addClasses(["btn"]);

        this.addClasses(this.role.classes);
        this.addClasses(this.size.classes);

        if(this.block) {
            this.addClasses([ButtonDirective.blockStyle]);
        }

        if(this.iconOnly) {
            this.addClasses([ButtonDirective.iconOnlyStyle]);
        }
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
