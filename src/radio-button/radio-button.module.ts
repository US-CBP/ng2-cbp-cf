import { CommonModule }                 from '@angular/common';
import {
    ModuleWithProviders,
    NgModule,
}                                       from '@angular/core';
import { FormsModule }                  from '@angular/forms';

import { UniqueSelectionDispatcher }    from '../shared';
import { RadioButtonComponent }         from './radio-button.component';
import { RadioGroupComponent }          from './radio-group.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
    ],
    exports: [
        RadioButtonComponent,
        RadioGroupComponent,
    ],
    declarations: [
        RadioButtonComponent,
        RadioGroupComponent,
    ],
})
export class RadioButtonModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: RadioButtonModule,
            providers: [
                UniqueSelectionDispatcher,
            ],
        };
    }
}
