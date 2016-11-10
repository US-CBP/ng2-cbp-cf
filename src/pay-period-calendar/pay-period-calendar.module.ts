﻿import { CommonModule }                 from '@angular/common';
import {
    CUSTOM_ELEMENTS_SCHEMA,
    ModuleWithProviders,
    NgModule
}                                       from '@angular/core';
import { FormsModule }                  from '@angular/forms';

import { PayPeriodCalendarComponent }   from './pay-period-calendar.component';
import { ButtonModule }                 from '../button';
import { SelectFieldModule }            from '../select-field';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        SelectFieldModule
    ],
    exports: [
        PayPeriodCalendarComponent
    ],
    declarations: [
        PayPeriodCalendarComponent
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ]
})
export class PayPeriodCalendarModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: PayPeriodCalendarModule,
            providers: []
        };
    }
}
