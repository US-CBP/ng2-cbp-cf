import {
    ComponentFactoryResolver,
    ComponentRef,
    Directive,
    Input,
    OnDestroy,
    ViewContainerRef,
}                                           from '@angular/core';
import {
    BasePortalHost,
    ComponentPortal,
    Portal,
    TemplatePortal,
}                                           from '@angular/material';

import { ToolbarTemplatePortalDirective }   from './toolbar-template-portal.directive';

@Directive({
    selector: '[cfToolbarHost]',
})
export class ToolbarHostDirective extends BasePortalHost implements OnDestroy {
    private _portal: Portal<any>;

    constructor(private _viewContainer: ViewContainerRef) {
        super();
    }

    @Input('cfToolbarHost')
    get portal(): Portal<any> {
        return this._portal;
    }
    set portal(newValue: Portal<any>) {
        this._replaceAttachedPortal(newValue);
    }

    ngOnDestroy(): void {
        this.dispose();
    }

    attachComponentPortal<T>(portal: ComponentPortal<T>): ComponentRef<T> {
        portal.setAttachedHost(this);

        let viewContainer = portal.viewContainerRef || this._viewContainer;
        let injector = portal.injector || viewContainer.parentInjector;
        let resolver = <ComponentFactoryResolver>injector.get(ComponentFactoryResolver);
        let factory = resolver.resolveComponentFactory(portal.component);

        let ref = viewContainer.createComponent(factory, viewContainer.length, injector);

        this.setDisposeFn(() => ref.destroy());

        return ref;
    }

    attachTemplatePortal(portal: TemplatePortal): Map<string, any> {
        portal.setAttachedHost(this);

        let ref = this._viewContainer.createEmbeddedView(portal.templateRef);
        this.setDisposeFn(() => this._disposeTemplatePortal(portal));

        if(portal instanceof ToolbarTemplatePortalDirective) {
            (<ToolbarTemplatePortalDirective>portal).setViewRef(ref);
        }

        return new Map<string, any>();
    }

    private _replaceAttachedPortal(p: Portal<any>): void {
        if(this.hasAttached()) {
            this.detach();
        }

        if(p) {
            this.attach(p);
            this._portal = p;
        }
    }

    private _disposeTemplatePortal(portal: TemplatePortal): void {
        this._viewContainer.clear();

        if(portal instanceof ToolbarTemplatePortalDirective) {
            (<ToolbarTemplatePortalDirective>portal).setViewRef(null);
        }
    }
}
