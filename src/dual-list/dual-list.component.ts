import {
    Component,
    EventEmitter,
    Input,
    Output,
    ViewEncapsulation,
    forwardRef,
}                           from '@angular/core';
import {
    ControlValueAccessor,
    NG_VALUE_ACCESSOR,
}                           from '@angular/forms';
import * as _               from 'lodash';

import {
    ButtonRoles,
    ButtonSizes,
}                           from '../button';
import { BasicList }        from './basic-list';

let nextId = 0;

/* tslint:disable:no-forward-ref */
export const dualListControlValueAccessor: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DualListComponent),
    multi: true,
};
/* tslint:enable */

export class DualListChange {
    source: DualListComponent;
    items: any[];
}

@Component({
    selector: 'cf-dual-list',
    templateUrl: 'dual-list.component.html',
    styleUrls: ['dual-list.component.scss'],
    providers: [dualListControlValueAccessor],
    encapsulation: ViewEncapsulation.None,
})
export class DualListComponent implements ControlValueAccessor {
    static AVAILABLE_LIST_NAME: string = 'available';
    static SELECTED_LIST_NAME: string = 'selected';

    @Input() id: string = `cf-dual-list-${nextId++}`;
    @Input() height: string = '500px';
    @Input() width: string = '300px';
    @Input() attrToShow: string[] = [];
    @Input() sort: boolean = true;
    @Input() attrToSort: string[] = [];

    @Output() change: EventEmitter<DualListChange> = new EventEmitter<DualListChange>();

    ButtonRoles: any = ButtonRoles;
    ButtonSizes: any = ButtonSizes;

    availableL: BasicList = new BasicList(DualListComponent.AVAILABLE_LIST_NAME);
    selectedL: BasicList = new BasicList(DualListComponent.SELECTED_LIST_NAME);

    private _source: any[] = [];
    private _selected: any[] = [];
    private _controlValueAccessorChangeFn: (value: any) => void = () => {};

    onTouched: () => any = () => {};

    constructor() {}

    private _sortMyList(list: any[]): any[] {
        if(this.sort && this.attrToSort && this.attrToSort.length > 0) {
            list = _.orderBy(list, this.attrToSort);
        }
        return list;
    }

    @Input()
    get source(): any[] {
        return this._source;
    }
    set source(source: any[]) {
        /* tslint:disable:triple-equals */
        if (source && source != this._source && source.length > 0) {
        /* tslint:enable */
            this._source = this._sortMyList(source);
            this.availableL.list = _.cloneDeep(this._source);
        }
    }

    @Input()
    get selected(): any[] {
        return this._selected;
    }
    set selected(selected: any[]){
        /* tslint:disable:triple-equals */
        if (selected && selected != this._selected && selected.length > 0) {
        /* tslint:enable */
            this._selected = this._sortMyList(selected);
            this.selectedL.list = _.cloneDeep(this._selected);
        }
    }

    dropDeselected(evt: DragEvent): void {
        this.drop(evt);
        this._moveItem(this.selectedL, this.availableL);
    }

    dropSelected(evt: DragEvent): void {
        this.drop(evt);
        this._moveItem(this.availableL, this.selectedL);
    }

    allowDropSelected(evt: DragEvent): void {
        this.allowDrop(evt, this.availableL);
    }

    allowDropDeselected(evt: DragEvent): void {
        this.allowDrop(evt, this.selectedL);
    }

    allowDrop(event: DragEvent, list: BasicList): boolean {
        event.preventDefault();
        if (!list.dragStart) {
            list.dragOver = true;
        }
        return false;
    }

    drop(event: DragEvent): void {
        event.preventDefault();
        this.dragLeave();
        this.dragEnd();
    }

    private _moveItem(from: BasicList, to: BasicList): void {
        to.list.push(...from.pick);
        // Remove the item from the source list
        _.remove(from.list, item => _.indexOf(from.pick, item) >= 0);
        from.pick.splice(0, from.pick.length);
        from.pick = [];
        from.list = this._sortMyList(from.list);
        to.list = this._sortMyList(to.list);
        this._emitChangeEvent();
    }

    private _emitChangeEvent(): void {
        let event = new DualListChange();
        event.source = this;
        event.items = _.cloneDeep(this.selectedL.list);

        this._controlValueAccessorChangeFn(this.selectedL.list);
        this.change.emit(event);
    }

    selectItem(event: MouseEvent, item: any): void {
        this._toggleItem(event, item, this.availableL);
    }

    deselectItem(event: MouseEvent, item: any): void {
        this._toggleItem(event, item, this.selectedL);
    }

    isPickedToBeSelected(item: any): boolean {
        return this._isPicked(this.availableL, item);
    }

    isPickedToBeDeselected(item: any): boolean {
        return this._isPicked(this.selectedL, item);
    }

    _isPicked(objList: BasicList, item: any): boolean {
        if(_.findIndex(objList.pick, item) !== -1) {
            return true;
        }
        return false;
    }

    _toggleItem(event: MouseEvent, item: any, objList: BasicList): void {
        if (event) {
            event.stopPropagation();
        }
        let indexList = _.findIndex(objList.list, item);
        let indexPick = _.findIndex(objList.pick, item);
        let lastItem = objList.pick[objList.pick.length - 1];
        if(event && event.shiftKey && !_.isEqual(item, lastItem)) {
            let idx = _.findIndex(objList.list, lastItem);
            if (indexList > idx) {
                for (let i = (idx + 1); i < indexList; i += 1) {
                    this._toggleItem(null, objList.list[i], objList);
                }
            } else if (idx !== -1) {
                for (let i = (indexList + 1); i < idx; i += 1)  {
                    this._toggleItem(null, objList.list[i], objList);
                }
            }
        }
        if(indexList !== -1 && indexPick === -1) {
            objList.pick.push(item);
        } else if(indexPick !== -1) {
                objList.pick.splice(indexPick, 1);
        }
    }

    dragLeave(): void {
        this.availableL.dragOver = false;
        this.selectedL.dragOver = false;
    }

    dragSelected(event: DragEvent, item: any): void {
        this._dragToggle(event, item, this.availableL);
    }

    dragDeselected(event: DragEvent, item: any): void {
        this._dragToggle(event, item, this.selectedL);
    }

    private _dragToggle(event: DragEvent, item: any, objList: BasicList): void {
        if(_.findIndex(objList.pick, item) === -1) {
            this._toggleItem(null, item, objList);
        }
        objList.dragStart = true;
        let sourceID = _.findIndex(this.source, item);
        let uniqueId: string =  this.id + '_' + sourceID.toString();
        event.dataTransfer.setData('text', uniqueId);
    }

    dragEnd(): boolean {
        this.availableL.dragStart = false;
        this.selectedL.dragStart = false;
        return false;
    }

    moveSelectAll(): void {
        this._moveAll(this.availableL, this.selectedL);
    }

    moveSelectedItem(): void {
        this._moveItem(this.availableL, this.selectedL);
    }

    moveDeselectItem(): void {
        this._moveItem(this.selectedL, this.availableL);
    }

    moveDeselectAll(): void {
        this._moveAll(this.selectedL, this.availableL);
    }

    private _moveAll(fromList: BasicList, toList: BasicList): void {
        fromList.pick.splice(0, fromList.pick.length);
        fromList.list = _.cloneDeep(this.source);
        fromList.pick = fromList.list;
        this._moveItem(fromList, toList);
    }

    writeValue(selectedValues: any): void {
        this.selected = selectedValues;
    }

    registerOnChange(fn: (value: any) => void): void {
        this._controlValueAccessorChangeFn = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }
}
