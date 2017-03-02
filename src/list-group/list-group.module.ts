import { CommonModule }             from '@angular/common';
import {
    ModuleWithProviders,
    NgModule,
}                                   from '@angular/core';

import { ListGroupItemComponent }   from './list-group-item';
import { ListGroupComponent }       from './list-group.component';

@NgModule({
    imports: [
        CommonModule,
    ],
    exports: [
        ListGroupComponent,
        ListGroupItemComponent,
    ],
    declarations: [
        ListGroupComponent,
        ListGroupItemComponent,
    ],
})
export class ListGroupModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: ListGroupModule,
            providers: [],
        };
    }
}
