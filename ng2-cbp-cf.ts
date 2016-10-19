import { NgModule, ModuleWithProviders,
            CUSTOM_ELEMENTS_SCHEMA }        from '@angular/core';
import { BrowserModule }                    from '@angular/platform-browser';
import { FormsModule }                      from '@angular/forms';
import { HttpModule }                       from '@angular/http';

import './lib/styles/cbp-theme.css';
import './lib';

import {
    DropdownTreeFieldComponent,
    DropdownTreeItemComponent,
    HeaderComponent,
    UniqueSelectionDispatcher,
    TableComponent,
    PaginationComponent,
    RadioButtonComponent,
    RadioGroupComponent,
    PayPeriodCalendarComponent }    from './src';


@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule
    ],
    declarations: [
        DropdownTreeFieldComponent,
        DropdownTreeItemComponent,
        HeaderComponent,
        TableComponent,
        PaginationComponent,
        RadioButtonComponent,
        RadioGroupComponent,
        PayPeriodCalendarComponent
    ],
    exports: [
        DropdownTreeFieldComponent,
        DropdownTreeItemComponent,
        HeaderComponent,
        TableComponent,
        PaginationComponent,
        RadioButtonComponent,
        RadioGroupComponent,
        PayPeriodCalendarComponent
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

