import {
    AnimationEntryMetadata,
    Attribute,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnInit,
    Optional,
    Output,
    Renderer,
    Self,
    ViewChild,
    ViewEncapsulation,
    animate,
    state,
    style,
    transition,
    trigger,
}                               from '@angular/core';
import {
    ControlValueAccessor,
    NgControl,
}                               from '@angular/forms';
import {
    ConnectedOverlayDirective,
    ConnectionPositionPair,
    Dir,
}                               from '@angular/material';

import {
    BooleanFieldValue,
    isKey,
}                               from '../shared';
import { TreeNode }             from './tree-node.model';
import { ViewportRuler }        from './viewport-ruler';

const transformPlaceholder: AnimationEntryMetadata = trigger('transformPlaceholder', [
    state('floating-ltr', style({
        top: '-22px',
        left: '-2px',
        transform: 'scale(0.75)',
    })),
    state('floating-rtl', style({
        top: '-22px',
        left: '2px',
        transform: 'scale(0.75)',
    })),
    transition('* => *', animate('400ms cubic-bezier(0.25, 0.8, 0.25, 1)')),
]);

const transformPanel: AnimationEntryMetadata = trigger('transformPanel', [
    state('showing', style({
        opacity: 1,
        minWidth: 'calc(100% + 32px)',
        transform: 'scaleY(1)',
    })),
    transition('void => *', [
        style({
            opacity: 0,
            minWidth: '100%',
            transform: 'scaleY(0)',
        }),
        animate('150ms cubic-bezier(0.25, 0.8, 0.25, 1)'),
    ]),
    transition('* => void', [
        animate('250ms 100ms linear', style({ opacity: 0 })),
    ]),
]);

const fadeInContent: AnimationEntryMetadata = trigger('fadeInContent', [
    state('showing', style({ opacity: 1 })),
    transition('void => showing', [
        style({ opacity: 0 }),
        animate('150ms 100ms cubic-bezier(0.55, 0, 0.55, 0.2)'),
    ]),
]);

let nextId = 1;

export const dropdownTreeMaxNodesDisplayed: number = 5;
export const dropdownTreeNodeHeight: number = 48;
export const dropdownTreeNodeHeightAdjustment: number = 9;
export const dropdownTreePanelMaxHeight: number = 256;
export const dropdownTreePanelPaddingX: number = 16;
export const dropdownTreePanelPaddingY: number = 16;
export const dropdownTreePanelViewportPadding: number = 8;
export const dropdownTreeTriggerHeight: number = 30;

export type CfDropdownTreePlaceholderType = 'always' | 'never' | 'auto';

@Component({
    selector: 'cf-dropdown-tree-field',
    templateUrl: './dropdown-tree-field.component.html',
    styleUrls: ['./dropdown-tree-field.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    /* tslint:disable:use-host-property-decorator */
    host: {
        'role': 'combobox',
        '[attr.tabindex]': 'tabIndex',
        '[attr.aria-label]': 'placeholder',
        '[attr.aria-required]': 'required.toString()',
        '[attr.aria-disabled]': 'disabled.toString()',
        '[attr.aria-invalid]': 'control?.invalid || "false"',
        '[attr.aria-owns]': 'treeId',
        '[class.cf-dropdown-tree-disabled]': 'disabled',
        '[class.cf-dropdown-tree]': 'true',
        '(keydown)': 'onTriggerKeydown($event)',
        '(blur)': 'onTriggerBlur()',
    },
    /* tslint:enable */
    animations: [
        transformPlaceholder,
        transformPanel,
        fadeInContent,
    ],
    exportAs: 'cfDropdownTree',
})
export class DropdownTreeFieldComponent implements OnInit, ControlValueAccessor {
    @Input() id: string = createUniqueId();
    @Input() @BooleanFieldValue() required: boolean = false;
    @Input() @BooleanFieldValue() disabled: boolean = false;
    @Input() isLoading: boolean = false;

    @Output() opened: EventEmitter<void> = new EventEmitter<void>();
    @Output() closed: EventEmitter<void> = new EventEmitter<void>();

    @ViewChild('trigger') trigger: ElementRef;
    @ViewChild(ConnectedOverlayDirective) overlayDir: ConnectedOverlayDirective;

    triggerWidth: number;
    selectedValueWidth: number;
    transformOrigin: string = 'top';
    panelDoneAnimating: boolean = false;
    offsetX: number = 0;
    offsetY: number = 0;
    positions: ConnectionPositionPair[] = [
        {
            originX: 'start',
            originY: 'top',
            overlayX: 'start',
            overlayY: 'top',
        },
        {
            originX: 'start',
            originY: 'bottom',
            overlayX: 'start',
            overlayY: 'bottom',
        },
    ];
    treeId: string;
    treeItemIdPrefix: string;
    defaultNode: TreeNode;
    highlightedNode: TreeNode;
    expandedNodes: Set<TreeNode>;
    effectiveSelectedNode: TreeNode;

    private _scrollTop: number = 0;
    private _placeholderState: string = '';
    private _parentMap: Map<TreeNode, TreeNode>;
    private _visibleNodes: TreeNode[];
    private _selectedNode: TreeNode;

    /* tslint:disable:no-attribute-parameter-decorator */
    constructor(
        private _element: ElementRef,
        private _renderer: Renderer,
        private _viewportRuler: ViewportRuler,
        private _changeDetector: ChangeDetectorRef,
        @Optional() private _dir: Dir,
        @Self() @Optional() public control: NgControl,
        @Attribute('tabindex') tabIndex: string) {

        if(this.control) {
            this.control.valueAccessor = this;
        }

        this._tabIndex = parseInt(tabIndex, 10) || 0;
    }
    /* tslint:enable */

    private _placeholder: string; // tslint:disable-line:member-ordering
    @Input()
    get placeholder(): string {
        return this._placeholder;
    }
    set placeholder(newValue: string) {
        this._placeholder = newValue;

        Promise.resolve(null).then(() => this.triggerWidth = this._getWidth());
    }

    private _floatPlaceholder: CfDropdownTreePlaceholderType = 'auto'; // tslint:disable-line:member-ordering
    @Input()
    get floatPlaceholder(): CfDropdownTreePlaceholderType {
        return this._floatPlaceholder;
    }
    set floatPlaceholder(newValue: CfDropdownTreePlaceholderType) {
        this._floatPlaceholder = newValue || 'auto';
    }

    private _tabIndex: number; // tslint:disable-line:member-ordering
    @Input()
    get tabIndex(): number {
        return this.disabled ? -1 : this._tabIndex;
    }
    set tabIndex(newValue: number) {
        if(typeof newValue !== 'undefined') {
            this._tabIndex = newValue;
        }
    }

    private _defaultLabel: string; // tslint:disable-line:member-ordering
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

    private _showFullSelectedPath: boolean = false; // tslint:disable-line:member-ordering
    @Input()
    get showFullSelectedPath(): boolean {
        return this._showFullSelectedPath;
    }
    set showFullSelectedPath(newValue: boolean) {
        if(this._showFullSelectedPath !== newValue) {
            this._showFullSelectedPath = newValue;

            this._triggerValue = this._calculateSelectedText(this.effectiveSelectedNode);
            this._setValueWidth();
        }
    }

    private _nodes: TreeNode[]; // tslint:disable-line:member-ordering
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

    private _isPanelOpen: boolean = false; // tslint:disable-line:member-ordering
    get isPanelOpen(): boolean {
        return this._isPanelOpen;
    }

    private _triggerValue: string; // tslint:disable-line:member-ordering
    get triggerValue(): string {
        return this._triggerValue;
    }

    get panelHeight(): number {
        return this._visibleNodes == null || this._visibleNodes.length === 0 ?
            dropdownTreePanelMaxHeight :
            Math.min(this._visibleNodes.length * dropdownTreeNodeHeight, dropdownTreePanelMaxHeight);
    }

    ngOnInit(): void {
        this.treeId = `${this.id}-tree`;
        this.treeItemIdPrefix = this.treeId + '-';
        this._initializeNodes();
    }

    toggle(): void {
        this.isPanelOpen ? this.close() : this.open();
    }

    open(): void {
        if(this.disabled) {
            return;
        }
        this._placeholderState = this._floatPlaceholderState();
        this._isPanelOpen = true;

        this._resetVisibleNodes();

        this.highlightedNode = this._calculateHighlightedOnOpen();

        this._calculateOverlayPosition();

        this.opened.emit();
    }

    close(): void {
        if(this._isPanelOpen) {
            this._isPanelOpen = false;
            this._resetVisibleNodes();
            this.highlightedNode = null;

            if(this._selectedNode == null && this.defaultLabel == null) {
                this._placeholderState = '';
            }

            this._focusHost();

            this.closed.emit();
        }
    }

    writeValue(value: TreeNode): void {
        this._selectedNode = value;
        this._reinitializeState();

        if(this._selectedNode != null && this.nodes != null) {
            this._expandNodesToNode(this._selectedNode);
        }

        this._changeDetector.markForCheck();
    }

    registerOnChange(fn: (value: TreeNode) => void): void {
        this._onChange = fn;
    }

    registerOnTouched(fn: () => {}): void {
        this._onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    onTriggerKeydown(event: KeyboardEvent): void {
        if(isKey(event, 'ArrowDown', { altKey: true }) ||
            isKey(event, 'Down', { altKey: true }) ||
            isKey(event, ' ') ||
            isKey(event, 'Spacebar') ||
            isKey(event, 'Enter')) {

            this.open();
        }
    }

    onTriggerBlur(): void {
        if(!this.isPanelOpen) {
            this._onTouched();
        }
    }

    onPanelDone(): void {
        if(this.isPanelOpen) {
            this._calculateHighlightedOnOpen();
            this.opened.emit();
        } else {
            this.closed.emit();
        }
    }

    onPanelKeydown(event: KeyboardEvent): void {
        if(isKey(event, 'ArrowUp', { altKey: true }) ||
            isKey(event, 'Up', { altKey: true }) ||
            isKey(event, 'Escape') ||
            isKey(event, 'Tab')) {

            this.close();
        } else if(isKey(event, 'ArrowUp') ||
            isKey(event, 'Up')) {

            let previousNode = this._previousVisibleNode();
            if(previousNode != null) {
                this.highlightedNode = previousNode;
                this._emitSelectedNode(previousNode);
            }
        } else if(isKey(event, 'ArrowUp', { ctrlKey: true }) ||
            isKey(event, 'Up', { ctrlKey: true })) {

            let previousNode = this._previousVisibleNode();
            if(previousNode != null) {
                this.highlightedNode = previousNode;
            }
        } else if(isKey(event, 'ArrowDown') ||
            isKey(event, 'Down')) {

            let nextNode = this._nextVisibleNode();
            if(nextNode != null) {
                this.highlightedNode = nextNode;
                this._emitSelectedNode(nextNode);
            }
        } else if(isKey(event, 'ArrowDown', { ctrlKey: true }) ||
            isKey(event, 'Down', { ctrlKey: true })) {

            let nextNode = this._nextVisibleNode();
            if(nextNode != null) {
                this.highlightedNode = nextNode;
            }
        } else if(isKey(event, 'ArrowLeft') ||
            isKey(event, 'Left')) {

            if(this.expandedNodes.has(this.highlightedNode)) {
                this.collapseNode(this.highlightedNode);
            } else {
                let parentNode = this._parentMap.get(this.highlightedNode);
                if(parentNode != null) {
                    this.highlightedNode = parentNode;
                    this._emitSelectedNode(parentNode);
                }
            }
        } else if(isKey(event, 'ArrowRight') ||
            isKey(event, 'Right')) {

            let originalHighlightedNode = this.highlightedNode;
            if(this.expandedNodes.has(originalHighlightedNode)) {
                this.highlightedNode = originalHighlightedNode.children[0];
                this._emitSelectedNode(originalHighlightedNode.children[0]);
            } else {
                this.expandNode(originalHighlightedNode);
            }
        } else if(isKey(event, 'Home')) {
            this.highlightedNode = this._visibleNodes[0];
            this._emitSelectedNode(this._visibleNodes[0]);
        } else if(isKey(event, 'Home', { ctrlKey: true })) {
            this.highlightedNode = this._visibleNodes[0];
        } else if(isKey(event, 'End')) {
            this.highlightedNode = this._visibleNodes[this._visibleNodes.length - 1];
            this._emitSelectedNode(this._visibleNodes[this._visibleNodes.length - 1]);
        } else if(isKey(event, 'End', { ctrlKey: true })) {
            this.highlightedNode = this._visibleNodes[this._visibleNodes.length - 1];
        } else if(isKey(event, ' ') ||
            isKey(event, ' ', { ctrlKey: true }) ||
            isKey(event, 'Spacebar') ||
            isKey(event, 'Spacebar', { ctrlKey: true }) ||
            isKey(event, 'Enter')) {

            this._emitSelectedNode(this.highlightedNode);
            this.close();
        }
    }

    onFadeInDone(): void {
        this.panelDoneAnimating = this.isPanelOpen;
    }

    setScrollTop(): void {
        const scrollContainer = this.overlayDir.overlayRef.overlayElement.querySelector('.cf-dropdown-tree-panel');
        scrollContainer.scrollTop = this._scrollTop;
    }

    getPlaceholderAnimationState(): string {
        if(this.floatPlaceholder === 'never') {
            return '';
        }

        if(this.floatPlaceholder === 'always') {
            return this._floatPlaceholderState();
        }

        return this._placeholderState;
    }

    getPlaceholderVisibility(): 'visible' | 'hidden' {
        return (this.floatPlaceholder !== 'never') ? 'visible' : 'hidden';
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
        this.close();
    }

    private _onChange: (value: TreeNode) => void = () => { };
    private _onTouched: () => void = () => { };

    private _isRtl(): boolean {
        return this._dir ? this._dir.value === 'rtl' : false;
    }

    private _getWidth(): number {
        return this._getTriggerRect().width;
    }

    private _getTriggerRect(): ClientRect {
        return (<Element>this.trigger.nativeElement).getBoundingClientRect();
    }

    private _setValueWidth(): void {
        this.selectedValueWidth = this.triggerWidth - 13;
    }

    private _focusHost(): void {
        this._renderer.invokeElementMethod(this._element.nativeElement, 'focus');
    }

    private _calculateOverlayPosition(): void {
        this.offsetX = dropdownTreePanelPaddingX;

        if(!this._isRtl()) {
            this.offsetX *= -1;
        }

        const scrollContainerHeight = this._visibleNodes.length * dropdownTreeNodeHeight;
        const panelHeight = Math.min(scrollContainerHeight, dropdownTreePanelMaxHeight);
        const maxScroll = scrollContainerHeight - panelHeight;

        const selectedIndex = this._visibleNodes.indexOf(this.highlightedNode);
        const scrollBuffer = panelHeight / 2;

        this._scrollTop = this._calculateOverlayScroll(selectedIndex, scrollBuffer, maxScroll);
        this.offsetY = this._calculateOverlayOffset(selectedIndex, scrollBuffer, maxScroll);

        this._checkOverlayWithinViewport(maxScroll);
    }

    private _calculateOverlayScroll(selectedIndex: number, scrollBuffer: number, maxScroll: number): number {
        const treeNodeOffsetFromScrollTop = dropdownTreeNodeHeight * selectedIndex;
        const halfTreeNodeHeight = dropdownTreeNodeHeight / 2;
        const optimalScrollPosition = treeNodeOffsetFromScrollTop - scrollBuffer + halfTreeNodeHeight;

        return clampValue(0, optimalScrollPosition, maxScroll);
    }

    private _calculateOverlayOffset(selectedIndex: number, scrollBuffer: number, maxScroll: number): number {
        let treeNodeOffsetFromPanelTop: number;

        if(this._scrollTop === 0) {
            treeNodeOffsetFromPanelTop = selectedIndex * dropdownTreeNodeHeight;
        } else if(this._scrollTop === maxScroll) {
            const firstDisplayedIndex = this._visibleNodes.length - dropdownTreeMaxNodesDisplayed;
            const selectedDisplayIndex = selectedIndex - firstDisplayedIndex;

            treeNodeOffsetFromPanelTop = (selectedDisplayIndex * dropdownTreeNodeHeight) + dropdownTreePanelPaddingY;
        } else {
            treeNodeOffsetFromPanelTop = scrollBuffer - (dropdownTreeNodeHeight / 2);
        }

        return (treeNodeOffsetFromPanelTop * -1) - dropdownTreeNodeHeightAdjustment;
    }

    private _checkOverlayWithinViewport(maxScroll: number): void {
        const viewportRect = this._viewportRuler.getViewportRect();
        const triggerRect = this._getTriggerRect();

        const topSpaceAvailable = triggerRect.top - dropdownTreePanelViewportPadding;
        const bottomSpaceAvailable = viewportRect.height - triggerRect.bottom - dropdownTreePanelViewportPadding;

        const panelHeightTop = Math.abs(this.offsetY);
        const totalPanelHeight = Math.min(this._visibleNodes.length * dropdownTreeNodeHeight, dropdownTreePanelMaxHeight);
        const panelHeightBottom = totalPanelHeight - panelHeightTop - triggerRect.height;

        if(panelHeightBottom > bottomSpaceAvailable) {
            this._adjustPanelUp(panelHeightBottom, bottomSpaceAvailable);
        } else if(panelHeightTop > topSpaceAvailable) {
            this._adjustPanelDown(panelHeightTop, topSpaceAvailable, maxScroll);
        } else {
            this.transformOrigin = this._getOriginBasedOnTreeNode();
        }
    }

    private _adjustPanelUp(panelHeightBottom: number, bottomSpaceAvailable: number): void {
        const distanceBelowViewport = panelHeightBottom - bottomSpaceAvailable;

        this._scrollTop -= distanceBelowViewport;
        this.offsetY -= distanceBelowViewport;
        this.transformOrigin = this._getOriginBasedOnTreeNode();

        if(this._scrollTop <= 0) {
            this._scrollTop = 0;
            this.offsetY = 0;
            this.transformOrigin = '50% bottom 0px';
        }
    }

    private _adjustPanelDown(panelHeightTop: number, topSpaceAvailable: number, maxScroll: number): void {
        const distanceAboveViewport = panelHeightTop - topSpaceAvailable;

        this._scrollTop += distanceAboveViewport;
        this.offsetY += distanceAboveViewport;
        this.transformOrigin = this._getOriginBasedOnTreeNode();

        if(this._scrollTop >= maxScroll) {
            this._scrollTop = maxScroll;
            this.offsetY = 0;
            this.transformOrigin = '50% top 0px';
        }
    }

    private _getOriginBasedOnTreeNode(): string {
        const originY = Math.abs(this.offsetY) - dropdownTreeNodeHeightAdjustment + (dropdownTreeNodeHeight / 2);
        return `50% ${originY}px 0px`;
    }

    private _floatPlaceholderState(): string {
        return this._isRtl() ? 'floating-rtl' : 'floating-ltr';
    }

    private _initializeNodes(): void {
        this._initializeMaps();
        this._reinitializeState();

        this.highlightedNode = this.isPanelOpen ? this.effectiveSelectedNode : null;

        this.expandedNodes = new Set<TreeNode>();
        if(this._selectedNode != null) {
            this._expandNodesToNode(this._selectedNode);
        }

        this._resetVisibleNodes();
    }

    private _reinitializeState(): void {
        this.defaultNode = this._initializeDefaultNode();

        this.effectiveSelectedNode = this._selectedNode == null ? this.defaultNode : this._selectedNode;
        this._triggerValue = this._calculateSelectedText(this.effectiveSelectedNode);
        this._setValueWidth();
    }

    private _previousVisibleNode(): TreeNode {
        let highlightedNodeIndex = this._visibleNodes.indexOf(this.highlightedNode);
        return (highlightedNodeIndex > 0) ? this._visibleNodes[highlightedNodeIndex - 1] : null;
    }

    private _nextVisibleNode(): TreeNode {
        let highlightedNodeIndex = this._visibleNodes.indexOf(this.highlightedNode);
        return (highlightedNodeIndex < this._visibleNodes.length - 1) ? this._visibleNodes[highlightedNodeIndex + 1] : null;
    }

    private _calculateHighlightedOnOpen(): TreeNode {
        if(this._visibleNodes.indexOf(this._selectedNode) === -1) {
            return this._visibleNodes[0];
        } else {
            return this._selectedNode;
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
        } else if(this._selectedNode == null) {
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
        if(this.isPanelOpen) {
            this._visibleNodes = [];
            if(this.defaultNode != null) {
                this._visibleNodes.push(this.defaultNode);
            }
            this.nodes.forEach(node => this._processNodeForVisible(node));
        } else {
            this._visibleNodes = null;
        }
    }

    private _emitSelectedNode(node: TreeNode): void {
        this._selectedNode = node;
        this._reinitializeState();

        this._onChange(node === this.defaultNode ? null : node);
    }
}

function createUniqueId(): string {
    return 'dropdown-tree-field-' + nextId++;
}

function clampValue(min: number, n: number, max: number): number {
    return Math.min(Math.max(min, n), max);
}
