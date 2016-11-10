import { CommonModule }             from '@angular/common';
import {
    ModuleWithProviders,
    NgModule
}                                   from '@angular/core';

import { ListGroupComponent }       from './list-group.component';
import { ListGroupItemComponent }   from './list-group-item';

@NgModule({
    imports: [
        CommonModule
    ],
    exports: [
        ListGroupComponent,
        ListGroupItemComponent
    ],
    declarations: [
        ListGroupComponent,
        ListGroupItemComponent
    ]
})
export class ListGroupModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: ListGroupModule,
            providers: []
        };
    }
}
