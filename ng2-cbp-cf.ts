import { CommonModule }                     from '@angular/common';
import {
    ModuleWithProviders,
    NgModule
}                                           from '@angular/core';
import { FormsModule }                      from '@angular/forms';

import 'cbp-theme/dist/cbp-theme.css';
import 'cbp-theme/dist/jquery.js';
import 'cbp-theme/dist/inputmask.js';
// for now I need it for the header bootstrap to work
// I will remove it soon when I have bootstrap menu component
// who can be used in multi places
import 'cbp-theme/dist/cbp-theme.js';

import {
    ButtonModule,
    CheckboxModule,
    DropdownTreeFieldModule,
    DualListModule,
    HeaderModule,
    ListGroupModule,
    PaginationModule,
    PayPeriodCalendarModule,
    RadioButtonModule,
    SelectFieldModule,
    TableModule,
    ToggleButtonModule
}                                           from './src';

export * from './src';

const modules: any[] = [
    ButtonModule,
    CheckboxModule,
    DropdownTreeFieldModule,
    DualListModule,
    HeaderModule,
    ListGroupModule,
    PayPeriodCalendarModule,
    RadioButtonModule,
    SelectFieldModule,
    TableModule,
    ToggleButtonModule
];

@NgModule({
    imports: [
        ButtonModule.forRoot(),
        CheckboxModule.forRoot(),
        DropdownTreeFieldModule.forRoot(),
        DualListModule.forRoot(),
        HeaderModule.forRoot(),
        ListGroupModule.forRoot(),
        PaginationModule.forRoot(),
        PayPeriodCalendarModule.forRoot(),
        RadioButtonModule.forRoot(),
        SelectFieldModule.forRoot(),
        TableModule.forRoot(),
        ToggleButtonModule.forRoot()
    ],
    exports: modules
})
export class CommonFrameworkRootModule {
}

@NgModule({
    imports: modules,
    exports: modules
})
export class CommonFrameworkModule {
    static forRoot(): ModuleWithProviders {
        return { ngModule: CommonFrameworkRootModule };
    }
}
