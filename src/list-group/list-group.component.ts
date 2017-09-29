import {
    AfterContentInit,
    Component,
    ContentChildren,
    EventEmitter,
    Input,
    OnDestroy,
    Output,
    QueryList,
    ViewEncapsulation,
}                                   from '@angular/core';
import { Subscription }             from 'rxjs';

import { ListGroupItemComponent }   from './list-group-item';

let nextId = 0;

@Component({
    selector: 'cf-list-group',
    templateUrl: 'list-group.component.html',
    styleUrls: ['list-group.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class ListGroupComponent implements AfterContentInit, OnDestroy {
    @ContentChildren(ListGroupItemComponent) _menuItems: QueryList<ListGroupItemComponent>;
    @Input() id: string = `cf-list-group-${nextId++}`;
    @Input() height: string = 'auto';
    @Input() width: string = 'auto';
    @Input() maxheight: string = '180px';
    @Input() maxwidth: string = 'auto';
    @Input() multiSelect: boolean = false;

    @Output() dropListGroup: EventEmitter<DragEvent> = new EventEmitter<DragEvent>();
    @Output() dragoverListGroup: EventEmitter<DragEvent> = new EventEmitter<DragEvent>();
    @Output() dragleaveListGroup: EventEmitter<DragEvent> = new EventEmitter<DragEvent>();

    private _subscription: Subscription[] = [];

    constructor() {}

    ngAfterContentInit(): void {
        if(!this.multiSelect) {
            this._menuItems.forEach(item => {
                const sub = item.click.subscribe(event => { this.onToggleItemEvent(event); });
                this._subscription.push(sub);
            });
        }
    }

    ngOnDestroy(): void {
        this._subscription.forEach((sub: Subscription) => { sub.unsubscribe(); });
    }

    onToggleItemEvent(event: Event): void {
        this._menuItems.forEach((item: ListGroupItemComponent) => {
            if((event.target as Element).id !== item.id) {
                item.active = false;
            }
        });
    }

    dropContainer(event: DragEvent): void {
        this.dropListGroup.emit(event);
    }

    dragoverContainer(event: DragEvent): void {
        this.dragoverListGroup.emit(event);
    }

    dragleaveContainer(event: DragEvent): void {
        this.dragleaveListGroup.emit(event);
    }

}
