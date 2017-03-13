import { CommonModule }         from '@angular/common';
import { NgModule }             from '@angular/core';

import { PaginationComponent }  from './pagination.component';

@NgModule({
    imports: [
        CommonModule,
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
