import { CommonModule }             from '@angular/common';
import { NgModule }                 from '@angular/core';
import { FlexLayoutModule }         from '@angular/flex-layout';
import { FormsModule }              from '@angular/forms';
import { MatButtonModule }          from '@angular/material/button';
import { MatIconModule }            from '@angular/material/icon';
import { MatInputModule }           from '@angular/material/input';
import { MatMenuModule }            from '@angular/material/menu';
import { RouterModule }             from '@angular/router';

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
        MatButtonModule,
        MatIconModule,
        MatInputModule,
        MatMenuModule,
    ],
    exports: [
        CbpHeaderComponent,
        HeaderMenuComponent,
        HeaderMenuGroupComponent,
        HeaderNavItemComponent,
        HeaderSubmenuComponent,
    ],
    declarations: [
        CbpHeaderComponent,
        HeaderMenuComponent,
        HeaderMenuGroupComponent,
        HeaderNavItemComponent,
        HeaderSubmenuComponent,
    ],
})
export class HeaderModule {
}
