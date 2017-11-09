import { CommonModule }                 from '@angular/common';
import {
    CUSTOM_ELEMENTS_SCHEMA,
    NgModule,
}                                       from '@angular/core';
import { FormsModule }                  from '@angular/forms';
import {
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
}                                       from '@angular/material';

import { PayPeriodCalendarComponent }   from './pay-period-calendar.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        MatButtonModule,
        MatIconModule,
        MatSelectModule,
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
}
