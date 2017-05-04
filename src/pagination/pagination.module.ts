import { CommonModule }         from '@angular/common';
import { NgModule }             from '@angular/core';
import { MdIconModule }         from '@angular/material';

import { PaginationComponent }  from './pagination.component';

@NgModule({
    imports: [
        CommonModule,
        MdIconModule,
    ],
    exports: [
        PaginationComponent,
    ],
    declarations: [
        PaginationComponent,
    ],
})
export class PaginationModule {
}
