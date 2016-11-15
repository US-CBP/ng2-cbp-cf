import { CommonModule }             from '@angular/common';
import {
    ModuleWithProviders,
    NgModule
}                                   from '@angular/core';

import { ToggleButtonDirective }    from './toggle-button.directive';
import { ButtonModule }             from '../button';

@NgModule({
    imports: [
        CommonModule,
        ButtonModule
    ],
    exports: [
        ToggleButtonDirective
    ],
    declarations: [
        ToggleButtonDirective
    ]
})
export class ToggleButtonModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: ToggleButtonModule,
            providers: []
        };
    }
}
