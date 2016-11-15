import { CommonModule }             from '@angular/common';
import {
    ModuleWithProviders,
    NgModule
}                                   from '@angular/core';
import { RouterModule }             from '@angular/router';

import { HeaderComponent }          from './header.component';
import { HeaderMenuItemComponent }  from './header-menu-item';
import { ButtonModule }             from '../button';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        ButtonModule
    ],
    exports: [
        HeaderComponent
    ],
    declarations: [
        HeaderComponent,
        HeaderMenuItemComponent
    ]
})
export class HeaderModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: HeaderModule,
            providers: []
        };
    }
}
