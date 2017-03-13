import { NgModule }             from '@angular/core';

import {
    CheckboxModule,
    DropdownTreeFieldModule,
    DualListModule,
    HeaderModule,
    ListGroupModule,
    PaginationModule,
    PayPeriodCalendarModule,
    TableModule,
}                               from './src';

const modules: any[] = [
    CheckboxModule,
    DropdownTreeFieldModule,
    DualListModule,
    HeaderModule,
    ListGroupModule,
    PaginationModule,
    PayPeriodCalendarModule,
    TableModule,
];

@NgModule({
    imports: modules,
    exports: modules
})
export class CommonFrameworkModule {
}
