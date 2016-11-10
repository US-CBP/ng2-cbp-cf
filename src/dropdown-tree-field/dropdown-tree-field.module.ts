import { CommonModule }                 from '@angular/common';
import {
    ModuleWithProviders,
    NgModule
}                                       from '@angular/core';
import { FormsModule }                  from '@angular/forms';

import { DropdownTreeFieldComponent }   from './dropdown-tree-field.component';
import { DropdownTreeItemComponent }    from './dropdown-tree-item';

@NgModule({
    imports: [
        CommonModule,
        FormsModule
    ],
    exports: [
        DropdownTreeFieldComponent
    ],
    declarations: [
        DropdownTreeFieldComponent,
        DropdownTreeItemComponent
    ]
})
export class DropdownTreeFieldModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: DropdownTreeFieldModule,
            providers: []
        };
    }
}
