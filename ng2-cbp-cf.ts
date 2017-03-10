import {
    ModuleWithProviders,
    NgModule
}                                           from '@angular/core';

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
        HeaderModule,
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
