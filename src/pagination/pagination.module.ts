import { CommonModule }         from '@angular/common';
import {
    ModuleWithProviders,
    NgModule
}                               from '@angular/core';

import { PaginationComponent }  from './pagination.component';
import { ButtonModule }         from '../button';

@NgModule({
    imports: [
        CommonModule,
        ButtonModule
    ],
    exports: [
        PaginationComponent
    ],
    declarations: [
        PaginationComponent
    ]
})
export class PaginationModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: PaginationModule,
            providers: []
        };
    }
}
