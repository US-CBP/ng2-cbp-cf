import { CommonModule }         from '@angular/common';
import { NgModule }             from '@angular/core';

import { CheckboxModule }       from '../checkbox';
import { PaginationModule }     from '../pagination';
import { TableComponent }       from './table.component';

@NgModule({
    imports: [
        CommonModule,
        CheckboxModule,
        PaginationModule,
    ],
    exports: [
        TableComponent,
    ],
    declarations: [
        TableComponent,
    ],
})
export class TableModule {
}
