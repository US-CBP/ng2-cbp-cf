import { NgModule }             from '@angular/core';

import {
    BadgeModule,
    DropdownTreeFieldModule,
    DualListModule,
    HeaderModule,
    ListGroupModule,
    PayPeriodCalendarModule,
}                               from './src';

const modules: any[] = [
    BadgeModule,
    DropdownTreeFieldModule,
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
