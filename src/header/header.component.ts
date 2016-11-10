import {
    Component,
    OnInit,
    Input
}                           from '@angular/core';
import { Router }           from '@angular/router';
import { Header }           from './header.model';

import { ButtonRoles }      from '../button';

@Component({
    selector: 'cf-header',
    templateUrl: 'header.component.html',
    styleUrls: ['header.component.scss']
})
export class HeaderComponent implements OnInit {
    @Input() data: Header;
    @Input() disableFeedback: boolean = false;
    @Input() disableSearch: boolean = false;

    ButtonRoles: any = ButtonRoles;

    constructor(private _router: Router) {
    }

    goTo(item: any) {
        if (item.route) {
            this._router.navigate( [ item.route, {} ]);
        } else if (item.href) {
            window.location.href = item.href;
        }
    }

    ngOnInit() {
        console.log('init ' + this.data);
    }
}
