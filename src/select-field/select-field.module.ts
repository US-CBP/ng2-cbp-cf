import { CommonModule }             from '@angular/common';
import {
    ModuleWithProviders,
    NgModule
}                                   from '@angular/core';
import { FormsModule }              from '@angular/forms';

import {
    SelectFieldComponent,
    SelectFieldOptionDirective
}                                   from './select-field.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule
    ],
    exports: [
        SelectFieldComponent,
        SelectFieldOptionDirective
    ],
    declarations: [
        SelectFieldComponent,
        SelectFieldOptionDirective
    ]
})
export class SelectFieldModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: SelectFieldModule,
            providers: []
        };
    }
}
