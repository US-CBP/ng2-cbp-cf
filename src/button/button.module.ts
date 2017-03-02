import { CommonModule }         from '@angular/common';
import {
    ModuleWithProviders,
    NgModule
}                               from '@angular/core';

import { ButtonGroupComponent } from './button-group.component';
import { ButtonDirective }      from './button.directive';

@NgModule({
    imports: [
        CommonModule
    ],
    exports: [
        ButtonDirective,
        ButtonGroupComponent
    ],
    declarations: [
        ButtonDirective,
        ButtonGroupComponent
    ]
})
export class ButtonModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: ButtonModule,
            providers: []
        };
    }
}
