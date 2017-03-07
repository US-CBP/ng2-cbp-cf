import { CommonModule }                 from '@angular/common';
import {
    CUSTOM_ELEMENTS_SCHEMA,
    ModuleWithProviders,
    NgModule,
}                                       from '@angular/core';
import { FormsModule }                  from '@angular/forms';
import { MaterialModule }               from '@angular/material';

import { PayPeriodCalendarComponent }   from './pay-period-calendar.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        MaterialModule,
    ],
    exports: [
        PayPeriodCalendarComponent,
    ],
    declarations: [
        PayPeriodCalendarComponent,
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
    ],
})
export class PayPeriodCalendarModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: PayPeriodCalendarModule,
            providers: [],
        };
    }
}
