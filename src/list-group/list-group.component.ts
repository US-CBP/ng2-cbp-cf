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

    ngAfterContentInit() {
        if(!this.multiSelect) {
            this._menuItems.forEach(item => {
                let sub = item.click.subscribe(event => { this.onToggleItemEvent(event); });
                this._subscription.push(sub);
            });
        }
    }

    ngOnDestroy() {
        this._subscription.forEach((sub: Subscription) => { sub.unsubscribe(); });
    }

    onToggleItemEvent(event: Event) {
        this._menuItems.forEach((item: ListGroupItemComponent) => {
            if((<Element>event.target).id !== item.id) {
                item.active = false;
            }
        });
    }

    dropContainer(event: DragEvent) {
        this.dropListGroup.emit(event);
    }

    dragoverContainer(event: DragEvent) {
        this.dragoverListGroup.emit(event);
    }

    dragleaveContainer(event: DragEvent) {
        this.dragleaveListGroup.emit(event);
    }

}
