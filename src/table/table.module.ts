import { CommonModule }         from '@angular/common';
import {
    ModuleWithProviders,
    NgModule
}                               from '@angular/core';

import { TableComponent }       from './table.component';
import { CheckboxModule }       from '../checkbox';
import { PaginationModule }     from '../pagination';

@NgModule({
    imports: [
        CommonModule,
        CheckboxModule,
        PaginationModule
    ],
    exports: [
        TableComponent
    ],
    declarations: [
        TableComponent
    ]
})
export class TableModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: TableModule,
            providers: []
        };
    }
}
