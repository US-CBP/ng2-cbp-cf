import { CommonModule }             from '@angular/common';
import {
    ModuleWithProviders,
    NgModule
}                                   from '@angular/core';
import { FormsModule }              from '@angular/forms';

import { CheckboxComponent }        from './checkbox.component';
import { CheckboxGroupComponent }   from './checkbox-group.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule
    ],
    exports: [
        CheckboxComponent,
        CheckboxGroupComponent
    ],
    declarations: [
        CheckboxComponent,
        CheckboxGroupComponent
    ]
})
export class CheckboxModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: CheckboxModule,
            providers: []
        };
    }
}
