import { CommonModule }             from '@angular/common';
import {
    ModuleWithProviders,
    NgModule,
}                                   from '@angular/core';
import { FormsModule }              from '@angular/forms';
import { MaterialModule }           from '@angular/material';
import { RouterModule }             from '@angular/router';

import { ButtonModule }             from '../button';
import { AppHeaderComponent }       from './app-header';
import { CbpHeaderComponent }       from './cbp-header';
import { HeaderMenuItemComponent }  from './header-menu-item';
import { HeaderMenuComponent }      from './header-menu';
import { HeaderNavItemComponent }   from './header-nav-item';
import { HeaderComponent }          from './header.component';
import { MenuGroupComponent }       from './menu-group';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        MaterialModule,
        ButtonModule,
    ],
    exports: [
        AppHeaderComponent,
        CbpHeaderComponent,
        HeaderComponent,
        HeaderMenuComponent,
        HeaderNavItemComponent,
        MenuGroupComponent,
    ],
    declarations: [
        AppHeaderComponent,
        CbpHeaderComponent,
        HeaderComponent,
        HeaderMenuComponent,
        HeaderMenuItemComponent,
        HeaderNavItemComponent,
        MenuGroupComponent,
    ],
})
export class HeaderModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: HeaderModule,
            providers: [],
        };
    }
}
