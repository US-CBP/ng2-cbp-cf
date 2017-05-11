import { CommonModule }                     from '@angular/common';
import { NgModule }                         from '@angular/core';
import {
    MdButtonModule,
    MdIconModule,
    MdToolbarModule,
    PortalModule,
}                                           from '@angular/material';
import { RouterModule }                     from '@angular/router';

import { BadgeModule }                      from '../../badge';

import { LeftActionComponent }              from './left-action.component';
import { SideNavComponent }                 from './side-nav.component';
import { ToolbarHostDirective }             from './toolbar-host.directive';
import { ToolbarTemplatePortalDirective }   from './toolbar-template-portal.directive';
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
        ToolbarTemplatePortalDirective,
    ],
    declarations: [
        LeftActionComponent,
        SideNavComponent,
        ToolbarComponent,
        ToolbarHostDirective,
        ToolbarTemplatePortalDirective,
    ],
    providers: [
        toolbarServiceProvider,
    ],
})
export class ToolbarModule {
}
