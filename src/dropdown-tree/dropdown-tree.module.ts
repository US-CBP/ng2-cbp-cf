import { OverlayModule }                from '@angular/cdk/overlay';
import { CommonModule }                 from '@angular/common';
import { NgModule }                     from '@angular/core';
import { FormsModule }                  from '@angular/forms';
import {
    MatFormFieldModule,
    MatIconModule,
    MatRippleModule,
    NoConflictStyleCompatibilityMode,
}                                       from '@angular/material';

import { DropdownTreeItemComponent }    from './dropdown-tree-item';
import {
    DropdownTreeComponent,
    dropdownTreeScrollStrategyProvider,
}                                       from './dropdown-tree.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        MatIconModule,
        MatRippleModule,
        NoConflictStyleCompatibilityMode,
        OverlayModule,
    ],
    exports: [
        MatFormFieldModule,
        DropdownTreeComponent,
    ],
    declarations: [
        DropdownTreeComponent,
        DropdownTreeItemComponent,
    ],
    providers: [
        dropdownTreeScrollStrategyProvider,
    ],
})
export class DropdownTreeModule {
}
