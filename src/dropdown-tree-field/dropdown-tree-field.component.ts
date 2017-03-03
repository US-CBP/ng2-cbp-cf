import {
    AfterViewChecked,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    EventEmitter,
    HostListener,
    Input,
    OnInit,
    Output,
    QueryList,
    ViewChild,
    ViewChildren,
}                               from '@angular/core';

import { DropdownTreeService }  from './dropdown-tree.service';
import { TreeNode }             from './tree-node.model';

let nextId = 1;

@Component({
    selector: 'cf-dropdown-tree-field',
    templateUrl: './dropdown-tree-field.component.html',
    styleUrls: ['./dropdown-tree-field.component.scss'],
    providers: [DropdownTreeService],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownTreeFieldComponent implements OnInit, AfterViewChecked {
    @Input() id: string = createUniqueId();
    @Input() label: string;
    @Input() isLoading: boolean = false;
    @Output() nodeSelected: EventEmitter<TreeNode> = new EventEmitter<TreeNode>();

    @ViewChild('dropdownContainer') dropdownContainerElement: ElementRef;
    @ViewChild('combobox') comboboxElement: ElementRef;
    @ViewChildren('tree') treeElementQuery: QueryList<ElementRef>;

    treeId: string;
    treeItemIdPrefix: string;
    isDropdownOpen: boolean = false;
    isFocused: boolean = false;
    ariaOwnsId: string = undefined;
    ariaActiveDescendentId: string = undefined;
    defaultNode: TreeNode;
    selectedText: string;
    highlightedNode: TreeNode;
    effectiveSelectedNode: TreeNode;
    expandedNodes: Set<TreeNode>;

    dropdownLeft: number;
    dropdownTop: number;
    dropdownWidth: number;

    private _parentMap: Map<TreeNode, TreeNode>;
    private _preventWindowClickClose: boolean = false;
    private _visibleNodes: TreeNode[];
    private _defaultLabel: string;
    private _showFullSelectedPath: boolean = false;
    private _selectedNode: TreeNode;
    private _nodes: TreeNode[];

    constructor(private _service: DropdownTreeService) {
    }

    @Input()
    get defaultLabel(): string {
        return this._defaultLabel;
    }
    set defaultLabel(newValue: string) {
        if(this._defaultLabel !== newValue) {
            this._defaultLabel = newValue;

            this._reinitializeState();
        }
    }

    @Input()
    get showFullSelectedPath(): boolean {
        return this._showFullSelectedPath;
    }
    set showFullSelectedPath(newValue: boolean) {
        if(this._showFullSelectedPath !== newValue) {
            this._showFullSelectedPath = newValue;

            this.selectedText = this._calculateSelectedText(this.effectiveSelectedNode);
        }
    }

    @Input()
    get selectedNode(): TreeNode {
        return this._selectedNode;
    }
    set selectedNode(newValue: TreeNode) {
        if(this._selectedNode !== newValue) {
            this._selectedNode = newValue;

            this._reinitializeState();
        }
    }

    @Input()
    get nodes(): TreeNode[] {
        return this._nodes;
    }
    set nodes(newValue: TreeNode[]) {
        if(this._nodes !== newValue) {
            this._nodes = newValue;

            this._initializeNodes();
        }
    }

    ngOnInit(): void {
        this.treeId = `${this.id}-tree`;
        this.treeItemIdPrefix = this.treeId + '-';
        this._initializeNodes();
    }

    ngAfterViewChecked(): void {
        if(this._service.elementToScrollTo != null) {

            let treeNativeElement = <HTMLElement>this.treeElementQuery.first.nativeElement;
            let nodeNativeElement = <HTMLElement>this._service.elementToScrollTo.nativeElement;

            if(nodeNativeElement.offsetTop < treeNativeElement.scrollTop) {
                treeNativeElement.scrollTop = nodeNativeElement.offsetTop;
            } else if(nodeNativeElement.offsetTop + nodeNativeElement.offsetHeight > treeNativeElement.scrollTop + treeNativeElement.offsetHeight) {
                treeNativeElement.scrollTop = (nodeNativeElement.offsetTop + nodeNativeElement.offsetHeight) - treeNativeElement.offsetHeight;
            }

            this._service.elementToScrollTo = null;
        }
    }

    collapseNode(node: TreeNode): void {
        let newExpandedNodes = new Set<TreeNode>(this.expandedNodes);
        newExpandedNodes.delete(node);

        this.expandedNodes = newExpandedNodes;
        this._resetVisibleNodes();
    }

    expandNode(node: TreeNode): void {
        let newExpandedNodes = new Set<TreeNode>(this.expandedNodes);
        newExpandedNodes.add(node);

        this.expandedNodes = newExpandedNodes;
        this._resetVisibleNodes();
    }

    onComboboxFocus(): void {
        this.isFocused = true;
    }

    onComboboxBlur(): void {
        this.isFocused = false;
    }

    onComboboxClick(): void {
        if(this.isDropdownOpen) {
            this._closeDropdown();
        } else {
            this._openDropdown();
        }
    }

    onComboboxKeydown($event: KeyboardEvent): void {
        if(!this.isDropdownOpen) {
            if(this._isKey($event, 'ArrowDown', true)) {
                this._openDropdown();

                $event.stopPropagation();
                $event.preventDefault();
            }
        } else {
            if(this._isKey($event, 'ArrowUp', true) || this._isKey($event, 'Escape')) {
                this._closeDropdown();

                $event.stopPropagation();
                $event.preventDefault();
            } else if(this._isKey($event, 'ArrowUp')) {
                let previousNode = this._previousVisibleNode();
                if(previousNode != null) {
                    this.highlightedNode = previousNode;
                    this._emitSelectedNode(previousNode);
                }

                $event.stopPropagation();
                $event.preventDefault();
            } else if(this._isKey($event, 'ArrowUp', false, true)) {
                let previousNode = this._previousVisibleNode();
                if(previousNode != null) {
                    this.highlightedNode = previousNode;
                }

                $event.stopPropagation();
                $event.preventDefault();
            } else if(this._isKey($event, 'ArrowDown')) {
                let nextNode = this._nextVisibleNode();
                if(nextNode != null) {
                    this.highlightedNode = nextNode;
                    this._emitSelectedNode(nextNode);
                }

                $event.stopPropagation();
                $event.preventDefault();
            } else if(this._isKey($event, 'ArrowDown', false, true)) {
                let nextNode = this._nextVisibleNode();
                if(nextNode != null) {
                    this.highlightedNode = nextNode;
                }

                $event.stopPropagation();
                $event.preventDefault();
            } else if(this._isKey($event, 'ArrowLeft')) {
                if(this.expandedNodes.has(this.highlightedNode)) {
                    this.collapseNode(this.highlightedNode);
                } else {
                    let parentNode = this._parentMap.get(this.highlightedNode);
                    if(parentNode != null) {
                        this.highlightedNode = parentNode;
                        this._emitSelectedNode(parentNode);
                    }
                }

                $event.stopPropagation();
                $event.preventDefault();
            } else if(this._isKey($event, 'ArrowRight')) {
                let originalHighlightedNode = this.highlightedNode;
                if(this.expandedNodes.has(originalHighlightedNode)) {
                    this.highlightedNode = originalHighlightedNode.children[0];
                    this._emitSelectedNode(originalHighlightedNode.children[0]);
                } else {
                    this.expandNode(originalHighlightedNode);
                }

                $event.stopPropagation();
                $event.preventDefault();
            } else if(this._isKey($event, 'Home')) {
                this.highlightedNode = this._visibleNodes[0];
                this._emitSelectedNode(this._visibleNodes[0]);

                $event.stopPropagation();
                $event.preventDefault();
            } else if(this._isKey($event, 'Home', false, true)) {
                this.highlightedNode = this._visibleNodes[0];

                $event.stopPropagation();
                $event.preventDefault();
            } else if(this._isKey($event, 'End')) {
                this.highlightedNode = this._visibleNodes[this._visibleNodes.length - 1];
                this._emitSelectedNode(this._visibleNodes[this._visibleNodes.length - 1]);

                $event.stopPropagation();
                $event.preventDefault();
            } else if(this._isKey($event, 'End', false, true)) {
                this.highlightedNode = this._visibleNodes[this._visibleNodes.length - 1];

                $event.stopPropagation();
                $event.preventDefault();
            } else if(this._isKey($event, ' ') || this._isKey($event, ' ', false, true)) {
                this._emitSelectedNode(this.highlightedNode);
            }
        }
    }

    onLabelClick($event: MouseEvent): void {
        this.comboboxElement.nativeElement.focus();

        $event.preventDefault();
        $event.stopPropagation();
    }

    onTreeClick($event: MouseEvent): void {
        this.comboboxElement.nativeElement.focus();

        if((<Element>$event.target).classList.contains('text')) {
            this._closeDropdown();
        }

        $event.preventDefault();
        $event.stopPropagation();
    }

    onNodeCollapsed(node: TreeNode): void {
        this.collapseNode(node);
    }

    onNodeExpanded(node: TreeNode): void {
        this.expandNode(node);
    }

    onNodeHighlighted(node: TreeNode): void {
        this.highlightedNode = node;
    }

    onNodeSelected(node: TreeNode): void {
        this._emitSelectedNode(node);
    }

    @HostListener('window:click')
    onWindowClick(): void {
        if(this._preventWindowClickClose) {
            this._preventWindowClickClose = false;
        } else if(this.isDropdownOpen) {
            this._closeDropdown();
            this.isFocused = false;
        }
    }

    @HostListener('click')
    onHostClick(): void {
        this._preventWindowClickClose = true;
    }

    private _isKey($event: KeyboardEvent, key: string, altKey: boolean = false, ctrlKey: boolean = false): boolean {
        return $event.key === key &&
            $event.altKey === altKey &&
            $event.ctrlKey === ctrlKey &&
            $event.shiftKey === false &&
            $event.metaKey === false;
    }

    private _initializeNodes(): void {
        this._initializeMaps();
        this._reinitializeState();

        this.highlightedNode = this.isDropdownOpen ? this.effectiveSelectedNode : null;

        this.expandedNodes = new Set<TreeNode>();
        if(this.selectedNode != null) {
            this._expandNodesToNode(this.selectedNode);
        }

        this._resetVisibleNodes();
    }

    private _reinitializeState(): void {
        this.defaultNode = this._initializeDefaultNode();

        this.effectiveSelectedNode = this.selectedNode == null ? this.defaultNode : this.selectedNode;
        this.selectedText = this._calculateSelectedText(this.effectiveSelectedNode);
    }

    private _previousVisibleNode(): TreeNode {
        let highlightedNodeIndex = this._visibleNodes.indexOf(this.highlightedNode);
        return (highlightedNodeIndex > 0) ? this._visibleNodes[highlightedNodeIndex - 1] : null;
    }

    private _nextVisibleNode(): TreeNode {
        let highlightedNodeIndex = this._visibleNodes.indexOf(this.highlightedNode);
        return (highlightedNodeIndex < this._visibleNodes.length - 1) ? this._visibleNodes[highlightedNodeIndex + 1] : null;
    }

    private _openDropdown(): void {
        this._setDropdownPosition();

        this.isFocused = true;
        this.isDropdownOpen = true;
        this._resetVisibleNodes();

        this.highlightedNode = this._calculateHighlightedOnOpen();

        this.ariaOwnsId = this.treeId;
        this.ariaActiveDescendentId = this.treeItemIdPrefix + this.highlightedNode.id.toString();
    }

    private _closeDropdown(): void {
        this.isFocused = true;
        this.isDropdownOpen = false;
        this._resetVisibleNodes();
        this.highlightedNode = null;

        this.ariaOwnsId = undefined;
        this.ariaActiveDescendentId = undefined;
    }

    private _calculateHighlightedOnOpen(): TreeNode {
        if(this._visibleNodes.indexOf(this.selectedNode) === -1) {
            return this.defaultNode == null ? this.nodes[0] : this.defaultNode;
        } else {
            return this.selectedNode;
        }
    }

    private _expandNodesToNode(nodeToFind: TreeNode): void {
        let parentNode = this._parentMap.get(nodeToFind);
        while(parentNode != null) {
            this.expandedNodes.add(parentNode);
            parentNode = this._parentMap.get(parentNode);
        }
    }

    private _initializeDefaultNode(): TreeNode {
        if(this.defaultLabel != null) {
            return (this.defaultNode != null && this.defaultNode.text === this.defaultLabel) ? this.defaultNode : this._createDefaultNode(this.defaultLabel);
        } else if(this.selectedNode == null) {
            return (this.defaultNode != null && this.defaultNode.text === '') ? this.defaultNode : this._createDefaultNode('');
        } else {
            return null;
        }
    }

    private _createDefaultNode(text: string): TreeNode {
        return {
            id: '-default-node',
            text,
            children: [],
        };
    }

    private _buildFullSelectedPathText(currentNode: TreeNode): string {
        if(currentNode == null) {
            return '';
        }

        let parent = this._parentMap.get(currentNode);
        let selectedText = currentNode.selectedText || currentNode.text;
        return parent == null ? selectedText : `${this._buildFullSelectedPathText(parent)} / ${selectedText}`;
    }

    private _calculateSelectedText(selectedNode: TreeNode): string {
        if(selectedNode == null || this._parentMap == null) {
            return '';
        }
        return this.showFullSelectedPath ?
            this._buildFullSelectedPathText(selectedNode) :
            (selectedNode.selectedText || selectedNode.text);
    }

    private _processNodeForMaps(currentNode: TreeNode, parentNode: TreeNode): void {
        this._parentMap.set(currentNode, parentNode);

        if(currentNode.children != null) {
            currentNode.children.forEach(node => this._processNodeForMaps(node, currentNode));
        }
    }

    private _initializeMaps(): void {
        this._parentMap = new Map<TreeNode, TreeNode>();

        this.nodes.forEach(node => this._processNodeForMaps(node, null));
    }

    private _processNodeForVisible(currentNode: TreeNode): void {
        this._visibleNodes.push(currentNode);
        if(currentNode.children != null && currentNode.children.length > 0 && this.expandedNodes.has(currentNode)) {
            currentNode.children.forEach(node => this._processNodeForVisible(node));
        }
    }

    private _resetVisibleNodes(): void {
        if(this.isDropdownOpen) {
            this._visibleNodes = [];
            if(this.defaultNode != null) {
                this._visibleNodes.push(this.defaultNode);
            }
            this.nodes.forEach(node => this._processNodeForVisible(node));
        } else {
            this._visibleNodes = null;
        }
    }

    private _setDropdownPosition(): void {
        let rect = <ClientRect>this.dropdownContainerElement.nativeElement.getBoundingClientRect();
        this.dropdownLeft = rect.left;
        this.dropdownTop = rect.bottom;
        this.dropdownWidth = rect.width;
    }

    private _emitSelectedNode(node: TreeNode): void {
        if(this.selectedNode !== node && !(this.selectedNode == null && node === this.defaultNode)) {
            this.nodeSelected.emit(node === this.defaultNode ? null : node);
        }
    }
}

function createUniqueId(): string {
    return 'dropdown-tree-field-' + nextId++;
}
