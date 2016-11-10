import { CommonModule }         from '@angular/common';
import {
    ModuleWithProviders,
    NgModule
}                               from '@angular/core';
import { FormsModule }          from '@angular/forms';

import { DualListComponent }    from './dual-list.component';
import { ButtonModule }         from '../button';
import { ListGroupModule }      from '../list-group';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        ListGroupModule
    ],
    exports: [
        DualListComponent
    ],
    declarations: [
        DualListComponent
    ]
})
export class DualListModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: DualListModule,
            providers: []
        };
    }
}
