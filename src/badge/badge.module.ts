import { CommonModule }     from '@angular/common';
import { NgModule }         from '@angular/core';
import { MaterialModule }   from '@angular/material';

import { BadgeDirective }   from './badge.directive';

@NgModule({
    imports: [
        CommonModule,
        MaterialModule,
    ],
    exports: [
        BadgeDirective,
    ],
    declarations: [
        BadgeDirective,
    ],
})
export class BadgeModule {
}
