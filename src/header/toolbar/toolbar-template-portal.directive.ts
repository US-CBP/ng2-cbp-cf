import {
    Directive,
    EmbeddedViewRef,
    TemplateRef,
    ViewContainerRef,
}                           from '@angular/core';
import { TemplatePortal }   from '@angular/material';

@Directive({
    selector: '[cfToolbarPortal]',
    exportAs: 'toolbarPortal',
})
export class ToolbarTemplatePortalDirective extends TemplatePortal {
    private _viewRef: EmbeddedViewRef<any>;

    constructor(
        template: TemplateRef<any>,
        viewContainerRef: ViewContainerRef) {

        super(template, viewContainerRef);
    }

    detectChangesInView(): void {
        if(this._viewRef) {
            this._viewRef.detectChanges();
        }
    }

    setViewRef(ref: EmbeddedViewRef<any>): void {
        this._viewRef = ref;
    }
}
