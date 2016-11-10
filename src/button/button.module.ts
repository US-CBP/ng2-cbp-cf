import { CommonModule }         from '@angular/common';
import {
    ModuleWithProviders,
    NgModule
}                               from '@angular/core';

import { ButtonDirective }      from './button.directive';
import { ButtonGroupComponent } from './button-group.component';

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
