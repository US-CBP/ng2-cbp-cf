import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    Input,
    OnDestroy,
    OnInit,
    ViewChild
}                               from '@angular/core';
import { Subscription }         from 'rxjs';

import { DropdownTreeService }  from '../dropdown-tree.service';
import { DropdownTreeState }    from '../dropdown-tree-state.model';
import { TreeNode }             from '../tree-node.model';

@Component({
    selector: 'cf-dropdown-tree-item',
    templateUrl: 'dropdown-tree-item.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DropdownTreeItemComponent implements OnInit, OnDestroy {
    @Input() idPrefix: string;
    @Input() node: TreeNode;

    @ViewChild('text') textElement: ElementRef;

    id: string;
    isHighlighted: boolean;
    isSelected: boolean;
    isExpanded: boolean;
    hasChildren: boolean;
    showChildren: boolean;

    private _stateSubscription: Subscription;

    constructor(private _service: DropdownTreeService, private _changeDetector: ChangeDetectorRef) {
    }

    ngOnInit() {
        this.id = this._service.createTreeItemId(this.idPrefix, this.node);
        this._stateSubscription = this._service.stateObservable.subscribe(this._onStateChange.bind(this));
    }

    ngOnDestroy() {
        if(this._stateSubscription != null) {
            this._stateSubscription.unsubscribe();
        }
    }

    private _onStateChange(state: DropdownTreeState) {
        this.hasChildren = this.node.children != null && this.node.children.length > 0;
        this.isExpanded = this.hasChildren ? state.expandedNodes.has(this.node) : undefined;
        this.showChildren = this.hasChildren && this.isExpanded;

        this.isHighlighted = state.highlightedNode === this.node;

        let originalIsSelected = this.isSelected;
        this.isSelected = state.selectedNode === this.node;

        if(this.isSelected && !originalIsSelected) {
            this.textElement.nativeElement.scrollIntoView();
        }

        this._changeDetector.markForCheck();
    }

    onExpanderClick() {
        this._service.toggleNodeExpansion(this.node);
    }

    onNodeClick() {
        this._service.selectNode(this.node);
    }

    onNodeMouseEnter() {
        this._service.highlightNode(this.node);
    }
}
