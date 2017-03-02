import {
    Component,
    EventEmitter,
    Input,
    Output,
    ViewEncapsulation,
}                               from '@angular/core';
import { BooleanFieldValue }    from '../../shared';

let nextId = 0;

@Component({
    selector: 'cf-list-group-item',
    templateUrl: 'list-group-item.component.html',
    styleUrls: ['list-group-item.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class ListGroupItemComponent {
    @Input() id: string = `cf-list-group-item-${nextId++}`;
    @Input() active: boolean = false;
    /* tslint:disable:no-input-rename */
    @Input('is-draggable') @BooleanFieldValue() draggable: boolean = false;
    /* tslint:enable */
    @Output() click: EventEmitter<Event> = new EventEmitter<Event>();
    @Output() dragstartListGroupItem: EventEmitter<DragEvent> = new EventEmitter<DragEvent>();
    @Output() dragendListGroupItem: EventEmitter<DragEvent> = new EventEmitter<DragEvent>();

    constructor() {}

    toggleActive() {
        this.active = !this.active;
    }

    clickItem(event: Event) {
        this.toggleActive();
        this.click.emit(event);
    }

    dragstartContainer(event: DragEvent) {
        this.dragstartListGroupItem.emit(event);
    }

    dragendContainer(event: DragEvent) {
        this.dragendListGroupItem.emit(event);
    }
}
