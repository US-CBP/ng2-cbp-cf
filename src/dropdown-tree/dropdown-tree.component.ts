import { Directionality }       from '@angular/cdk/bidi';
import {
    ConnectedOverlayDirective,
    ConnectionPositionPair,
    Overlay,
    RepositionScrollStrategy,
    ScrollStrategy,
    ViewportRuler,
}                               from '@angular/cdk/overlay';
import { first }                from '@angular/cdk/rxjs';
import {
    AnimationTriggerMetadata ,
    Attribute,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    Inject,
    InjectionToken,
    Input,
    NgZone,
    OnDestroy,
    OnInit,
    Optional,
    Output,
    Renderer2,
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
    FormControl,
    FormGroupDirective,
    NgControl,
    NgForm,
}                               from '@angular/forms';
import {
    CanDisable,
    ErrorOptions,
    ErrorStateMatcher,
    HasTabIndex,
    MAT_ERROR_GLOBAL_OPTIONS,
    MatFormField,
    MatFormFieldControl,
    defaultErrorStateMatcher,
    mixinDisabled,
    mixinTabIndex,
}                               from '@angular/material';
import { Subject }              from 'rxjs';

import {
    BooleanFieldValue,
    isKey,
}                               from '../shared';
import { TreeNode }             from './tree-node.model';

const transformPanel: AnimationTriggerMetadata  = trigger('transformPanel', [
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

const fadeInContent: AnimationTriggerMetadata = trigger('fadeInContent', [
    state('showing', style({ opacity: 1 })),
    transition('void => showing', [
        style({ opacity: 0 }),
        animate('150ms 100ms cubic-bezier(0.55, 0, 0.55, 0.2)'),
    ]),
]);

let nextUniqueId = 0;

export const dropdownTreePanelMaxHeight: number = 256;
export const dropdownTreePanelPaddingX: number = 16;
export const dropdownTreePanelIndentPaddingX: number = dropdownTreePanelPaddingX * 2;
export const dropdownTreeNodeHeightEM: number = 3;
export const dropdownTreePanelViewportPadding: number = 8;

export const dropdownTreeScrollStrategy = new InjectionToken<() => ScrollStrategy>('dropdown-tree-scroll-strategy');

export function dropdownTreeScrollStrategyProviderFactory(overlay: Overlay): () => RepositionScrollStrategy {
    return () => overlay.scrollStrategies.reposition();
}

export const dropdownTreeScrollStrategyProvider = {
    provide: dropdownTreeScrollStrategy,
    deps: [Overlay],
    useFactory: dropdownTreeScrollStrategyProviderFactory,
};

export class DropdownTreeComponentBase {
    constructor(protected _renderer: Renderer2, protected _element: ElementRef) { }
}
export const DropdownTreeComponentMixinBase = mixinTabIndex(mixinDisabled(DropdownTreeComponentBase)); // tslint:disable-line:variable-name

@Component({
    selector: 'cf-dropdown-tree',
    templateUrl: './dropdown-tree.component.html',
    styleUrls: ['./dropdown-tree.component.scss'],
    /* tslint:disable:use-input-property-decorator */
    inputs: [
        'disabled',
        'tabIndex',
    ],
    /* tslint:enable */
    encapsulation: ViewEncapsulation.None,
    preserveWhitespaces: false,
    changeDetection: ChangeDetectionStrategy.OnPush,
    /* tslint:disable:use-host-property-decorator */
    host: {
        'role': 'combobox',
        '[attr.id]': 'id',
        '[attr.tabindex]': 'tabIndex',
        '[attr.aria-label]': '_ariaLabel',
        '[attr.aria-labelledby]': '_ariaLabelledby',
        '[attr.aria-required]': 'required.toString()',
        '[attr.aria-disabled]': 'disabled.toString()',
        '[attr.aria-invalid]': 'errorState',
        '[attr.aria-owns]': 'treeId',
        '[attr.aria-describedby]': '_ariaDescribedby || null',
        '[attr.aria-activedescendant]': '_getAriaActiveDescendant()',
        '[class.cf-dropdown-tree-disabled]': 'disabled',
        '[class.cf-dropdown-tree-invalid]': 'errorState',
        '[class.cf-dropdown-tree-required]': 'required',
        'class': 'cf-dropdown-tree',
        '(keydown)': '_onKeydown($event)',
        '(focus)': '_onFocus()',
        '(blur)': '_onBlur()',
    },
    /* tslint:enable */
    animations: [
        transformPanel,
        fadeInContent,
    ],
    providers: [{ provide: MatFormFieldControl, useExisting: DropdownTreeComponent }],
    exportAs: 'cfDropdownTree',
})
export class DropdownTreeComponent
    extends DropdownTreeComponentMixinBase
    implements OnInit, OnDestroy, ControlValueAccessor, CanDisable, HasTabIndex, MatFormFieldControl<TreeNode> {

    @Input('aria-label') ariaLabel: string = ''; // tslint:disable-line:no-input-rename
    @Input('aria-labelledby') ariaLabelledby: string; // tslint:disable-line:no-input-rename
    @Input() errorStateMatcher: ErrorStateMatcher;

    @Output() opened: EventEmitter<void> = new EventEmitter<void>();
    @Output() closed: EventEmitter<void> = new EventEmitter<void>();

    @ViewChild('trigger') trigger: ElementRef;
    @ViewChild('panel') panel: ElementRef;
    @ViewChild(ConnectedOverlayDirective) overlayDir: ConnectedOverlayDirective;

    stateChanges: Subject<void> = new Subject<void>();
    focused: boolean = false;
    controlType: string = 'cf-dropdown-tree';

    treeId: string;
    treeItemIdPrefix: string;
    defaultNode: TreeNode;
    highlightedNode: TreeNode;
    expandedNodes: Set<TreeNode>;
    effectiveSelectedNode: TreeNode;

    _triggerRect: ClientRect;
    _ariaDescribedby: string;
    _triggerFontSize: number = 0;
    _transformOrigin: string = 'top';
    _panelDoneAnimating: boolean = false;
    _scrollStrategy: ScrollStrategy = this._scrollStrategyFactory();
    _offsetY: number = 0;
    _positions: ConnectionPositionPair[] = [
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

    private _destroy: Subject<void> = new Subject<void>();

    private _panelOpen: boolean = false;
    private _required: boolean = false;
    private _scrollTop: number = 0;
    private _placeholder: string;
    private _uid: string = `dropdown-tree-${nextUniqueId++}`;
    private _id: string = this._uid;
    private _errorOptions: ErrorOptions;

    private _defaultLabel: string;
    private _selectedNode: TreeNode;
    private _showFullSelectedPath: boolean = false;
    private _nodes: TreeNode[];
    private _parentMap: Map<TreeNode, TreeNode>;
    private _visibleNodes: TreeNode[];

    /* tslint:disable:no-attribute-parameter-decorator */
    constructor(
        private _viewportRuler: ViewportRuler,
        private _changeDetector: ChangeDetectorRef,
        private _ngZone: NgZone,
        renderer: Renderer2,
        element: ElementRef,
        @Optional() private _dir: Directionality,
        @Optional() private _parentForm: NgForm,
        @Optional() private _parentFormGroup: FormGroupDirective,
        @Optional() private _parentFormField: MatFormField,
        @Optional() @Inject(MAT_ERROR_GLOBAL_OPTIONS) errorOptions: ErrorOptions,
        @Self() @Optional() public ngControl: NgControl,
        @Attribute('tabindex') tabIndex: string,
        @Inject(dropdownTreeScrollStrategy) private _scrollStrategyFactory: () => ScrollStrategy) {

        super(renderer, element);

        if(this.ngControl) {
            this.ngControl.valueAccessor = this;
        }

        this.tabIndex = parseInt(tabIndex, 10) || 0;
        this._errorOptions = errorOptions ? errorOptions : {};
        this.errorStateMatcher = this._errorOptions.errorStateMatcher || defaultErrorStateMatcher;
    }
    /* tslint:enable */

    ngOnInit(): void {
        this.treeId = `${this.id}-tree`;
        this.treeItemIdPrefix = this.treeId + '-';

        this._initializeNodes();
        this._initializeDefaultNode();
        this._initializeEffectiveSelectedNode();
        this._resetVisibleNodes();

        this.stateChanges.next();
    }

    ngOnDestroy(): void {
        this._destroy.next();
        this._destroy.complete();
    }

    @Input()
    get placeholder(): string {
        return this._placeholder;
    }
    set placeholder(newValue: string) {
        this._placeholder = newValue;
        this.stateChanges.next();
    }

    @Input() @BooleanFieldValue()
    get required(): boolean {
        return this._required;
    }
    set required(newValue: boolean) {
        this._required = newValue;
        this.stateChanges.next();
    }

    @Input()
    get id(): string {
        return this._id;
    }
    set id(newValue: string) {
        this._id = newValue || this._uid;
        this.stateChanges.next();
    }

    @Input()
    get value(): TreeNode {
        return this._selectedNode;
    }
    set value(newValue: TreeNode) {
        if(this._selectedNode !== newValue) {
            this.writeValue(newValue);
        }
    }

    @Input()
    get defaultLabel(): string {
        return this._defaultLabel;
    }
    set defaultLabel(newValue: string) {
        if(this._defaultLabel !== newValue) {
            this._defaultLabel = newValue;

            this._initializeDefaultNode();
        }
    }

    @Input()
    get showFullSelectedPath(): boolean {
        return this._showFullSelectedPath;
    }
    set showFullSelectedPath(newValue: boolean) {
        if(this._showFullSelectedPath !== newValue) {
            this._showFullSelectedPath = newValue;
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
            this._resetVisibleNodes();
        }
    }

    get panelOpen(): boolean {
        return this._panelOpen;
    }

    get triggerValue(): string {
        return this._calculateSelectedText();
    }

    get empty(): boolean {
        return this.effectiveSelectedNode == null || this.effectiveSelectedNode.text === '';
    }

    get errorState(): boolean {
        const parent = this._parentFormGroup || this._parentForm;
        const matcher = this.errorStateMatcher || defaultErrorStateMatcher;
        const control = this.ngControl ? this.ngControl.control as FormControl : null;

        return matcher(control, parent);
    }

    get shouldPlaceholderFloat(): boolean {
        return this.panelOpen || !this.empty;
    }

    get _ariaLabel(): string | null {
        return this.ariaLabelledby ? null : this.ariaLabel || this.placeholder;
    }

    toggle(): void {
        this.panelOpen ? this.close() : this.open();
    }

    open(): void {
        if(this.disabled || this.nodes == null || this.nodes.length === 0) {
            return;
        }

        this._triggerRect = this.trigger.nativeElement.getBoundingClientRect();
        this._triggerFontSize = parseInt(getComputedStyle(this.trigger.nativeElement)['font-size'], 10);

        this._panelOpen = true;

        this.highlightedNode = this._calculateHighlightedOnOpen();
        this._calculateOverlayPosition();
        this._changeDetector.markForCheck();

        first.call(this._ngZone.onStable).subscribe(() => {
            if(this._triggerFontSize && this.overlayDir.overlayRef && this.overlayDir.overlayRef.overlayElement) {
                this.overlayDir.overlayRef.overlayElement.style.fontSize = `${this._triggerFontSize}px`;
            }
        });
    }

    close(): void {
        if(this._panelOpen) {
            this._panelOpen = false;
            this.highlightedNode = null;
            this._changeDetector.markForCheck();
            this.focus();
        }
    }

    writeValue(value: TreeNode): void {
        this._selectedNode = value;

        this._initializeDefaultNode();
        this._initializeEffectiveSelectedNode();

        if(value != null && this.nodes != null) {
            this._expandNodesToNode(value);
        }

        this._resetVisibleNodes();

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
        this._changeDetector.markForCheck();
        this.stateChanges.next();
    }

    focus(): void {
        this._element.nativeElement.focus();
    }

    setDescribedByIds(ids: string[]): void {
        this._ariaDescribedby = ids.join(' ');
    }

    onContainerClick(): void {
        this.focus();
        this.open();
    }

    collapseNode(node: TreeNode): void {
        const newExpandedNodes = new Set<TreeNode>(this.expandedNodes);
        newExpandedNodes.delete(node);

        this.expandedNodes = newExpandedNodes;
        this._resetVisibleNodes();
    }

    expandNode(node: TreeNode): void {
        const newExpandedNodes = new Set<TreeNode>(this.expandedNodes);
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

    _isRtl(): boolean {
        return this._dir ? this._dir.value === 'rtl' : false;
    }

    _onKeydown(event: KeyboardEvent): void {
        if(!this.disabled) {
            if(this.panelOpen) {
                this._onOpenedKeydown(event);
            } else {
                this._onClosedKeydown(event);
            }
        }
    }

    _onPanelDone(): void {
        if(this.panelOpen) {
            this._scrollTop = 0;
            this.opened.emit();
        } else {
            this.closed.emit();
            this._panelDoneAnimating = false;
            this.overlayDir.offsetX = 0;
            this._changeDetector.markForCheck();
        }
    }

    _onFadeInDone(): void {
        this._panelDoneAnimating = this.panelOpen;
        this.panel.nativeElement.focus();
        this._changeDetector.markForCheck();
    }

    _onFocus(): void {
        if(!this.disabled) {
            this.focused = true;
            this.stateChanges.next();
        }
    }

    _onBlur(): void {
        if(!this.disabled && !this.panelOpen) {
            this.focused = false;
            this._onTouched();
            this._changeDetector.markForCheck();
            this.stateChanges.next();
        }
    }

    _onAttached(): void {
        this._changeDetector.detectChanges();
        this._calculateOverlayOffsetX();
        this.panel.nativeElement.scrollTop = this._scrollTop;
    }

    _getPanelTheme(): string {
        return this._parentFormField ? `mat-${this._parentFormField.color}` : '';
    }

    _getAriaActiveDescendant(): string | null {
        if(this.panelOpen && this.effectiveSelectedNode != null) {
            return this.treeItemIdPrefix + this.effectiveSelectedNode.id.toString();
        }

        return null;
    }

    private _onChange: (value: TreeNode) => void = () => { };
    private _onTouched = () => { };

    private _onClosedKeydown(event: KeyboardEvent): void {
        if(isKey(event, 'ArrowDown', { altKey: true }) ||
            isKey(event, 'Down', { altKey: true }) ||
            isKey(event, ' ') ||
            isKey(event, 'Spacebar') ||
            isKey(event, 'Enter')) {

            event.preventDefault();

            this.open();
        }
    }

    private _onOpenedKeydown(event: KeyboardEvent): void {
        if(isKey(event, 'ArrowUp', { altKey: true }) ||
            isKey(event, 'Up', { altKey: true }) ||
            isKey(event, 'Escape') ||
            isKey(event, 'Tab')) {

            event.preventDefault();

            this.close();
        } else if(isKey(event, 'ArrowUp') || isKey(event, 'Up')) {
            event.preventDefault();

            const previousNode = this._previousVisibleNode();
            if(previousNode != null) {
                this._setHighlightedNodeAndScroll(previousNode);
                this._emitSelectedNode(previousNode);
            }
        } else if(isKey(event, 'ArrowUp', { ctrlKey: true }) || isKey(event, 'Up', { ctrlKey: true })) {
            event.preventDefault();

            const previousNode = this._previousVisibleNode();
            if(previousNode != null) {
                this._setHighlightedNodeAndScroll(previousNode);
            }
        } else if(isKey(event, 'ArrowDown') || isKey(event, 'Down')) {
            event.preventDefault();

            const nextNode = this._nextVisibleNode();
            if(nextNode != null) {
                this._setHighlightedNodeAndScroll(nextNode);
                this._emitSelectedNode(nextNode);
            }
        } else if(isKey(event, 'ArrowDown', { ctrlKey: true }) || isKey(event, 'Down', { ctrlKey: true })) {
            event.preventDefault();

            const nextNode = this._nextVisibleNode();
            if(nextNode != null) {
                this._setHighlightedNodeAndScroll(nextNode);
            }
        } else if(isKey(event, 'ArrowLeft') || isKey(event, 'Left')) {
            event.preventDefault();

            if(this.expandedNodes.has(this.highlightedNode)) {
                this.collapseNode(this.highlightedNode);
            } else {
                const parentNode = this._parentMap.get(this.highlightedNode);
                if(parentNode != null) {
                    this._setHighlightedNodeAndScroll(parentNode);
                    this._emitSelectedNode(parentNode);
                }
            }
        } else if(isKey(event, 'ArrowRight') || isKey(event, 'Right')) {
            event.preventDefault();

            const originalHighlightedNode = this.highlightedNode;
            if(this.expandedNodes.has(originalHighlightedNode)) {
                this._setHighlightedNodeAndScroll(originalHighlightedNode.children[0]);
                this._emitSelectedNode(originalHighlightedNode.children[0]);
            } else {
                this.expandNode(originalHighlightedNode);
            }
        } else if(isKey(event, 'Home')) {
            event.preventDefault();

            this._setHighlightedNodeAndScroll(this._visibleNodes[0]);
            this._emitSelectedNode(this._visibleNodes[0]);
        } else if(isKey(event, 'Home', { ctrlKey: true })) {
            event.preventDefault();

            this._setHighlightedNodeAndScroll(this._visibleNodes[0]);
        } else if(isKey(event, 'End')) {
            event.preventDefault();

            this._setHighlightedNodeAndScroll(this._visibleNodes[this._visibleNodes.length - 1]);
            this._emitSelectedNode(this._visibleNodes[this._visibleNodes.length - 1]);
        } else if(isKey(event, 'End', { ctrlKey: true })) {
            event.preventDefault();

            this._setHighlightedNodeAndScroll(this._visibleNodes[this._visibleNodes.length - 1]);
        } else if(isKey(event, ' ') ||
            isKey(event, ' ', { ctrlKey: true }) ||
            isKey(event, 'Spacebar') ||
            isKey(event, 'Spacebar', { ctrlKey: true }) ||
            isKey(event, 'Enter')) {

            event.preventDefault();

            this._emitSelectedNode(this.highlightedNode);
            this.close();
        }
    }

    private _getHighlightedNodeIndex(): number | null {
        const index = this._visibleNodes.indexOf(this.highlightedNode);
        return index === -1 ? null : index;
    }

    private _calculateOverlayPosition(): void {
        const nodeHeight = this._getNodeHeight();
        const nodes = this._getNodeCount();
        const panelHeight = Math.min(nodes * nodeHeight, dropdownTreePanelMaxHeight);
        const scrollContainerHeight = nodes * nodeHeight;
        const maxScroll = scrollContainerHeight - panelHeight;
        const highlightedNodeOffset = this.empty ? 0 : this._getHighlightedNodeIndex();
        const scrollBuffer = panelHeight / 2;

        this._scrollTop = this._calculateOverlayScroll(highlightedNodeOffset, scrollBuffer, maxScroll);
        this._offsetY = this._calculateOverlayOffsetY(highlightedNodeOffset, scrollBuffer, maxScroll);

        this._checkOverlayWithinViewport(maxScroll);
    }

    private _calculateOverlayScroll(highlightedIndex: number, scrollBuffer: number, maxScroll: number): number {
        const nodeHeight = this._getNodeHeight();
        const nodeOffsetFromScrollTop = nodeHeight * highlightedIndex;
        const halfNodeHeight = nodeHeight / 2;
        const optimalScrollPosition = nodeOffsetFromScrollTop - scrollBuffer + halfNodeHeight;

        return Math.min(Math.max(0, optimalScrollPosition), maxScroll);
    }

    private _calculateOverlayOffsetX(): void {
        const overlayRect = this.overlayDir.overlayRef.overlayElement.getBoundingClientRect();
        const viewportRect = this._viewportRuler.getViewportRect();
        const isRtl = this._isRtl();
        const paddingWidth = dropdownTreePanelPaddingX * 2;

        let offsetX = isRtl ? dropdownTreePanelPaddingX : -dropdownTreePanelPaddingX;

        const leftOverflow = 0 - (overlayRect.left + offsetX - (isRtl ? paddingWidth : 0));
        const rightOverflow = overlayRect.right + offsetX - viewportRect.width + (isRtl ? 0 : paddingWidth);

        if(leftOverflow > 0) {
            offsetX += leftOverflow + dropdownTreePanelViewportPadding;
        } else if(rightOverflow > 0) {
            offsetX -= rightOverflow + dropdownTreePanelViewportPadding;
        }

        this.overlayDir.offsetX = offsetX;
        this.overlayDir.overlayRef.updatePosition();
    }

    private _calculateOverlayOffsetY(highlightedIndex: number, scrollBuffer: number, maxScroll: number): number {
        const nodeHeight = this._getNodeHeight();
        const nodeHeightAdjustment = (nodeHeight - this._triggerRect.height) / 2;
        const maxNodesDisplayed = Math.floor(dropdownTreePanelMaxHeight / nodeHeight);

        let nodeOffsetFromPanelTop: number;
        if(this._scrollTop === 0) {
            nodeOffsetFromPanelTop = highlightedIndex * nodeHeight;
        } else if(this._scrollTop === maxScroll) {
            const firstDisplayedIndex = this._getNodeCount() - maxNodesDisplayed;
            const selectedDisplayIndex = highlightedIndex - firstDisplayedIndex;
            const partialNodeHeight = nodeHeight - (this._getNodeCount() * nodeHeight - dropdownTreePanelMaxHeight) % nodeHeight;

            nodeOffsetFromPanelTop = selectedDisplayIndex * nodeHeight + partialNodeHeight;
        } else {
            nodeOffsetFromPanelTop = scrollBuffer - nodeHeight / 2;
        }

        return nodeOffsetFromPanelTop * -1 - nodeHeightAdjustment;
    }

    private _checkOverlayWithinViewport(maxScroll: number): void {
        const nodeHeight = this._getNodeHeight();
        const viewportRect = this._viewportRuler.getViewportRect();
        const topSpaceAvailable = this._triggerRect.top - dropdownTreePanelViewportPadding;
        const bottomSpaceAvailable = viewportRect.height - this._triggerRect.bottom - dropdownTreePanelViewportPadding;
        const panelHeightTop = Math.abs(this._offsetY);
        const totalPanelHeight = Math.min(this._getNodeCount() * nodeHeight, dropdownTreePanelMaxHeight);
        const panelHeightBottom = totalPanelHeight - panelHeightTop - this._triggerRect.height;

        if(panelHeightBottom > bottomSpaceAvailable) {
            this._adjustPanelUp(panelHeightBottom, bottomSpaceAvailable);
        } else if(panelHeightTop > topSpaceAvailable) {
            this._adjustPanelDown(panelHeightTop, topSpaceAvailable, maxScroll);
        } else {
            this._transformOrigin = this._getOriginBasedOnTreeNode();
        }
    }

    private _adjustPanelUp(panelHeightBottom: number, bottomSpaceAvailable: number): void {
        const distanceBelowViewport = Math.round(panelHeightBottom - bottomSpaceAvailable);

        this._scrollTop -= distanceBelowViewport;
        this._offsetY -= distanceBelowViewport;
        this._transformOrigin = this._getOriginBasedOnTreeNode();

        if(this._scrollTop <= 0) {
            this._scrollTop = 0;
            this._offsetY = 0;
            this._transformOrigin = '50% bottom 0px';
        }
    }

    private _adjustPanelDown(panelHeightTop: number, topSpaceAvailable: number, maxScroll: number): void {
        const distanceAboveViewport = Math.round(panelHeightTop - topSpaceAvailable);

        this._scrollTop += distanceAboveViewport;
        this._offsetY += distanceAboveViewport;
        this._transformOrigin = this._getOriginBasedOnTreeNode();

        if(this._scrollTop >= maxScroll) {
            this._scrollTop = maxScroll;
            this._offsetY = 0;
            this._transformOrigin = '50% top 0px';
        }
    }

    private _getOriginBasedOnTreeNode(): string {
        const nodeHeight = this._getNodeHeight();
        const nodeHeightAdjustment = (nodeHeight - this._triggerRect.height) / 2;
        const originY = Math.abs(this._offsetY) - nodeHeightAdjustment + nodeHeight / 2;

        return `50% ${originY}px 0px`;
    }

    private _getNodeCount(): number {
        return this._visibleNodes.length;
    }

    private _getNodeHeight(): number {
        return this._triggerFontSize * dropdownTreeNodeHeightEM;
    }

    private _initializeNodes(): void {
        this._initializeMaps();
        this._initializeEffectiveSelectedNode();

        this.highlightedNode = this.panelOpen ? this.effectiveSelectedNode : null;

        this.expandedNodes = new Set<TreeNode>();
        if(this._selectedNode != null) {
            this._expandNodesToNode(this._selectedNode);
        }
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
        if(currentNode.children != null && currentNode.children.length > 0 && this.expandedNodes != null && this.expandedNodes.has(currentNode)) {
            currentNode.children.forEach(node => this._processNodeForVisible(node));
        }
    }

    private _resetVisibleNodes(): void {
        this._visibleNodes = [];
        if(this.defaultNode != null) {
            this._visibleNodes.push(this.defaultNode);
        }
        if(this.nodes != null) {
            this.nodes.forEach(node => this._processNodeForVisible(node));
        }
    }

    private _initializeDefaultNode(): void {
        if(this.defaultLabel != null) {
            if(this.defaultNode == null || this.defaultNode.text !== this.defaultLabel) {
                this.defaultNode = this._createDefaultNode(this.defaultLabel);

                this._resetVisibleNodes();
                this._initializeEffectiveSelectedNode();
            }
        } else if(this._selectedNode == null) {
            if(this.defaultNode == null || this.defaultNode.text !== '') {
                this.defaultNode = this._createDefaultNode('');

                this._resetVisibleNodes();
                this._initializeEffectiveSelectedNode();
            }
        } else if(this.defaultNode != null) {
            this.defaultNode = null;

            this._resetVisibleNodes();
            this._initializeEffectiveSelectedNode();
        }
    }

    private _createDefaultNode(text: string): TreeNode {
        return {
            id: '-default-node',
            text,
            children: [],
        };
    }

    private _initializeEffectiveSelectedNode(): void {
        this.effectiveSelectedNode = this._selectedNode == null ? this.defaultNode : this._selectedNode;
    }

    private _previousVisibleNode(): TreeNode {
        const highlightedNodeIndex = this._visibleNodes.indexOf(this.highlightedNode);
        return (highlightedNodeIndex > 0) ? this._visibleNodes[highlightedNodeIndex - 1] : null;
    }

    private _nextVisibleNode(): TreeNode {
        const highlightedNodeIndex = this._visibleNodes.indexOf(this.highlightedNode);
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

    private _buildFullSelectedPathText(currentNode: TreeNode): string {
        if(currentNode == null) {
            return '';
        }

        const parent = this._parentMap.get(currentNode);
        const selectedText = currentNode.selectedText || currentNode.text;
        return parent == null ? selectedText : `${this._buildFullSelectedPathText(parent)} / ${selectedText}`;
    }

    private _calculateSelectedText(): string {
        if(this.effectiveSelectedNode == null || this._parentMap == null) {
            return '';
        }
        return this.showFullSelectedPath ?
            this._buildFullSelectedPathText(this.effectiveSelectedNode) :
            (this.effectiveSelectedNode.selectedText || this.effectiveSelectedNode.text);
    }

    private _emitSelectedNode(node: TreeNode): void {
        this._selectedNode = node;

        this._initializeDefaultNode();
        this._initializeEffectiveSelectedNode();

        this._onChange(node === this.defaultNode ? null : node);
        this._changeDetector.markForCheck();
    }

    private _scrollHighlightedNodeIntoView(): void {
        const nodeHeight = this._getNodeHeight();
        const highlightedNodeIndex = this._getHighlightedNodeIndex();
        const scrollOffset = highlightedNodeIndex * nodeHeight;
        const panelTop = this.panel.nativeElement.scrollTop;

        if(scrollOffset < panelTop) {
            this.panel.nativeElement.scrollTop = scrollOffset;
        } else if(scrollOffset + nodeHeight > panelTop + dropdownTreePanelMaxHeight) {
            this.panel.nativeElement.scrollTop = Math.max(0, scrollOffset - dropdownTreePanelMaxHeight + nodeHeight);
        }
    }

    private _setHighlightedNodeAndScroll(node: TreeNode): void {
        this.highlightedNode = node;
        this._scrollHighlightedNodeIntoView();
    }
}
