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
import { DropdownTreeService }          from '../dropdown-tree.service';
import { TreeNode }                     from '../tree-node.model';

let currentId = 1;

describe('DropdownTreeItemComponent', () => {
    let fixture: ComponentFixture<DropdownTreeItemComponent>;
    let component: DropdownTreeItemComponent;
    let service: DropdownTreeService;
    let expandedNodes: Set<TreeNode>;
    let li: DebugElement;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [CommonModule, FormsModule],
            declarations: [DropdownTreeItemComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            providers: [DropdownTreeService]
        });
        fixture = TestBed.createComponent(DropdownTreeItemComponent);
        service = fixture.debugElement.injector.get(DropdownTreeService);

        spyOn(service, 'highlightNode');
        spyOn(service, 'selectNode');
        spyOn(service, 'toggleNodeExpansion');

        component = fixture.componentInstance;
        expandedNodes = new Set<TreeNode>();

        li = fixture.debugElement.query(By.css('li'));
    });

    describe('for node without children', () => {
        beforeEach(() => {
            component.node = createNode();

            fixture.detectChanges();
        });

        it('on service state changes hasChildren is false', () => {
            service.setState(createNode(), createNode(), expandedNodes);

            expect(component.hasChildren).toBe(false);
        });

        it('on service state changes the li has tree--no-children class', () => {
            service.setState(createNode(), createNode(), expandedNodes);
            fixture.detectChanges();

            expect(li.classes['tree--no-children']).toBe(true);
        });

        it('on service state changes the li does not have tree--has-children class', () => {
            service.setState(createNode(), createNode(), expandedNodes);
            fixture.detectChanges();

            expect(li.classes['tree--has-children']).toBeFalsy();
        });

        it('on service state changes isExpanded is undefined', () => {
            service.setState(createNode(), createNode(), expandedNodes);

            expect(component.isExpanded).toBeUndefined();
        });

        it('on service state changes the li does not have tree--expanded class', () => {
            service.setState(createNode(), createNode(), expandedNodes);
            fixture.detectChanges();

            expect(li.classes['tree--expanded']).toBeFalsy();
        });

        it('on service state changes the li does not have tree--collapsed class', () => {
            service.setState(createNode(), createNode(), expandedNodes);
            fixture.detectChanges();

            expect(li.classes['tree--collapsed']).toBeFalsy();
        });

        it('on service state changes showChildren is false', () => {
            service.setState(createNode(), createNode(), expandedNodes);

            expect(component.showChildren).toBe(false);
        });

        it('on service state changes isHighlighted is true when highlightedNode is node', () => {
            service.setState(component.node, createNode(), expandedNodes);

            expect(component.isHighlighted).toBe(true);
        });

        it('on service state changes the li has tree--highlighted class when highlightedNode is node', () => {
            service.setState(component.node, createNode(), expandedNodes);
            fixture.detectChanges();

            expect(li.classes['tree--highlighted']).toBe(true);
        });

        it('on service state changes isHighlighted is false when highlightedNode is different node', () => {
            service.setState(createNode(), createNode(), expandedNodes);

            expect(component.isHighlighted).toBe(false);
        });

        it('on service state changes the li does not have tree--highlighted class when highlightedNode is different node', () => {
            service.setState(createNode(), createNode(), expandedNodes);
            fixture.detectChanges();

            expect(li.classes['tree--highlighted']).toBeFalsy();
        });

        it('on service state changes isSelected is true when selectedNode is node', () => {
            service.setState(createNode(), component.node, expandedNodes);

            expect(component.isSelected).toBe(true);
        });

        it('on service state changes the li has tree--selected class when selectedNode is node', () => {
            service.setState(createNode(), component.node, expandedNodes);
            fixture.detectChanges();

            expect(li.classes['tree--selected']).toBe(true);
        });

        it('on service state changes isSelected is false when selectedNode is different node', () => {
            service.setState(createNode(), createNode(), expandedNodes);

            expect(component.isSelected).toBe(false);
        });

        it('on service state changes the li does not have tree--selected class when selectedNode is different node', () => {
            service.setState(createNode(), createNode(), expandedNodes);
            fixture.detectChanges();

            expect(li.classes['tree--selected']).toBeFalsy();
        });

        it('onNodeMouseEnter should call highlightNode on service', () => {
            component.onNodeMouseEnter();

            expect(service.highlightNode).toHaveBeenCalledWith(component.node);
        });

        it('onNodeClick should call selectNode on service', () => {
            component.onNodeClick();

            expect(service.selectNode).toHaveBeenCalledWith(component.node);
        });

        it('onExpanderClick should call toggleNodeExpansion on service', () => {
            component.onExpanderClick();

            expect(service.toggleNodeExpansion).toHaveBeenCalledWith(component.node);
        });
    });

    describe('for node with children', () => {
        beforeEach(() => {
            component.node = createNode();
            component.node.children.push(createNode());

            fixture.detectChanges();
        });

        it('on service state changes hasChildren is true', () => {
            service.setState(createNode(), createNode(), expandedNodes);

            expect(component.hasChildren).toBe(true);
        });

        it('on service state changes the li does not have tree--no-children class', () => {
            service.setState(createNode(), createNode(), expandedNodes);
            fixture.detectChanges();

            expect(li.classes['tree--no-children']).toBeFalsy();
        });

        it('on service state changes the li has tree--has-children class', () => {
            service.setState(createNode(), createNode(), expandedNodes);
            fixture.detectChanges();

            expect(li.classes['tree--has-children']).toBe(true);
        });

        it('on service state changes isExpanded is false when node is not in expandedNodes', () => {
            service.setState(createNode(), createNode(), expandedNodes);

            expect(component.isExpanded).toBe(false);
        });

        it('on service state changes the li does not have tree--expanded class when node is not in expandedNodes', () => {
            service.setState(createNode(), createNode(), expandedNodes);
            fixture.detectChanges();

            expect(li.classes['tree--expanded']).toBeFalsy();
        });

        it('on service state changes the li has tree--collapsed class when node is not in expandedNodes', () => {
            service.setState(createNode(), createNode(), expandedNodes);
            fixture.detectChanges();

            expect(li.classes['tree--collapsed']).toBe(true);
        });

        it('on service state changes showChildren is false when node is not in expandedNodes', () => {
            service.setState(createNode(), createNode(), expandedNodes);

            expect(component.showChildren).toBe(false);
        });

        it('on service state changes isExpanded is true when node is in expandedNodes', () => {
            expandedNodes.add(component.node);

            service.setState(createNode(), createNode(), expandedNodes);

            expect(component.isExpanded).toBe(true);
        });

        it('on service state changes the li has tree--expanded class when node is in expandedNodes', () => {
            expandedNodes.add(component.node);

            service.setState(createNode(), createNode(), expandedNodes);
            fixture.detectChanges();

            expect(li.classes['tree--expanded']).toBe(true);
        });

        it('on service state changes the li does not have tree--collapsed class when node is in expandedNodes', () => {
            expandedNodes.add(component.node);

            service.setState(createNode(), createNode(), expandedNodes);
            fixture.detectChanges();

            expect(li.classes['tree--collapsed']).toBeFalsy();
        });

        it('on service state changes showChildren is true when node is in expandedNodes', () => {
            expandedNodes.add(component.node);

            service.setState(createNode(), createNode(), expandedNodes);

            expect(component.showChildren).toBe(true);
        });

        it('on service state changes isHighlighted is true when highlightedNode is node', () => {
            service.setState(component.node, createNode(), expandedNodes);

            expect(component.isHighlighted).toBe(true);
        });

        it('on service state changes the li has tree--highlighted class when highlightedNode is node', () => {
            service.setState(component.node, createNode(), expandedNodes);
            fixture.detectChanges();

            expect(li.classes['tree--highlighted']).toBe(true);
        });

        it('on service state changes isHighlighted is false when highlightedNode is different node', () => {
            service.setState(createNode(), createNode(), expandedNodes);

            expect(component.isHighlighted).toBe(false);
        });

        it('on service state changes the li does not have tree--highlighted class when highlightedNode is different node', () => {
            service.setState(createNode(), createNode(), expandedNodes);
            fixture.detectChanges();

            expect(li.classes['tree--highlighted']).toBeFalsy();
        });

        it('on service state changes isSelected is true when selectedNode is node', () => {
            service.setState(createNode(), component.node, expandedNodes);

            expect(component.isSelected).toBe(true);
        });

        it('on service state changes the li has tree--selected class when selectedNode is node', () => {
            service.setState(createNode(), component.node, expandedNodes);
            fixture.detectChanges();

            expect(li.classes['tree--selected']).toBe(true);
        });

        it('on service state changes isSelected is false when selectedNode is different node', () => {
            service.setState(createNode(), createNode(), expandedNodes);

            expect(component.isSelected).toBe(false);
        });

        it('on service state changes the li does not have tree--selected class when selectedNode is different node', () => {
            service.setState(createNode(), createNode(), expandedNodes);
            fixture.detectChanges();

            expect(li.classes['tree--selected']).toBeFalsy();
        });

        it('onNodeMouseEnter should call highlightNode on service', () => {
            component.onNodeMouseEnter();

            expect(service.highlightNode).toHaveBeenCalledWith(component.node);
        });

        it('onNodeClick should call selectNode on service', () => {
            component.onNodeClick();

            expect(service.selectNode).toHaveBeenCalledWith(component.node);
        });

        it('onExpanderClick should call toggleNodeExpansion on service', () => {
            component.onExpanderClick();

            expect(service.toggleNodeExpansion).toHaveBeenCalledWith(component.node);
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
