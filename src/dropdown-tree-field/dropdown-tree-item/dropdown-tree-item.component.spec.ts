import { CommonModule }                 from '@angular/common';
import {
    CUSTOM_ELEMENTS_SCHEMA,
    DebugElement
}                                       from '@angular/core';
import {
    ComponentFixture,
    TestBed
}                                       from '@angular/core/testing';
import { FormsModule }                  from '@angular/forms';
import { By }                           from '@angular/platform-browser';

import { DropdownTreeItemComponent }    from './dropdown-tree-item.component';
import { TreeNode }                     from '../tree-node.model';
import { DropdownTreeService }          from '../dropdown-tree.service';

let currentId = 1;

describe('DropdownTreeItemComponent', () => {
    let fixture: ComponentFixture<DropdownTreeItemComponent>;
    let component: DropdownTreeItemComponent;
    let li: DebugElement;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [CommonModule, FormsModule],
            declarations: [DropdownTreeItemComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            providers: [DropdownTreeService]
        });
        fixture = TestBed.createComponent(DropdownTreeItemComponent);

        component = fixture.componentInstance;

        li = fixture.debugElement.query(By.css('li'));
    });

    describe('setting node', () => {
        let node: TreeNode;

        beforeEach(() => {
            node = createNode();
        });

        it('sets hasChildren to false when node has no children', () => {
            component.node = node;

            expect(component.hasChildren).toBe(false);
        });

        it('adds tree--no-children class to li when node has no children', () => {
            component.node = node;

            fixture.detectChanges();
            expect(li.classes['tree--no-children']).toBe(true);
        });

        it('does not add tree--has-children class to li when node has no children', () => {
            component.node = node;

            fixture.detectChanges();
            expect(li.classes['tree--has-children']).toBeFalsy();
        });

        it('sets hasChildren to true when node has children', () => {
            node.children.push(createNode());

            component.node = node;

            expect(component.hasChildren).toBe(true);
        });

        it('does not add tree--no-children class to li when node has children', () => {
            node.children.push(createNode());

            component.node = node;

            fixture.detectChanges();
            expect(li.classes['tree--no-children']).toBeFalsy();
        });

        it('adds tree--has-children class to li when node has children', () => {
            node.children.push(createNode());

            component.node = node;

            fixture.detectChanges();
            expect(li.classes['tree--has-children']).toBe(true);
        });
    });

    describe('setting expandedNodes', () => {
        let node: TreeNode;

        beforeEach(() => {
            node = createNode();
        });

        it('sets isExpanded to undefined when node has no children', () => {
            component.node = node;

            component.expandedNodes = new Set<TreeNode>();

            expect(component.isExpanded).toBeUndefined();
        });

        it('does not add tree--expanded class to li when node has no children', () => {
            component.node = node;

            component.expandedNodes = new Set<TreeNode>();

            fixture.detectChanges();
            expect(li.classes['tree--expanded']).toBeFalsy();
        });

        it('does not add tree--collapsed class to li when node has no children', () => {
            component.node = node;

            component.expandedNodes = new Set<TreeNode>();

            fixture.detectChanges();
            expect(li.classes['tree--collapsed']).toBeFalsy();
        });

        it('sets showChildren to false when node has no children', () => {
            component.node = node;

            component.expandedNodes = new Set<TreeNode>();

            expect(component.showChildren).toBe(false);
        });

        it('sets isExpanded to false when node is not in expandedNodes', () => {
            node.children.push(createNode());
            component.node = node;

            component.expandedNodes = new Set<TreeNode>();

            expect(component.isExpanded).toBe(false);
        });

        it('does not add tree--expanded class to li when node is not in expandedNodes', () => {
            node.children.push(createNode());
            component.node = node;

            component.expandedNodes = new Set<TreeNode>();

            fixture.detectChanges();
            expect(li.classes['tree--expanded']).toBeFalsy();
        });

        it('adds tree--collapsed class to li when node is not in expandedNodes', () => {
            node.children.push(createNode());
            component.node = node;

            component.expandedNodes = new Set<TreeNode>();

            fixture.detectChanges();
            expect(li.classes['tree--collapsed']).toBe(true);
        });

        it('sets showChildren to false when node is not in expandedNodes', () => {
            node.children.push(createNode());
            component.node = node;

            component.expandedNodes = new Set<TreeNode>();

            expect(component.showChildren).toBe(false);
        });

        it('sets isExpanded to true when node is in expandedNodes', () => {
            node.children.push(createNode());
            component.node = node;

            component.expandedNodes = new Set<TreeNode>([node]);

            expect(component.isExpanded).toBe(true);
        });

        it('adds tree--expanded class to li when node is in expandedNodes', () => {
            node.children.push(createNode());
            component.node = node;

            component.expandedNodes = new Set<TreeNode>([node]);

            fixture.detectChanges();
            expect(li.classes['tree--expanded']).toBe(true);
        });

        it('does not add tree--collapsed class to li when node is in expandedNodes', () => {
            node.children.push(createNode());
            component.node = node;

            component.expandedNodes = new Set<TreeNode>([node]);

            fixture.detectChanges();
            expect(li.classes['tree--collapsed']).toBeFalsy();
        });

        it('sets showChildren to true when node is in expandedNodes', () => {
            node.children.push(createNode());
            component.node = node;

            component.expandedNodes = new Set<TreeNode>([node]);

            expect(component.showChildren).toBe(true);
        });
    });

    describe('setting highlightedNode', () => {
        let node: TreeNode;

        beforeEach(() => {
            node = createNode();

            component.node = node;
        });

        it('set isHighlighted to true when node is highlightedNode', () => {
            component.highlightedNode = node;

            expect(component.isHighlighted).toBe(true);
        });

        it('adds tree--highlighted class to li when node is highlightedNode', () => {
            component.highlightedNode = node;

            fixture.detectChanges();
            expect(li.classes['tree--highlighted']).toBe(true);
        });

        it('set isHighlighted to false when node is not highlightedNode', () => {
            component.highlightedNode = createNode();

            expect(component.isHighlighted).toBe(false);
        });

        it('does not add tree--highlighted class to li when node is not highlightedNode', () => {
            component.highlightedNode = createNode();

            fixture.detectChanges();
            expect(li.classes['tree--highlighted']).toBeFalsy();
        });
    });

    describe('setting selectedNode', () => {
        let node: TreeNode;

        beforeEach(() => {
            node = createNode();

            component.node = node;
        });

        it('set isSelected to true when node is selectedNode', () => {
            component.selectedNode = node;

            expect(component.isSelected).toBe(true);
        });

        it('adds tree--selected class to li when node is selectedNode', () => {
            component.selectedNode = node;

            fixture.detectChanges();
            expect(li.classes['tree--selected']).toBe(true);
        });

        it('set isSelected to false when node is not selectedNode', () => {
            component.selectedNode = createNode();

            expect(component.isSelected).toBe(false);
        });

        it('does not add tree--selected class to li when node is not selectedNode', () => {
            component.selectedNode = createNode();

            fixture.detectChanges();
            expect(li.classes['tree--selected']).toBeFalsy();
        });
    });

    describe('onExpanderClick', () => {
        let nodeCollapsed: jasmine.Spy;
        let nodeExpanded: jasmine.Spy;
        let node: TreeNode;

        beforeEach(() => {
            nodeCollapsed = jasmine.createSpy('nodeCollapsed');
            nodeExpanded = jasmine.createSpy('nodeExpanded');

            component.nodeCollapsed.subscribe(nodeCollapsed);
            component.nodeExpanded.subscribe(nodeExpanded);

            node = createNode();
        });

        it('does not emit nodeCollapsed event when node has no children', () => {
            component.node = node;
            component.expandedNodes = new Set<TreeNode>();

            component.onExpanderClick();

            expect(nodeCollapsed).not.toHaveBeenCalled();
        });

        it('does not emit nodeExpanded event when node has no children', () => {
            component.node = node;
            component.expandedNodes = new Set<TreeNode>();

            component.onExpanderClick();

            expect(nodeExpanded).not.toHaveBeenCalled();
        });

        it('does not emit nodeCollapsed event when node is not expanded', () => {
            node.children.push(createNode());
            component.node = node;
            component.expandedNodes = new Set<TreeNode>();

            component.onExpanderClick();

            expect(nodeCollapsed).not.toHaveBeenCalled();
        });

        it('emits nodeExpanded event when node is not expanded', () => {
            node.children.push(createNode());
            component.node = node;
            component.expandedNodes = new Set<TreeNode>();

            component.onExpanderClick();

            expect(nodeExpanded).toHaveBeenCalledWith(node);
        });

        it('emits nodeCollapsed event when node is expanded', () => {
            node.children.push(createNode());
            component.node = node;
            component.expandedNodes = new Set<TreeNode>([node]);

            component.onExpanderClick();

            expect(nodeCollapsed).toHaveBeenCalledWith(node);
        });

        it('does not emit nodeExpanded event when node is expanded', () => {
            node.children.push(createNode());
            component.node = node;
            component.expandedNodes = new Set<TreeNode>([node]);

            component.onExpanderClick();

            expect(nodeExpanded).not.toHaveBeenCalled();
        });
    });

    describe('onNodeMouseEnter', () => {
        let nodeHighlighted: jasmine.Spy;
        let node: TreeNode;

        beforeEach(() => {
            nodeHighlighted = jasmine.createSpy('nodeHighlighted');
            component.nodeHighlighted.subscribe(nodeHighlighted);

            node = createNode();
            component.node = node;

            component.highlightedNode = createNode();
        });

        it('emits nodeHighlighted event', () => {
            component.onNodeMouseEnter();

            expect(nodeHighlighted).toHaveBeenCalledWith(node);
        });
    });

    describe('onNodeClick', () => {
        let nodeSelected: jasmine.Spy;
        let node: TreeNode;

        beforeEach(() => {
            nodeSelected = jasmine.createSpy('nodeSelected');
            component.nodeSelected.subscribe(nodeSelected);

            node = createNode();
            component.node = node;

            component.selectedNode = createNode();
        });

        it('emits nodeSelected event', () => {
            component.onNodeClick();

            expect(nodeSelected).toHaveBeenCalledWith(node);
        });
    });

    function createNode(): TreeNode {
        return {
            id: currentId++,
            text: 'ABC',
            children: []
        };
    }
});
