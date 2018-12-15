import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    Output,
}                           from '@angular/core';
import { Observable }       from 'rxjs';

export interface HeaderMenuItem {
    html: string;
    name: string;
    type: string;
    url: string;
    classes: string;
}

export interface HeaderMenu {
    html: string;
    type: string;
    name: string;
    url: string;
    classes: string;
    hasMenu: boolean;
    menu: HeaderMenuItem[];
}

@Component({
    selector: 'cf-side-nav',
    templateUrl: 'side-nav.component.html',
    styleUrls: ['side-nav.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideNavComponent {
    @Input() appMenu: Observable<HeaderMenu> | undefined;

    @Output() onRouteClicked: EventEmitter<void> = new EventEmitter<void>();

    openMenuNames: Set<string> = new Set<string>();

    constructor() { }

    isHidden(menuName: string): boolean {
        return !this.openMenuNames.has(menuName);
    }

    openMenu(menuName: string): void {
        if(this.openMenuNames.has(menuName)) {
            this.openMenuNames.delete(menuName);
        } else {
            this.openMenuNames.add(menuName);
        }
    }

    getIcon(menuName: string): string {
        return this.isHidden(menuName) ? 'expand_more' : 'expand_less';
    }

    routeClicked(): void {
        this.onRouteClicked.emit();
    }
}
