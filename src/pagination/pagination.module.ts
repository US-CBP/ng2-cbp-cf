import { CommonModule }         from '@angular/common';
import {
    ModuleWithProviders,
    NgModule,
}                               from '@angular/core';

import { ButtonModule }         from '../button';
import { PaginationComponent }  from './pagination.component';

@NgModule({
    imports: [
        CommonModule,
        ButtonModule,
    ],
    exports: [
        PaginationComponent,
    ],
    declarations: [
        PaginationComponent,
    ],
})
export class PaginationModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: PaginationModule,
            providers: [],
        };
    }
}
