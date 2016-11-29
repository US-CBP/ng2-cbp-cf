import { DebugElement }                 from '@angular/core';
import {
    ComponentFixture,
    TestBed
}                                       from '@angular/core/testing';
import { By }                           from '@angular/platform-browser';

import { DropdownTreeFieldModule }      from './dropdown-tree-field.module';
import { DropdownTreeFieldComponent }   from './dropdown-tree-field.component';
import { TreeNode }                     from './tree-node.model';

let currentId = 1;

describe('DropdownTreeFieldComponent', () => {
    let fixture: ComponentFixture<DropdownTreeFieldComponent>;
    let component: DropdownTreeFieldComponent;
    let nodes: TreeNode[];
    let dropdownContainer: DebugElement;
    let combobox: DebugElement;
    let nodeSelected: jasmine.Spy;

    beforeEach(() => {
        nodes = createNodeTree();

        TestBed.configureTestingModule({
            imports: [DropdownTreeFieldModule.forRoot()]
        });
        fixture = TestBed.createComponent(DropdownTreeFieldComponent);

        component = fixture.componentInstance;
        component.nodes = nodes;

        nodeSelected = jasmine.createSpy('nodeSelected');
        component.nodeSelected.subscribe(nodeSelected);

        dropdownContainer = fixture.debugElement.query(By.css('span.dropdown-tree.dt--container'));
        combobox = fixture.debugElement.query(By.css('span.dt--selection-combobox'));
    });

    describe('ngOnInit', () => {
        let selectedNode: TreeNode;

        beforeEach(() => {
            selectedNode = nodes[0].children[2].children[1];
            component.selectedNode = selectedNode;
        });

        it('sets effectiveSelectedNode to selectedNode', () => {
            fixture.detectChanges();

            expect(component.effectiveSelectedNode).toBe(component.selectedNode);
        });

        it('expands nodes to selectedNode', () => {
            fixture.detectChanges();

            expect(component.expandedNodes).toEqual({
                asymmetricMatch(actual: Set<TreeNode>) {
                    return actual.size === 2 &&
                        actual.has(nodes[0]) &&
                        actual.has(nodes[0].children[2]);
                }
            });
        });

        it('expands no nodes when selectedNode is null', () => {
            component.selectedNode = null;

            fixture.detectChanges();

            expect(component.expandedNodes.size).toBe(0);
        });

        it('defaults isDropdownOpen to false', () => {
            fixture.detectChanges();

            expect(component.isDropdownOpen).toBe(false);
        });

        it('defaults ariaOwnsId to undefined', () => {
            fixture.detectChanges();

            expect(component.ariaOwnsId).toBeUndefined();
        });

        it('defaults ariaActiveDescendentId to undefined', () => {
            fixture.detectChanges();

            expect(component.ariaActiveDescendentId).toBeUndefined();
        });

        it('defaults defaultNode to null when defaultLabel is not provided', () => {
            fixture.detectChanges();

            expect(component.defaultNode).toBe(null);
        });

        it('defaults defaultNode to not null when defaultLabel is provided', () => {
            component.defaultLabel = 'Select One';

            fixture.detectChanges();

            expect(component.defaultNode).not.toBe(null);
        });

        it('defaults defaultNode text to defaultLabel when defaultLabel is provided', () => {
            component.defaultLabel = 'Select One';

            fixture.detectChanges();

            expect(component.defaultNode.text).toBe(component.defaultLabel);
        });

        it('defaults defaultNode to not null when defaultLabel is not provided and selectedNode is null', () => {
            component.selectedNode = null;

            fixture.detectChanges();

            expect(component.defaultNode).not.toBe(null);
        });

        it('defaults defaultNode text to empty string when defaultLabel is not provided and selectedNode is null', () => {
            component.selectedNode = null;

            fixture.detectChanges();

            expect(component.defaultNode.text).toBe('');
        });

        it('sets effectiveSelectedNode to defaultNode when selectedNode is null and defaultLabel is provided', () => {
            component.selectedNode = null;
            component.defaultLabel = 'Select One';

            fixture.detectChanges();

            expect(component.effectiveSelectedNode).toBe(component.defaultNode);
        });

        it('sets effectiveSelectedNode to defaultNode when selectedNode is null and defaultLabel is not provided', () => {
            component.selectedNode = null;

            fixture.detectChanges();

            expect(component.effectiveSelectedNode).toBe(component.defaultNode);
        });

        it('sets selectedText to selectedNode text when showFullSelectedPath is false and selectedNode is not null', () => {
            component.showFullSelectedPath = false;

            fixture.detectChanges();

            expect(component.selectedText).toBe(selectedNode.text);
        });

        it('sets selectedText to selectedNode selectedText when showFullSelectedPath is false and selectedNode is not null and selectedText is populated', () => {
            selectedNode.selectedText = 'Selected Text';
            component.showFullSelectedPath = false;

            fixture.detectChanges();

            expect(component.selectedText).toBe(selectedNode.selectedText);
        });

        it('sets selectedText to defaultLabel when showFullSelectedPath is false and selectedNode is null', () => {
            component.selectedNode = null;
            component.defaultLabel = 'Select One';
            component.showFullSelectedPath = false;

            fixture.detectChanges();

            expect(component.selectedText).toBe(component.defaultLabel);
        });

        it('sets selectedText to selectedNode text preceded by parent nodes\' text when showFullSelectedPath is true and selectedNode is not null', () => {
            component.showFullSelectedPath = true;

            fixture.detectChanges();

            expect(component.selectedText).toBe(`${nodes[0].text} / ${nodes[0].children[2].text} / ${selectedNode.text}`);
        });

        /* tslint:disable */
        it('sets selectedText to selectedNode selectedText preceded by parent nodes\' text when showFullSelectedPath is true and selectedNode is not null and selectedText is populated', () => {
        /* tslint:enable */
            selectedNode.selectedText = 'Selected Text';
            component.showFullSelectedPath = true;

            fixture.detectChanges();

            expect(component.selectedText).toBe(`${nodes[0].text} / ${nodes[0].children[2].text} / ${selectedNode.selectedText}`);
        });

        /* tslint:disable */
        it('sets selectedText to selectedNode text preceded by parent nodes\' selectedText when showFullSelectedPath is true and selectedNode is not null and parent selectedText is populated', () => {
        /* tslint:enable */
            nodes[0].selectedText = 'Selected Text';
            component.showFullSelectedPath = true;

            fixture.detectChanges();

            expect(component.selectedText).toBe(`${nodes[0].selectedText} / ${nodes[0].children[2].text} / ${selectedNode.text}`);
        });

        it('sets selectedText to defaultLabel when showFullSelectedPath is true and selectedNode is null', () => {
            component.selectedNode = null;
            component.defaultLabel = 'Select One';
            component.showFullSelectedPath = true;

            fixture.detectChanges();

            expect(component.selectedText).toBe(component.defaultLabel);
        });
    });

    describe('setting selectedNode', () => {
        it('sets effectiveSelectedNode to selectedNode', () => {
            let selectedNode = nodes[0].children[2].children[1];
            component.selectedNode = selectedNode;

            component.selectedNode = nodes[1];

            expect(component.effectiveSelectedNode).toBe(nodes[1]);
        });

        it('does not emit nodeSelected event', () => {
            let selectedNode = nodes[0].children[2].children[1];
            component.selectedNode = selectedNode;
            fixture.detectChanges();

            component.selectedNode = nodes[1];

            expect(nodeSelected).not.toHaveBeenCalled();
        });

        it('sets selectedText', () => {
            let selectedNode = nodes[0].children[2].children[1];
            component.selectedNode = selectedNode;
            fixture.detectChanges();

            component.selectedNode = nodes[1];

            expect(component.selectedText).toBe(nodes[1].text);
        });

        it('sets defaultNode to not null when new selectedNode is null and defaultLabel is null', () => {
            let selectedNode = nodes[0].children[2].children[1];
            component.selectedNode = selectedNode;
            fixture.detectChanges();

            component.selectedNode = null;

            expect(component.defaultNode).not.toBe(null);
        });

        it('sets effectiveSelectedNode to defaultNode when new selectedNode is null', () => {
            let selectedNode = nodes[0].children[2].children[1];
            component.selectedNode = selectedNode;
            fixture.detectChanges();

            component.selectedNode = null;

            expect(component.effectiveSelectedNode).toBe(component.defaultNode);
        });

        it('sets selectedText to defaultNode text when new selectedNode is null', () => {
            let selectedNode = nodes[0].children[2].children[1];
            component.selectedNode = selectedNode;
            fixture.detectChanges();

            component.selectedNode = null;

            expect(component.selectedText).toBe(component.defaultNode.text);
        });

        it('does not emit nodeSelected event when new selectedNode is null', () => {
            let selectedNode = nodes[0].children[2].children[1];
            component.selectedNode = selectedNode;
            fixture.detectChanges();

            component.selectedNode = null;

            expect(nodeSelected).not.toHaveBeenCalled();
        });

        it('to value sets defaultNode to not null when defaultLabel is null', () => {
            component.selectedNode = null;
            fixture.detectChanges();

            component.selectedNode = nodes[0].children[2].children[1];

            expect(component.defaultNode).toBe(null);
        });
    });

    describe('setting defaultLabel', () => {
        it('to null sets defaultNode to null when previous defaultLabel is not null', () => {
            let selectedNode = nodes[0].children[2].children[1];
            component.selectedNode = selectedNode;
            component.defaultLabel = 'Select One';
            fixture.detectChanges();

            component.defaultLabel = null;

            expect(component.defaultNode).toBe(null);
        });

        it('to null sets defaultNode to new instance when previous defaultLabel is not null and selectedNode is null', () => {
            component.selectedNode = null;
            component.defaultLabel = 'Select One';
            fixture.detectChanges();

            let previousValue = component.defaultNode;

            component.defaultLabel = null;

            expect(component.defaultNode).not.toBe(previousValue);
        });

        it('to null sets defaultNode text to empty string when previous defaultLabel is not null and selectedNode is null', () => {
            component.selectedNode = null;
            component.defaultLabel = 'Select One';
            fixture.detectChanges();

            component.defaultLabel = null;

            expect(component.defaultNode.text).toBe('');
        });

        it('to null sets effectiveSelectedNode to new defaultNode when previous defaultLabel is not null and selectedNode is null', () => {
            component.selectedNode = null;
            component.defaultLabel = 'Select One';
            fixture.detectChanges();

            component.defaultLabel = null;

            expect(component.effectiveSelectedNode).toBe(component.defaultNode);
        });

        it('to null sets selectedText to new defaultNode text when previous defaultLabel is not null and selectedNode is null', () => {
            component.selectedNode = null;
            component.defaultLabel = 'Select One';
            fixture.detectChanges();

            component.defaultLabel = null;

            expect(component.selectedText).toBe(component.defaultNode.text);
        });

        it('to null does not raise nodeSelected when previous defaultLabel is not null and selectedNode is null', () => {
            component.selectedNode = null;
            component.defaultLabel = 'Select One';
            fixture.detectChanges();

            component.defaultLabel = null;

            expect(nodeSelected).not.toHaveBeenCalled();
        });

        it('sets defaultNode to new instance when previous defaultLabel is not null', () => {
            let selectedNode = nodes[0].children[2].children[1];
            component.selectedNode = selectedNode;
            component.defaultLabel = 'Select One';
            fixture.detectChanges();

            let previousValue = component.defaultNode;

            component.defaultLabel = 'New Select One';

            expect(component.defaultNode).not.toBe(previousValue);
        });

        it('sets defaultNode text to new value when previous defaultLabel is not null', () => {
            let selectedNode = nodes[0].children[2].children[1];
            component.selectedNode = selectedNode;
            component.defaultLabel = 'Select One';
            fixture.detectChanges();

            component.defaultLabel = 'New Select One';

            expect(component.defaultNode.text).toBe('New Select One');
        });

        it('sets effectiveSelectedNode to new defaultNode when previous defaultLabel is not null and selectedNode is null', () => {
            component.selectedNode = null;
            component.defaultLabel = 'Select One';
            fixture.detectChanges();

            component.defaultLabel = 'New Select One';

            expect(component.effectiveSelectedNode).toBe(component.defaultNode);
        });

        it('sets selectedText to new defaultNode text when previous defaultLabel is not null and selectedNode is null', () => {
            component.selectedNode = null;
            component.defaultLabel = 'Select One';
            fixture.detectChanges();

            component.defaultLabel = 'New Select One';

            expect(component.selectedText).toBe(component.defaultNode.text);
        });

        it('does not raise nodeSelected when previous defaultLabel is not null and selectedNode is null', () => {
            component.selectedNode = null;
            component.defaultLabel = 'Select One';
            fixture.detectChanges();

            component.defaultLabel = 'New Select One';

            expect(nodeSelected).not.toHaveBeenCalled();
        });

        it('sets defaultNode to not null when previous defaultLabel is null', () => {
            let selectedNode = nodes[0].children[2].children[1];
            component.selectedNode = selectedNode;
            component.defaultLabel = null;
            fixture.detectChanges();

            component.defaultLabel = 'Select One';

            expect(component.defaultNode).not.toBe(null);
        });

        it('sets defaultNode text to new value when previous defaultLabel is null', () => {
            let selectedNode = nodes[0].children[2].children[1];
            component.selectedNode = selectedNode;
            component.defaultLabel = null;
            fixture.detectChanges();

            component.defaultLabel = 'Select One';

            expect(component.defaultNode.text).toBe('Select One');
        });

        it('sets effectiveSelectedNode to new defaultNode when previous defaultLabel is null and selectedNode is null', () => {
            component.selectedNode = null;
            component.defaultLabel = null;
            fixture.detectChanges();

            component.defaultLabel = 'Select One';

            expect(component.effectiveSelectedNode).toBe(component.defaultNode);
        });

        it('sets selectedText to new defaultNode text when previous defaultLabel is null and selectedNode is null', () => {
            component.selectedNode = null;
            component.defaultLabel = null;
            fixture.detectChanges();

            component.defaultLabel = 'Select One';

            expect(component.selectedText).toBe(component.defaultNode.text);
        });

        it('does not raise nodeSelected when previous defaultLabel is null and selectedNode is null', () => {
            component.selectedNode = null;
            component.defaultLabel = null;
            fixture.detectChanges();

            component.defaultLabel = 'Select One';

            expect(nodeSelected).not.toHaveBeenCalled();
        });
    });

    describe('onNodeSelected', () => {
        let selectedNode: TreeNode;

        beforeEach(() => {
            selectedNode = nodes[0].children[2].children[1];
            component.selectedNode = selectedNode;
        });

        it('does not emit nodeSelected event when selectNode does not change', () => {
            fixture.detectChanges();

            component.onNodeSelected(selectedNode);

            expect(nodeSelected).not.toHaveBeenCalled();
        });

        it('emits nodeSelected event when selectedNode changes', () => {
            fixture.detectChanges();

            component.onNodeSelected(nodes[1]);

            expect(nodeSelected).toHaveBeenCalledWith(nodes[1]);
        });

        it('does not change component.selectedNode directly when selectedNode changes', () => {
            fixture.detectChanges();

            component.onNodeSelected(nodes[1]);

            expect(component.selectedNode).toEqual(selectedNode);
        });

        it('does not emit nodeSelected event when component.selectNode is null and service state.selectedNode is defaultNode', () => {
            component.selectedNode = null;

            fixture.detectChanges();

            component.onNodeSelected(component.defaultNode);

            expect(nodeSelected).not.toHaveBeenCalled();
        });

        it('emits nodeSelected event with null when selectedNode changes to defaultNode', () => {
            component.defaultLabel = 'Select One';
            fixture.detectChanges();

            component.onNodeSelected(component.defaultNode);

            expect(nodeSelected).toHaveBeenCalledWith(null);
        });

        it('does not change selectedText when selectedNode changes', () => {
            fixture.detectChanges();
            let previousValue = component.selectedText;

            component.onNodeSelected(nodes[1]);

            expect(component.selectedText).toBe(previousValue);
        });
    });

    describe('on combobox focus', () => {
        it('adds dt--selection-focus class to dropdown container', () => {
            combobox.triggerEventHandler("focus", null);
            fixture.detectChanges();

            expect(dropdownContainer.classes['dt--selection-focus']).toBe(true);
        });
    });

    describe('on combobox blur', () => {
        it('removes dt--selection-focus class to dropdown container', () => {
            combobox.triggerEventHandler("focus", null);
            fixture.detectChanges();

            combobox.triggerEventHandler("blur", null);
            fixture.detectChanges();

            expect(dropdownContainer.classes['dt--selection-focus']).toBeFalsy();
        });
    });

    describe('on combobox click', () => {
        beforeEach(() => {
            fixture.detectChanges();
        });

        describe('when closed', () => {
            it('sets isDropdownOpen to true', () => {
                combobox.triggerEventHandler("click", null);

                expect(component.isDropdownOpen).toBe(true);
            });

            it('adds dt--selection-focus class to dropdown container', () => {
                combobox.triggerEventHandler("click", null);
                fixture.detectChanges();

                expect(dropdownContainer.classes['dt--selection-focus']).toBe(true);
            });

            it('adds dt--selection-open class to dropdown container', () => {
                combobox.triggerEventHandler("click", null);
                fixture.detectChanges();

                expect(dropdownContainer.classes['dt--selection-open']).toBe(true);
            });

            it('sets ariaOwnsId to id of the tree element', () => {
                combobox.triggerEventHandler("click", null);

                expect(component.ariaOwnsId).toBe(component.treeId);
            });

            it('highlights selectedNode when visible', () => {
                let selectedNode = nodes[0].children[2].children[1];
                component.expandedNodes = new Set<TreeNode>([
                    nodes[0],
                    nodes[0].children[2],
                    nodes[0].children[2].children[1]]);
                component.selectedNode = selectedNode;

                combobox.triggerEventHandler("click", null);

                expect(component.highlightedNode).toBe(selectedNode);
            });

            it('highlights first node when selectedNode is not visible and defaultNode does not exist', () => {
                let selectedNode = nodes[0].children[2].children[1];
                component.expandedNodes = new Set<TreeNode>([nodes[0]]);
                component.selectedNode = selectedNode;
                component.defaultNode = null;

                combobox.triggerEventHandler("click", null);

                expect(component.highlightedNode).toBe(nodes[0]);
            });

            it('highlights defaultNode when selectedNode is not visible and defaultNode exists', () => {
                let selectedNode = nodes[0].children[2].children[1];
                component.expandedNodes = new Set<TreeNode>([nodes[0]]);
                component.selectedNode = selectedNode;
                component.defaultNode = createNode();

                combobox.triggerEventHandler("click", null);

                expect(component.highlightedNode).toBe(component.defaultNode);
            });

            it('sets ariaActiveDescendentId to highlightedNode element id', () => {
                let selectedNode = nodes[0].children[2].children[1];
                component.expandedNodes = new Set<TreeNode>([
                    nodes[0],
                    nodes[0].children[2],
                    nodes[0].children[2].children[1]]);
                component.selectedNode = selectedNode;

                combobox.triggerEventHandler("click", null);

                expect(component.ariaActiveDescendentId).toBe(component.treeItemIdPrefix + selectedNode.id.toString());
            });
        });

        describe('when open', () => {
            beforeEach(() => {
                combobox.triggerEventHandler("click", null);
                fixture.detectChanges();
            });

            it('sets isDropdownOpen to false', () => {
                combobox.triggerEventHandler("click", null);

                expect(component.isDropdownOpen).toBe(false);
            });

            it('adds dt--selection-focus class to dropdown container', () => {
                combobox.triggerEventHandler("click", null);
                fixture.detectChanges();

                expect(dropdownContainer.classes['dt--selection-focus']).toBe(true);
            });

            it('removes dt--selection-open class to dropdown container', () => {
                combobox.triggerEventHandler("click", null);
                fixture.detectChanges();

                expect(dropdownContainer.classes['dt--selection-open']).toBeFalsy();
            });

            it('sets ariaOwnsId to undefined', () => {
                combobox.triggerEventHandler("click", null);

                expect(component.ariaOwnsId).toBeUndefined();
            });

            it('sets ariaActiveDescendentId to undefined', () => {
                combobox.triggerEventHandler("click", null);

                expect(component.ariaActiveDescendentId).toBeUndefined();
            });
        });
    });

    describe('on combobox keydown', () => {
        beforeEach(() => {
            component.defaultLabel = 'Select One';

            fixture.detectChanges();
        });

        describe('when closed', () => {
            it('Alt+ArrowDown opens the dropdown', () => {
                let $event = new KeyboardEvent('keydown', {
                    altKey: true,
                    key: 'ArrowDown'
                });

                combobox.triggerEventHandler("keydown", $event);

                expect(component.isDropdownOpen).toBe(true);
            });
        });

        describe('when open', () => {
            beforeEach(() => {
                combobox.triggerEventHandler("click", null);
            });

            it('Alt+ArrowUp closes the dropdown', () => {
                let $event = new KeyboardEvent('keydown', {
                    altKey: true,
                    key: 'ArrowUp'
                });

                combobox.triggerEventHandler("keydown", $event);

                expect(component.isDropdownOpen).toBe(false);
            });

            it('Escape closes the dropdown', () => {
                let $event = new KeyboardEvent('keydown', {
                    key: 'Escape'
                });

                combobox.triggerEventHandler("keydown", $event);

                expect(component.isDropdownOpen).toBe(false);
            });

            it('ArrowUp highlights previous visible node of current highlighted node', () => {
                let $event = new KeyboardEvent('keydown', {
                    key: 'ArrowUp'
                });
                component.highlightedNode = nodes[1];
                component.selectedNode = nodes[2];

                combobox.triggerEventHandler("keydown", $event);

                expect(component.highlightedNode).toBe(nodes[0]);
            });

            it('ArrowUp selects previous visible node of current highlighted node', () => {
                let $event = new KeyboardEvent('keydown', {
                    key: 'ArrowUp'
                });
                component.highlightedNode = nodes[1];
                component.selectedNode = nodes[2];

                combobox.triggerEventHandler("keydown", $event);

                expect(nodeSelected).toHaveBeenCalledWith(nodes[0]);
            });

            it('ArrowUp does not change highlighted node when current highlighted node is first visible node', () => {
                let $event = new KeyboardEvent('keydown', {
                    key: 'ArrowUp'
                });
                component.highlightedNode = component.defaultNode;
                component.selectedNode = nodes[2];

                combobox.triggerEventHandler("keydown", $event);

                expect(component.highlightedNode).toBe(component.defaultNode);
            });

            it('ArrowUp does not change selected node when current highlighted node is first visible node', () => {
                let $event = new KeyboardEvent('keydown', {
                    key: 'ArrowUp'
                });
                component.highlightedNode = component.defaultNode;
                component.selectedNode = nodes[2];

                combobox.triggerEventHandler("keydown", $event);

                expect(nodeSelected).not.toHaveBeenCalled();
            });

            it('Ctrl+ArrowUp highlights previous visible node of current highlighted node', () => {
                let $event = new KeyboardEvent('keydown', {
                    key: 'ArrowUp',
                    ctrlKey: true
                });
                component.highlightedNode = nodes[1];
                component.selectedNode = nodes[2];

                combobox.triggerEventHandler("keydown", $event);

                expect(component.highlightedNode).toBe(nodes[0]);
            });

            it('Ctrl+ArrowUp does not change selected node', () => {
                let $event = new KeyboardEvent('keydown', {
                    key: 'ArrowUp',
                    ctrlKey: true
                });
                component.highlightedNode = nodes[1];
                component.selectedNode = nodes[2];

                combobox.triggerEventHandler("keydown", $event);

                expect(nodeSelected).not.toHaveBeenCalled();
            });

            it('Ctrl+ArrowUp does not change highlighted node when current highlighted node is first visible node', () => {
                let $event = new KeyboardEvent('keydown', {
                    key: 'ArrowUp',
                    ctrlKey: true
                });
                component.highlightedNode = component.defaultNode;
                component.selectedNode = nodes[2];

                combobox.triggerEventHandler("keydown", $event);

                expect(component.highlightedNode).toBe(component.defaultNode);
            });

            it('Ctrl+ArrowUp does not change selected node when current highlighted node is first visible node', () => {
                let $event = new KeyboardEvent('keydown', {
                    key: 'ArrowUp',
                    ctrlKey: true
                });
                component.highlightedNode = component.defaultNode;
                component.selectedNode = nodes[2];

                combobox.triggerEventHandler("keydown", $event);

                expect(nodeSelected).not.toHaveBeenCalled();
            });

            it('ArrowDown highlights next visible node of current highlighted node', () => {
                let $event = new KeyboardEvent('keydown', {
                    key: 'ArrowDown'
                });
                component.highlightedNode = nodes[1];
                component.selectedNode = nodes[0];

                combobox.triggerEventHandler("keydown", $event);

                expect(component.highlightedNode).toBe(nodes[2]);
            });

            it('ArrowDown selects next visible node of current highlighted node', () => {
                let $event = new KeyboardEvent('keydown', {
                    key: 'ArrowDown'
                });
                component.highlightedNode = nodes[1];
                component.selectedNode = nodes[0];

                combobox.triggerEventHandler("keydown", $event);

                expect(nodeSelected).toHaveBeenCalledWith(nodes[2]);
            });

            it('ArrowDown does not change highlighted node when current highlighted node is last visible node', () => {
                let $event = new KeyboardEvent('keydown', {
                    key: 'ArrowDown'
                });
                component.highlightedNode = nodes[2];
                component.selectedNode = nodes[0];

                combobox.triggerEventHandler("keydown", $event);

                expect(component.highlightedNode).toBe(nodes[2]);
            });

            it('ArrowDown does not change selected node when current highlighted node is last visible node', () => {
                let $event = new KeyboardEvent('keydown', {
                    key: 'ArrowDown'
                });
                component.highlightedNode = nodes[2];
                component.selectedNode = nodes[0];

                combobox.triggerEventHandler("keydown", $event);

                expect(nodeSelected).not.toHaveBeenCalled();
            });

            it('Ctrl+ArrowDown highlights next visible node of current highlighted node', () => {
                let $event = new KeyboardEvent('keydown', {
                    key: 'ArrowDown',
                    ctrlKey: true
                });
                component.highlightedNode = nodes[1];
                component.selectedNode = nodes[0];

                combobox.triggerEventHandler("keydown", $event);

                expect(component.highlightedNode).toBe(nodes[2]);
            });

            it('Ctrl+ArrowDown does not change selected node', () => {
                let $event = new KeyboardEvent('keydown', {
                    key: 'ArrowDown',
                    ctrlKey: true
                });
                component.highlightedNode = nodes[1];
                component.selectedNode = nodes[0];

                combobox.triggerEventHandler("keydown", $event);

                expect(nodeSelected).not.toHaveBeenCalled();
            });

            it('Ctrl+ArrowDown does not change highlighted node when current highlighted node is last visible node', () => {
                let $event = new KeyboardEvent('keydown', {
                    key: 'ArrowDown',
                    ctrlKey: true
                });
                component.highlightedNode = nodes[2];
                component.selectedNode = nodes[0];

                combobox.triggerEventHandler("keydown", $event);

                expect(component.highlightedNode).toBe(nodes[2]);
            });

            it('Ctrl+ArrowDown does not change selected node when current highlighted node is last visible node', () => {
                let $event = new KeyboardEvent('keydown', {
                    key: 'ArrowDown',
                    ctrlKey: true
                });
                component.highlightedNode = nodes[2];
                component.selectedNode = nodes[0];

                combobox.triggerEventHandler("keydown", $event);

                expect(nodeSelected).not.toHaveBeenCalled();
            });

            it('ArrowLeft does not change highlighted node when current highlighted node is expanded', () => {
                let $event = new KeyboardEvent('keydown', {
                    key: 'ArrowLeft'
                });
                component.expandedNodes = new Set<TreeNode>([
                    nodes[0],
                    nodes[0].children[1]
                ]);
                component.highlightedNode = nodes[0].children[1];
                component.selectedNode = nodes[2];

                combobox.triggerEventHandler("keydown", $event);

                expect(component.highlightedNode).toBe(nodes[0].children[1]);
            });

            it('ArrowLeft does not change selected node when current highlighted node is expanded', () => {
                let $event = new KeyboardEvent('keydown', {
                    key: 'ArrowLeft'
                });
                component.expandedNodes = new Set<TreeNode>([
                    nodes[0],
                    nodes[0].children[1]
                ]);
                component.highlightedNode = nodes[0].children[1];
                component.selectedNode = nodes[2];

                combobox.triggerEventHandler("keydown", $event);

                expect(nodeSelected).not.toHaveBeenCalled();
            });

            it('ArrowLeft collapses current highlighted node when current highlighted node is expanded', () => {
                let $event = new KeyboardEvent('keydown', {
                    key: 'ArrowLeft'
                });
                component.expandedNodes = new Set<TreeNode>([
                    nodes[0],
                    nodes[0].children[1]
                ]);
                component.highlightedNode = nodes[0].children[1];
                component.selectedNode = nodes[2];

                combobox.triggerEventHandler("keydown", $event);

                expect(component.expandedNodes.has(nodes[0].children[1])).toBe(false);
            });

            it('ArrowLeft changes highlighted node to parent of current highlighted node when current highlighted node is collapsed', () => {
                let $event = new KeyboardEvent('keydown', {
                    key: 'ArrowLeft'
                });
                component.expandedNodes = new Set<TreeNode>([nodes[0]]);
                component.highlightedNode = nodes[0].children[1];
                component.selectedNode = nodes[2];

                combobox.triggerEventHandler("keydown", $event);

                expect(component.highlightedNode).toBe(nodes[0]);
            });

            it('ArrowLeft changes selected node to parent of current highlighted node when current highlighted node is collapsed', () => {
                let $event = new KeyboardEvent('keydown', {
                    key: 'ArrowLeft'
                });
                component.expandedNodes = new Set<TreeNode>([nodes[0]]);
                component.highlightedNode = nodes[0].children[1];
                component.selectedNode = nodes[2];

                combobox.triggerEventHandler("keydown", $event);

                expect(nodeSelected).toHaveBeenCalledWith(nodes[0]);
            });

            it('ArrowLeft does not change highlighted node when current highlighted node is collapsed and has no parent', () => {
                let $event = new KeyboardEvent('keydown', {
                    key: 'ArrowLeft'
                });
                component.highlightedNode = nodes[0];
                component.selectedNode = nodes[2];

                combobox.triggerEventHandler("keydown", $event);

                expect(component.highlightedNode).toBe(nodes[0]);
            });

            it('ArrowLeft does not change selected node when current highlighted node is collapsed and has no parent', () => {
                let $event = new KeyboardEvent('keydown', {
                    key: 'ArrowLeft'
                });
                component.highlightedNode = nodes[0];
                component.selectedNode = nodes[2];

                combobox.triggerEventHandler("keydown", $event);

                expect(nodeSelected).not.toHaveBeenCalled();
            });

            it('ArrowRight does not change highlighted node when current highlighted node is collapsed', () => {
                let $event = new KeyboardEvent('keydown', {
                    key: 'ArrowRight'
                });
                component.highlightedNode = nodes[0];
                component.selectedNode = nodes[2];

                combobox.triggerEventHandler("keydown", $event);

                expect(component.highlightedNode).toBe(nodes[0]);
            });

            it('ArrowRight does not change selected node when current highlighted node is collapsed', () => {
                let $event = new KeyboardEvent('keydown', {
                    key: 'ArrowRight'
                });
                component.highlightedNode = nodes[0];
                component.selectedNode = nodes[2];

                combobox.triggerEventHandler("keydown", $event);

                expect(nodeSelected).not.toHaveBeenCalled();
            });

            it('ArrowRight expands current highlighted node when current highlighted node is collapsed', () => {
                let $event = new KeyboardEvent('keydown', {
                    key: 'ArrowRight'
                });
                component.highlightedNode = nodes[0];
                component.selectedNode = nodes[2];

                combobox.triggerEventHandler("keydown", $event);

                expect(component.expandedNodes.has(nodes[0])).toBe(true);
            });

            it('ArrowRight changes highlighted node to first child of the current highlighted node when current highlighted node is expanded', () => {
                let $event = new KeyboardEvent('keydown', {
                    key: 'ArrowRight'
                });
                component.expandedNodes = new Set<TreeNode>([nodes[0]]);
                component.highlightedNode = nodes[0];
                component.selectedNode = nodes[2];

                combobox.triggerEventHandler("keydown", $event);

                expect(component.highlightedNode).toBe(nodes[0].children[0]);
            });

            it('ArrowRight changes selected node to first child of the current highlighted node when current highlighted node is expanded', () => {
                let $event = new KeyboardEvent('keydown', {
                    key: 'ArrowRight'
                });
                component.expandedNodes = new Set<TreeNode>([nodes[0]]);
                component.highlightedNode = nodes[0];
                component.selectedNode = nodes[2];

                combobox.triggerEventHandler("keydown", $event);

                expect(nodeSelected).toHaveBeenCalledWith(nodes[0].children[0]);
            });

            it('ArrowRight does not change highlighted node when current highlighted node has no children', () => {
                let $event = new KeyboardEvent('keydown', {
                    key: 'ArrowRight'
                });
                component.highlightedNode = nodes[0];
                component.selectedNode = nodes[2];

                combobox.triggerEventHandler("keydown", $event);

                expect(component.highlightedNode).toBe(nodes[0]);
            });

            it('ArrowRight does not change selected node when current highlighted node has no children', () => {
                let $event = new KeyboardEvent('keydown', {
                    key: 'ArrowRight'
                });
                component.highlightedNode = nodes[0];
                component.selectedNode = nodes[2];

                combobox.triggerEventHandler("keydown", $event);

                expect(nodeSelected).not.toHaveBeenCalled();
            });

            it('Home changes highlighted node to first visible node', () => {
                let $event = new KeyboardEvent('keydown', {
                    key: 'Home'
                });
                component.expandedNodes = new Set<TreeNode>([nodes[0]]);
                component.highlightedNode = nodes[0].children[1];
                component.selectedNode = nodes[2];

                combobox.triggerEventHandler("keydown", $event);

                expect(component.highlightedNode).toBe(component.defaultNode);
            });

            it('Home changes selected node to first visible node', () => {
                let $event = new KeyboardEvent('keydown', {
                    key: 'Home'
                });
                component.expandedNodes = new Set<TreeNode>([nodes[0]]);
                component.highlightedNode = nodes[0].children[1];
                component.selectedNode = nodes[2];

                combobox.triggerEventHandler("keydown", $event);

                expect(nodeSelected).toHaveBeenCalledWith(null);
            });

            it('Ctrl+Home changes highlighted node to first visible node', () => {
                let $event = new KeyboardEvent('keydown', {
                    key: 'Home',
                    ctrlKey: true
                });
                component.expandedNodes = new Set<TreeNode>([nodes[0]]);
                component.highlightedNode = nodes[0].children[1];
                component.selectedNode = nodes[2];

                combobox.triggerEventHandler("keydown", $event);

                expect(component.highlightedNode).toBe(component.defaultNode);
            });

            it('Ctrl+Home does not change selected node', () => {
                let $event = new KeyboardEvent('keydown', {
                    key: 'Home',
                    ctrlKey: true
                });
                component.expandedNodes = new Set<TreeNode>([nodes[0]]);
                component.highlightedNode = nodes[0].children[1];
                component.selectedNode = nodes[2];

                combobox.triggerEventHandler("keydown", $event);

                expect(nodeSelected).not.toHaveBeenCalled();
            });

            it('End changes highlighted node to last visible node', () => {
                let $event = new KeyboardEvent('keydown', {
                    key: 'End'
                });
                component.expandedNodes = new Set<TreeNode>([nodes[0]]);
                component.highlightedNode = nodes[0].children[1];
                component.selectedNode = nodes[0];

                combobox.triggerEventHandler("keydown", $event);

                expect(component.highlightedNode).toBe(nodes[2]);
            });

            it('End changes selected node to last visible node', () => {
                let $event = new KeyboardEvent('keydown', {
                    key: 'End'
                });
                component.expandedNodes = new Set<TreeNode>([nodes[0]]);
                component.highlightedNode = nodes[0].children[1];
                component.selectedNode = nodes[0];

                combobox.triggerEventHandler("keydown", $event);

                expect(nodeSelected).toHaveBeenCalledWith(nodes[2]);
            });

            it('Ctrl+End changes highlighted node to last visible node', () => {
                let $event = new KeyboardEvent('keydown', {
                    key: 'End',
                    ctrlKey: true
                });
                component.expandedNodes = new Set<TreeNode>([nodes[0]]);
                component.highlightedNode = nodes[0].children[1];
                component.selectedNode = nodes[0];

                combobox.triggerEventHandler("keydown", $event);

                expect(component.highlightedNode).toBe(nodes[2]);
            });

            it('Ctrl+End does not change selected node', () => {
                let $event = new KeyboardEvent('keydown', {
                    key: 'End',
                    ctrlKey: true
                });
                component.expandedNodes = new Set<TreeNode>([nodes[0]]);
                component.highlightedNode = nodes[0].children[1];
                component.selectedNode = nodes[0];

                combobox.triggerEventHandler("keydown", $event);

                expect(nodeSelected).not.toHaveBeenCalled();
            });

            it('Space changes selected node to current highlighted node', () => {
                let $event = new KeyboardEvent('keydown', {
                    key: ' '
                });
                component.expandedNodes = new Set<TreeNode>([nodes[0]]);
                component.highlightedNode = nodes[0].children[1];
                component.selectedNode = nodes[2];

                combobox.triggerEventHandler("keydown", $event);

                expect(nodeSelected).toHaveBeenCalledWith(nodes[0].children[1]);
            });

            it('Ctrl+Space changes selected node to current highlighted node', () => {
                let $event = new KeyboardEvent('keydown', {
                    key: ' ',
                    ctrlKey: true
                });
                component.expandedNodes = new Set<TreeNode>([nodes[0]]);
                component.highlightedNode = nodes[0].children[1];
                component.selectedNode = nodes[2];

                combobox.triggerEventHandler("keydown", $event);

                expect(nodeSelected).toHaveBeenCalledWith(nodes[0].children[1]);
            });
        });
    });

    function createNode(...children: TreeNode[]): TreeNode {
        let id = currentId++;

        return {
            id: id,
            text: 'ABC-' + id,
            children: children
        };
    }

    function createNodeTree(): TreeNode[] {
        return [
            createNode(
                createNode(),
                createNode(
                    createNode(),
                    createNode()
                ),
                createNode(
                    createNode(),
                    createNode(
                        createNode()
                    ),
                    createNode()
                )
            ),
            createNode(
                createNode(
                    createNode()
                )
            ),
            createNode()
        ];
    }
});
