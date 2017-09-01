import { PortalModule }                     from "@angular/cdk/portal";
import { CommonModule }                     from '@angular/common';
import { NgModule }                         from '@angular/core';
import {
    MdButtonModule,
    MdIconModule,
    MdToolbarModule,
}                                           from '@angular/material';
import { RouterModule }                     from '@angular/router';

import { BadgeModule }                      from '../../badge';

import { LeftActionComponent }              from './left-action.component';
import { SideNavComponent }                 from './side-nav.component';
import { ToolbarComponent }                 from './toolbar.component';
import { toolbarServiceProvider }           from './toolbar.service';

@NgModule({
    imports: [
        CommonModule,
        MdButtonModule,
        MdIconModule,
        MdToolbarModule,
        PortalModule,
        RouterModule,
        BadgeModule,
    ],
    exports: [
        SideNavComponent,
        ToolbarComponent,
    ],
    declarations: [
        LeftActionComponent,
        SideNavComponent,
        ToolbarComponent,
    ],
    providers: [
        toolbarServiceProvider,
    ],
})
export class ToolbarModule {
}
