import {
    Component,
    ElementRef,
    EventEmitter,
    HostListener,
    Input,
    OnDestroy,
    OnInit,
    Output,
    ViewChild
}                               from '@angular/core';
import { Subscription }         from 'rxjs';

import { DropdownTreeService }  from './dropdown-tree.service';
import { DropdownTreeState }    from './dropdown-tree-state.model';
import { TreeNode }             from './tree-node.model';

let nextId = 1;

@Component({
    selector: 'cf-dropdown-tree-field',
    templateUrl: './dropdown-tree-field.component.html',
    styleUrls: ['./dropdown-tree-field.component.scss'],
    providers: [
        DropdownTreeService
    ]
})
export class DropdownTreeFieldComponent implements OnInit, OnDestroy {
    @Input() id: string = createUniqueId();
    @Input() label: string;
    @Output() nodeSelected: EventEmitter<TreeNode> = new EventEmitter<TreeNode>();

    @ViewChild('dropdownContainer') dropdownContainerElement: ElementRef;
    @ViewChild('combobox') comboboxElement: ElementRef;

    treeId: string;
    treeItemIdPrefix: string;
    isDropdownOpen: boolean = false;
    isFocused: boolean = false;
    ariaOwnsId: string = undefined;
    ariaActiveDescendentId: string = undefined;
    defaultNode: TreeNode;
    selectedText: string;

    dropdownLeft: number;
    dropdownTop: number;
    dropdownWidth: number;

    private _stateSubscription: Subscription;
    private _parentMap: Map<TreeNode, TreeNode>;
    private _preventWindowClickClose: boolean = false;
    private _visibleNodes: TreeNode[];
    private _defaultLabel: string;
    private _showFullSelectedPath: boolean = false;
    private _selectedNode: TreeNode;
    private _effectiveSelectedNode: TreeNode;
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

            this.selectedText = this._calculateSelectedText(this._effectiveSelectedNode);
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
            this.selectedText = this._calculateSelectedText(this._effectiveSelectedNode);
        }
    }

    ngOnInit() {
        this.treeId = `${this.id}-tree`;
        this.treeItemIdPrefix = this.treeId + '-';
        this.defaultNode = this._initializeDefaultNode();
        this._initializeNodes();

        if(this.selectedNode != null) {
            this.selectedText = this._calculateSelectedText(this.selectedNode);
        } else {
            this.selectedText = this._calculateSelectedText(this.defaultNode);
        }

        this._stateSubscription = this._service.stateObservable.subscribe(this._onStateChange.bind(this));
    }

    ngOnDestroy() {
        if(this._stateSubscription != null) {
            this._stateSubscription.unsubscribe();
        }
    }

    onComboboxFocus() {
        this.isFocused = true;
    }

    onComboboxBlur() {
        this.isFocused = false;
    }

    onComboboxClick() {
        if(this.isDropdownOpen) {
            this._closeDropdown();
        } else {
            this._openDropdown();
        }
    }

    onComboboxKeydown($event: KeyboardEvent) {
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
                    this._service.highlightNode(previousNode);
                    this._service.selectNode(previousNode);
                }

                $event.stopPropagation();
                $event.preventDefault();
            } else if(this._isKey($event, 'ArrowUp', false, true)) {
                let previousNode = this._previousVisibleNode();
                if(previousNode != null) {
                    this._service.highlightNode(previousNode);
                }

                $event.stopPropagation();
                $event.preventDefault();
            } else if(this._isKey($event, 'ArrowDown')) {
                let nextNode = this._nextVisibleNode();
                if(nextNode != null) {
                    this._service.highlightNode(nextNode);
                    this._service.selectNode(nextNode);
                }

                $event.stopPropagation();
                $event.preventDefault();
            } else if(this._isKey($event, 'ArrowDown', false, true)) {
                let nextNode = this._nextVisibleNode();
                if(nextNode != null) {
                    this._service.highlightNode(nextNode);
                }

                $event.stopPropagation();
                $event.preventDefault();
            } else if(this._isKey($event, 'ArrowLeft')) {
                let highlightedNode = this._service.currentState().highlightedNode;
                if(this._service.isNodeExpanded(highlightedNode)) {
                    this._service.collapseNode(highlightedNode);
                } else {
                    let parentNode = this._parentMap.get(highlightedNode);
                    if(parentNode != null) {
                        this._service.highlightNode(parentNode);
                        this._service.selectNode(parentNode);
                    }
                }

                $event.stopPropagation();
                $event.preventDefault();
            } else if(this._isKey($event, 'ArrowRight')) {
                let highlightedNode = this._service.currentState().highlightedNode;
                if(this._service.isNodeExpanded(highlightedNode)) {
                    this._service.highlightNode(highlightedNode.children[0]);
                    this._service.selectNode(highlightedNode.children[0]);
                } else {
                    this._service.expandNode(highlightedNode);
                }

                $event.stopPropagation();
                $event.preventDefault();
            } else if(this._isKey($event, 'Home')) {
                this._service.highlightNode(this._visibleNodes[0]);
                this._service.selectNode(this._visibleNodes[0]);

                $event.stopPropagation();
                $event.preventDefault();
            } else if(this._isKey($event, 'Home', false, true)) {
                this._service.highlightNode(this._visibleNodes[0]);

                $event.stopPropagation();
                $event.preventDefault();
            } else if(this._isKey($event, 'End')) {
                this._service.highlightNode(this._visibleNodes[this._visibleNodes.length - 1]);
                this._service.selectNode(this._visibleNodes[this._visibleNodes.length - 1]);

                $event.stopPropagation();
                $event.preventDefault();
            } else if(this._isKey($event, 'End', false, true)) {
                this._service.highlightNode(this._visibleNodes[this._visibleNodes.length - 1]);

                $event.stopPropagation();
                $event.preventDefault();
            } else if(this._isKey($event, ' ') || this._isKey($event, ' ', false, true)) {
                let highlightedNode = this._service.currentState().highlightedNode;
                this._service.selectNode(highlightedNode);
            }
        }
    }

    onLabelClick($event: MouseEvent) {
        this.comboboxElement.nativeElement.focus();

        $event.preventDefault();
        $event.stopPropagation();
    }

    onTreeClick($event: MouseEvent) {
        this.comboboxElement.nativeElement.focus();

        if((<Element>$event.target).classList.contains('text')) {
            this._closeDropdown();
        }

        $event.preventDefault();
        $event.stopPropagation();
    }

    /* tslint:disable */
    @HostListener('window:click')
    onWindowClick() {
        if(this._preventWindowClickClose) {
            this._preventWindowClickClose = false;
        } else if(this.isDropdownOpen) {
            this._closeDropdown();
            this.isFocused = false;
        }
    }
    /* tslint:enable */

    /* tslint:disable */
    @HostListener('click')
    onHostClick() {
        this._preventWindowClickClose = true;
    }
    /* tslint:enable */

    private _isKey($event: KeyboardEvent, key: string, altKey: boolean = false, ctrlKey: boolean = false): boolean {
        return $event.key === key &&
            $event.altKey === altKey &&
            $event.ctrlKey === ctrlKey &&
            $event.shiftKey === false &&
            $event.metaKey === false;
    }

    private _initializeNodes() {
        this._initializeMaps();

        let expandedNodes = new Set<TreeNode>();
        if(this.selectedNode != null) {
            this._expandNodesToNode(this.selectedNode, expandedNodes);
            this._service.setState(this.isDropdownOpen ? this.selectedNode : null, this.selectedNode, expandedNodes);
        } else {
            this._service.setState(this.isDropdownOpen ? this.defaultNode : null, this.defaultNode, expandedNodes);
        }

        this._resetVisibleNodes();
    }

    private _reinitializeState() {
        this.defaultNode = this._initializeDefaultNode();

        this._effectiveSelectedNode = this.selectedNode == null ? this.defaultNode : this.selectedNode;
        this._service.selectNode(this._effectiveSelectedNode);
        this.selectedText = this._calculateSelectedText(this._effectiveSelectedNode);
    }

    private _previousVisibleNode(): TreeNode {
        let highlightedNode = this._service.currentState().highlightedNode;
        let highlightedNodeIndex = this._visibleNodes.indexOf(highlightedNode);
        return (highlightedNodeIndex > 0) ? this._visibleNodes[highlightedNodeIndex - 1] : null;
    }

    private _nextVisibleNode(): TreeNode {
        let highlightedNode = this._service.currentState().highlightedNode;
        let highlightedNodeIndex = this._visibleNodes.indexOf(highlightedNode);
        return (highlightedNodeIndex < this._visibleNodes.length - 1) ? this._visibleNodes[highlightedNodeIndex + 1] : null;
    }

    private _openDropdown() {
        this._setDropdownPosition();

        this.isFocused = true;
        this.isDropdownOpen = true;
        this._resetVisibleNodes();

        let highlightedNode = this._calculateHighlightedOnOpen();
        this._service.highlightNode(highlightedNode);

        this.ariaOwnsId = this.treeId;
        this.ariaActiveDescendentId = this._service.createTreeItemId(this.treeItemIdPrefix, highlightedNode);
    }

    private _closeDropdown() {
        this.isFocused = true;
        this.isDropdownOpen = false;
        this._resetVisibleNodes();
        this._service.highlightNode(null);

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

    private _onStateChange(state: DropdownTreeState) {
        if(this.selectedNode !== state.selectedNode && !(this.selectedNode == null && state.selectedNode === this.defaultNode)) {
            this.nodeSelected.emit(state.selectedNode === this.defaultNode ? null : state.selectedNode);
        }
        this._resetVisibleNodes();
    }

    private _expandNodesToNode(nodeToFind: TreeNode, expandedNodes: Set<TreeNode>) {
        let parentNode = this._parentMap.get(nodeToFind);
        while(parentNode != null) {
            expandedNodes.add(parentNode);
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
            text: text,
            children: []
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

    private _processNodeForMaps(currentNode: TreeNode, parentNode: TreeNode) {
        this._parentMap.set(currentNode, parentNode);

        if(currentNode.children != null) {
            currentNode.children.forEach(node => this._processNodeForMaps(node, currentNode));
        }
    }

    private _initializeMaps() {
        this._parentMap = new Map<TreeNode, TreeNode>();

        this.nodes.forEach(node => this._processNodeForMaps(node, null));
    }

    private _processNodeForVisible(currentNode: TreeNode) {
        this._visibleNodes.push(currentNode);
        if(currentNode.children != null && currentNode.children.length > 0 && this._service.isNodeExpanded(currentNode)) {
            currentNode.children.forEach(node => this._processNodeForVisible(node));
        }
    }

    private _resetVisibleNodes() {
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

    private _setDropdownPosition() {
        let rect = <ClientRect>this.dropdownContainerElement.nativeElement.getBoundingClientRect();
        this.dropdownLeft = rect.left;
        this.dropdownTop = rect.bottom;
        this.dropdownWidth = rect.width;
    }
}

function createUniqueId() {
    return 'dropdown-tree-field-' + nextId++;
}
