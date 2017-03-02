import {
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
    QueryList,
    ViewChild,
    ViewChildren,
}                               from '@angular/core';
import * as _                   from 'lodash';

import {
    CheckboxChange,
    CheckboxComponent,
}                               from '../checkbox';
import {
    PaginationComponent,
    Query,
}                               from '../pagination';
import { Table }                from './table.model';

let nextId = 1;

export class TableSelectionChange {
    source: TableComponent;
    items: any[];
}

@Component({
    selector: 'cf-table',
    templateUrl: 'table.component.html',
    styleUrls: ['table.component.scss']
})
export class TableComponent implements OnInit {
    @Input() id: string = `cf-table-${nextId++}`;
    @Output() gettabledata: EventEmitter<Query> = new EventEmitter<Query>();
    @Output() selectionchange: EventEmitter<TableSelectionChange> = new EventEmitter<TableSelectionChange>();

    @ViewChild(PaginationComponent) pagerObj: PaginationComponent;
    @ViewChildren(CheckboxComponent) checkboxesObj: QueryList<CheckboxComponent> = null;

    private _data: Table = null;
    private _query: Query = null;
    private _selectedItems: any[] = null;

    constructor() {
        this._selectedItems = [] as any;
    }

    @Input()
    get data(): Table {
        return this._data;
    }
    set data(dt: Table) {
        this._data = dt;
        if (dt && this.query) {
            this.pagerObj.totalCount = dt.totalCount;
            this.pagerObj.setPage(this.query.page, false);
        }
    }

    @Input()
    get query(): Query {
        return this._query;
    }
    set query(qy: Query) {
        this._query = qy;
    }

    hasHeader() {
        let dt = this.data;
        if (dt.options && dt.options.hasHeader) {
            return true;
        } else {
            return false;
        }
    }

    hasStripedAltRow() {
        let dt = this.data;
        if (dt.options && dt.options.hasStripedAltRow) {
            return true;
        } else {
            return false;
        }
    }

    hasFloatingHeader() {
        let dt = this.data;
        if (dt.options && dt.options.hasFloatingHeader) {
            return true;
        } else {
            return false;
        }
    }

    showSelector() {
        let dt = this.data;
        if (dt.options && dt.options.isRowSelectable) {
            return true;
        } else {
            return false;
        }
    }

    ngOnInit() {
    }

    loadPage(query: Query) {
        this.query = query;
        this.gettabledata.emit(query);
    }

    toggleSelectAll(event: CheckboxChange) {
        this.checkboxesObj.forEach(checkbox => {
            checkbox.checked = event.checked;
        });
        this.toggleAllSelectedData(event.checked);
    }

    toggleSelectionItem(event: CheckboxChange, item: any) {
        this.toggleItemSelectedData(item, event.checked);
        this._emitSelectionChangeEvent();
    }

    private toggleItemSelectedData(item: any, selected: boolean) {
        if(selected) {
            if(!_.find(this._selectedItems, item)) {
                this._selectedItems.push(item);
            }
        } else {
            let idx = _.findIndex(this._selectedItems, item);
            if(idx !== -1) {
                this._selectedItems.splice(idx, 1);
            }
        }
    }

    private toggleAllSelectedData(selected: boolean) {
        if(selected) {
            this._selectedItems = _.clone(this.data.data);
        } else {
            this._selectedItems = [];
        }
        this._emitSelectionChangeEvent();
    }

    private _emitSelectionChangeEvent() {
        let event = new TableSelectionChange();
        event.source = this;
        event.items = this._selectedItems;

        this.selectionchange.emit(event);
    }
}
