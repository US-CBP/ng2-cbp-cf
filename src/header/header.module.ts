import { CommonModule }             from '@angular/common';
import { NgModule }                 from '@angular/core';
import { FlexLayoutModule }         from '@angular/flex-layout';
import { FormsModule }              from '@angular/forms';
import {
    MdButtonModule,
    MdIconModule,
    MdInputModule,
    MdMenuModule,
}                                   from '@angular/material';
import { RouterModule }             from '@angular/router';

import { AppHeaderComponent }       from './app-header';
import { CbpHeaderComponent }       from './cbp-header';
import { HeaderMenuComponent }      from './header-menu';
import { HeaderMenuGroupComponent } from './header-menu-group';
import { HeaderNavItemComponent }   from './header-nav-item';
import { HeaderSubmenuComponent }   from './header-submenu';

@NgModule({
    imports: [
        CommonModule,
        FlexLayoutModule,
        FormsModule,
        RouterModule,
        MdButtonModule,
        MdIconModule,
        MdInputModule,
        MdMenuModule,
    ],
    exports: [
        AppHeaderComponent,
        CbpHeaderComponent,
        HeaderMenuComponent,
        HeaderMenuGroupComponent,
        HeaderNavItemComponent,
        HeaderSubmenuComponent,
    ],
    declarations: [
        AppHeaderComponent,
        CbpHeaderComponent,
        HeaderMenuComponent,
        HeaderMenuGroupComponent,
        HeaderNavItemComponent,
        HeaderSubmenuComponent,
    ],
})
export class HeaderModule {
}
