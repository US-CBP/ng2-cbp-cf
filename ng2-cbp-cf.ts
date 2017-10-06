import { NgModule }             from '@angular/core';

import {
    BadgeModule,
    DropdownTreeModule,
    DualListModule,
    HeaderModule,
    ListGroupModule,
    PayPeriodCalendarModule,
}                               from './src';

const modules: any[] = [
    BadgeModule,
    DropdownTreeModule,
    DualListModule,
    HeaderModule,
    ListGroupModule,
    PayPeriodCalendarModule,
];

@NgModule({
    imports: modules,
    exports: modules
})
export class CommonFrameworkModule {
}
