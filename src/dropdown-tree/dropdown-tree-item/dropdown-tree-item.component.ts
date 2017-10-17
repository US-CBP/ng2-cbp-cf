﻿import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnInit,
    Output,
    ViewChild,
    ViewEncapsulation,
}                                       from '@angular/core';

import { TreeNode }                     from '../tree-node.model';

@Component({
    selector: 'cf-dropdown-tree-item',
    templateUrl: 'dropdown-tree-item.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class DropdownTreeItemComponent implements OnInit {
    @Input() idPrefix: string;
    @Output() nodeCollapsed: EventEmitter<TreeNode> = new EventEmitter<TreeNode>();
    @Output() nodeExpanded: EventEmitter<TreeNode> = new EventEmitter<TreeNode>();
    @Output() nodeHighlighted: EventEmitter<TreeNode> = new EventEmitter<TreeNode>();
    @Output() nodeSelected: EventEmitter<TreeNode> = new EventEmitter<TreeNode>();

    @ViewChild('text') textElement: ElementRef;

    id: string;
    isHighlighted: boolean;
    isSelected: boolean;
    isSelectable: boolean;
    isExpanded: boolean;
    hasChildren: boolean;
    showChildren: boolean;

    private _node: TreeNode;
    private _highlightedNode: TreeNode;
    private _selectedNode: TreeNode;
    private _expandedNodes: Set<TreeNode>;

    constructor() { }

    ngOnInit(): void {
        this.id = this.idPrefix + this.node.id.toString();
    }

    @Input()
    get node(): TreeNode {
        return this._node;
    }
    set node(newValue: TreeNode) {
        if(this._node !== newValue) {
            this._node = newValue;
            this.hasChildren = this._node.children != null && this._node.children.length > 0;
            this.isSelectable = this._node.selectable == null || this._node.selectable;

            this._processExpansion();
            this._processHighlightedNode();
            this._processSelectedNode();
        }
    }

    @Input()
    get highlightedNode(): TreeNode {
        return this._highlightedNode;
    }
    set highlightedNode(newValue: TreeNode) {
        if(this._highlightedNode !== newValue) {
            this._highlightedNode = newValue;

            this._processHighlightedNode();
        }
    }

    @Input()
    get selectedNode(): TreeNode {
        return this._selectedNode;
    }
    set selectedNode(newValue: TreeNode) {
        if(this._selectedNode !== newValue) {
            this._selectedNode = newValue;

            this._processSelectedNode();
        }
    }

    @Input()
    get expandedNodes(): Set<TreeNode> {
        return this._expandedNodes;
    }
    set expandedNodes(newValue: Set<TreeNode>) {
        if(this._expandedNodes !== newValue) {
            this._expandedNodes = newValue;

            this._processExpansion();
        }
    }

    get expanderIcon(): string {
        if(!this.hasChildren) {
            return null;
        }

        if(this.isExpanded) {
            return 'keyboard_arrow_down';
        } else {
            return 'keyboard_arrow_right';
        }
    }

    onExpanderClick(): void {
        if(this.hasChildren) {
            if(this.isExpanded) {
                this.nodeCollapsed.emit(this.node);
            } else {
                this.nodeExpanded.emit(this.node);
            }
        }
    }

    onChildNodeCollapsed(childNode: TreeNode): void {
        this.nodeCollapsed.emit(childNode);
    }

    onChildNodeExpanded(childNode: TreeNode): void {
        this.nodeExpanded.emit(childNode);
    }

    onNodeMouseEnter(): void {
        this.nodeHighlighted.emit(this.node);
    }

    onChildNodeHighlighted(childNode: TreeNode): void {
        this.nodeHighlighted.emit(childNode);
    }

    onNodeClick(): void {
        if(this.node.selectable == null || this.node.selectable) {
            this.nodeSelected.emit(this.node);
        }
    }

    onChildNodeSelected(childNode: TreeNode): void {
        this.nodeSelected.emit(childNode);
    }

    private _processExpansion(): void {
        if(this.node && this.expandedNodes) {
            this.isExpanded = this.hasChildren ? this.expandedNodes.has(this.node) : undefined;
            this.showChildren = this.hasChildren && this.isExpanded;
        }
    }

    private _processHighlightedNode(): void {
        this.isHighlighted = this.highlightedNode === this.node;
    }

    private _processSelectedNode(): void {
        this.isSelected = this.selectedNode === this.node;
    }
}
