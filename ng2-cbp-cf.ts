import { NgModule, ModuleWithProviders,
            CUSTOM_ELEMENTS_SCHEMA }        from '@angular/core';
import { BrowserModule }                    from '@angular/platform-browser';
import { FormsModule }                      from '@angular/forms';
import { HttpModule }                       from '@angular/http';

//import './lib/styles/cbp-theme.css';
import './lib';

import {
    ButtonDirective,
    ButtonGroupComponent,
    ButtonRole,
    ButtonRoles,
    ButtonSize,
    ButtonSizes,
    CheckboxComponent,
    CheckboxGroupComponent,
    DropdownTreeFieldComponent,
    DropdownTreeItemComponent,
    HeaderComponent,
    PaginationComponent,
    PayPeriodCalendarComponent,
    RadioButtonComponent,
    RadioGroupComponent,
    TableComponent,
    ToggleButtonDirective,
    UniqueSelectionDispatcher
}                                           from './src';

export * from './src';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule
    ],
    declarations: [
        ButtonDirective,
        ButtonGroupComponent,
        CheckboxComponent,
        CheckboxGroupComponent,
        DropdownTreeFieldComponent,
        DropdownTreeItemComponent,
        HeaderComponent,
        PaginationComponent,
        PayPeriodCalendarComponent,
        RadioButtonComponent,
        RadioGroupComponent,
        TableComponent,
        ToggleButtonDirective
    ],
    exports: [
        ButtonDirective,
        ButtonGroupComponent,
        CheckboxComponent,
        CheckboxGroupComponent,
        DropdownTreeFieldComponent,
        DropdownTreeItemComponent,
        HeaderComponent,
        PaginationComponent,
        PayPeriodCalendarComponent,
        RadioButtonComponent,
        RadioGroupComponent,
        TableComponent,
        ToggleButtonDirective
    ],
    providers: [
        UniqueSelectionDispatcher
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ]
})
export class CommonFrameworkModule {
}
