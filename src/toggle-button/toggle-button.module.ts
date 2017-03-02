import { CommonModule }             from '@angular/common';
import {
    ModuleWithProviders,
    NgModule,
}                                   from '@angular/core';

import { ButtonModule }             from '../button';
import { ToggleButtonDirective }    from './toggle-button.directive';

@NgModule({
    imports: [
        CommonModule,
        ButtonModule,
    ],
    exports: [
        ToggleButtonDirective,
    ],
    declarations: [
        ToggleButtonDirective,
    ],
})
export class ToggleButtonModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: ToggleButtonModule,
            providers: [],
        };
    }
}
