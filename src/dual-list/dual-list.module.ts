import { CommonModule }         from '@angular/common';
import { NgModule }             from '@angular/core';
import { FormsModule }          from '@angular/forms';
import {
    MatButtonModule,
    MatIconModule,
}                               from '@angular/material';

import { ListGroupModule }      from '../list-group';
import { DualListComponent }    from './dual-list.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        MatButtonModule,
        MatIconModule,
        ListGroupModule,
    ],
    exports: [
        DualListComponent,
    ],
    declarations: [
        DualListComponent,
    ],
})
export class DualListModule {
}
