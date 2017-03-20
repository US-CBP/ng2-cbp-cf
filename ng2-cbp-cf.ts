import { NgModule }             from '@angular/core';

import {
    BadgeModule,
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
    BadgeModule,
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
