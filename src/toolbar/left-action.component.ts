import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    Input,
    OnDestroy,
    QueryList,
    ViewChildren,
}                                   from '@angular/core';
import {
    Subject,
    fromEvent,
}                                   from 'rxjs';
import {
    debounceTime,
    filter,
    mergeMap,
    takeUntil,
}                                   from 'rxjs/operators';

import {
    LeftAction,
    LocationBackAction,
    LocationCloseAction,
}                                   from './left-action.model';

@Component({
    selector: 'cf-toolbar-left-action',
    templateUrl: 'left-action.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LeftActionComponent implements AfterViewInit, OnDestroy {
    @Input() leftAction: LeftAction = null;

    @ViewChildren('btn', { read: ElementRef }) viewChildren: QueryList<ElementRef>;

    private _destroy$: Subject<void> = new Subject<void>();

    constructor() { }

    ngAfterViewInit(): void {
        this.viewChildren.changes
            .pipe(
                filter(buttons => buttons.length > 0),
                mergeMap(buttons => this.leftAction instanceof LocationCloseAction ||
                    this.leftAction instanceof LocationBackAction ?
                    fromEvent(buttons.first.nativeElement, 'click').pipe(debounceTime(500)) :
                    fromEvent(buttons.first.nativeElement, 'click')),
                takeUntil(this._destroy$))
            .subscribe(() => this._clickAction());
    }

    ngOnDestroy(): void {
        this._destroy$.next();
        this._destroy$.complete();
    }

    private _clickAction(): void {
        this.leftAction.action();
    }
}
