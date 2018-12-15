import {
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
    @Input() idPrefix: string | undefined;

    @Output() nodeCollapsed: EventEmitter<TreeNode> = new EventEmitter<TreeNode>();
    @Output() nodeExpanded: EventEmitter<TreeNode> = new EventEmitter<TreeNode>();
    @Output() nodeHighlighted: EventEmitter<TreeNode> = new EventEmitter<TreeNode>();
    @Output() nodeSelected: EventEmitter<TreeNode> = new EventEmitter<TreeNode>();

    @ViewChild('text') textElement: ElementRef | undefined;

    id: string | undefined;
    isHighlighted: boolean = false;
    isSelected: boolean = false;
    isSelectable: boolean = false;
    isExpanded: boolean | undefined;
    hasChildren: boolean = false;
    showChildren: boolean = false;

    private _node: TreeNode | undefined;
    private _highlightedNode: TreeNode | undefined;
    private _selectedNode: TreeNode | undefined;
    private _expandedNodes: Set<TreeNode> = new Set<TreeNode>();

    constructor() { }

    ngOnInit(): void {
        const nodeId = this.node == null ? undefined : this.node.id.toString();
        this.id = this.idPrefix + nodeId;
    }

    @Input()
    get node(): TreeNode | undefined {
        return this._node;
    }
    set node(newValue: TreeNode | undefined) {
        if(this._node !== newValue) {
            this._node = newValue;
            this.hasChildren = this._node != null && this._node.children != null && this._node.children.length > 0;
            this.isSelectable = this._isNodeSelectable(this._node);

            this._processExpansion();
            this._processHighlightedNode();
            this._processSelectedNode();
        }
    }

    @Input()
    get highlightedNode(): TreeNode | undefined {
        return this._highlightedNode;
    }
    set highlightedNode(newValue: TreeNode | undefined) {
        if(this._highlightedNode !== newValue) {
            this._highlightedNode = newValue;

            this._processHighlightedNode();
        }
    }

    @Input()
    get selectedNode(): TreeNode | undefined {
        return this._selectedNode;
    }
    set selectedNode(newValue: TreeNode | undefined) {
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

    get expanderIcon(): string | undefined {
        if(!this.hasChildren) {
            return undefined;
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
        if(this._isNodeSelectable(this.node)) {
            this.nodeSelected.emit(this.node);
        }
    }

    onChildNodeSelected(childNode: TreeNode): void {
        this.nodeSelected.emit(childNode);
    }

    private _processExpansion(): void {
        if(this.node && this.expandedNodes) {
            this.isExpanded = this.hasChildren ? this.expandedNodes.has(this.node) : undefined;
            this.showChildren = this.hasChildren && this.expandedNodes.has(this.node);
        }
    }

    private _processHighlightedNode(): void {
        this.isHighlighted = this.highlightedNode === this.node;
    }

    private _processSelectedNode(): void {
        this.isSelected = this.selectedNode === this.node;
    }

    private _isNodeSelectable(node: TreeNode | undefined): boolean {
        return node != null && (node.selectable == null || node.selectable);
    }
}
