import { OverlayModule }                from '@angular/cdk/overlay';
import { CommonModule }                 from '@angular/common';
import { NgModule }                     from '@angular/core';
import { FormsModule }                  from '@angular/forms';
import {
    ErrorStateMatcher,
    MatRippleModule,
}                                       from '@angular/material/core';
import { MatFormFieldModule }           from '@angular/material/form-field';
import { MatIconModule }                from '@angular/material/icon';

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
        ErrorStateMatcher,
    ],
})
export class DropdownTreeModule {
}
