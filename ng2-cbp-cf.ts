import { NgModule, ModuleWithProviders,
            CUSTOM_ELEMENTS_SCHEMA }        from '@angular/core';
import { BrowserModule }                    from '@angular/platform-browser';
import { FormsModule }                      from '@angular/forms';
import { HttpModule }                       from '@angular/http';

import 'cbp-theme/dist/cbp-theme.css';
import 'cbp-theme/dist/jquery.js';
import 'cbp-theme/dist/inputmask.js';
// for now I need it for the header bootstrap to work
// I will remove it soon when I have bootstrap menu component
// who can be used in multi places
import 'cbp-theme/dist/cbp-theme.js';

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
    DualListComponent,
    HeaderComponent,
    ListGroupItemComponent,
    ListGroupComponent,
    PaginationComponent,
    PayPeriodCalendarComponent,
    RadioButtonComponent,
    RadioGroupComponent,
    SelectFieldComponent,
    TableComponent,
    ToggleButtonDirective,
    UniqueSelectionDispatcher
}                                           from './src';

export * from './src';

const components = [
    ButtonDirective,
    ButtonGroupComponent,
    CheckboxComponent,
    CheckboxGroupComponent,
    DropdownTreeFieldComponent,
    DropdownTreeItemComponent,
    DualListComponent,
    HeaderComponent,
    ListGroupItemComponent,
    ListGroupComponent,
    PaginationComponent,
    PayPeriodCalendarComponent,
    RadioButtonComponent,
    RadioGroupComponent,
    SelectFieldComponent,
    TableComponent,
    ToggleButtonDirective
];

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule
    ],
    declarations: components,
    exports: components,
    providers: [
        UniqueSelectionDispatcher
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ]
})
export class CommonFrameworkModule {
}
