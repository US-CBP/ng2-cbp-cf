import { CommonModule }                 from '@angular/common';
import { NgModule }                     from '@angular/core';
import { FormsModule }                  from '@angular/forms';
import {
    MdProgressSpinnerModule,
    MdRippleModule,
    OverlayModule,
}                                       from '@angular/material';

import { DropdownTreeFieldComponent }   from './dropdown-tree-field.component';
import { DropdownTreeItemComponent }    from './dropdown-tree-item';
import { VIEWPORT_RULER_PROVIDER }      from './viewport-ruler';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        MdProgressSpinnerModule,
        MdRippleModule,
        OverlayModule,
    ],
    exports: [
        DropdownTreeFieldComponent,
    ],
    declarations: [
        DropdownTreeFieldComponent,
        DropdownTreeItemComponent,
    ],
    providers: [
        VIEWPORT_RULER_PROVIDER,
    ],
})
export class DropdownTreeFieldModule {
}
