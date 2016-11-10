import { CommonModule }     from '@angular/common';
import {
    ModuleWithProviders,
    NgModule
}                           from '@angular/core';

import { HeaderComponent }  from './header.component';
import { ButtonModule }     from '../button';

@NgModule({
    imports: [
        CommonModule,
        ButtonModule
    ],
    exports: [
        HeaderComponent
    ],
    declarations: [
        HeaderComponent
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
