import { Directionality }               from '@angular/cdk/bidi';
import {
    OverlayContainer,
    ScrollDispatcher,
    ViewportRuler,
}                                       from '@angular/cdk/overlay';
import {
    Component,
    DebugElement,
    ViewChild,
}                                       from '@angular/core';
import {
    ComponentFixture,
    TestBed,
    fakeAsync,
    inject,
    tick,
}                                       from '@angular/core/testing';
import { FormsModule }                  from '@angular/forms';
import { MATERIAL_SANITY_CHECKS }       from '@angular/material/core';
import { By }                           from '@angular/platform-browser';
import { NoopAnimationsModule }         from '@angular/platform-browser/animations';
import { Subject }                      from 'rxjs';

import { sortBy }                       from '../shared';
import { DropdownTreeComponent }        from './dropdown-tree.component';
import { DropdownTreeModule }           from './dropdown-tree.module';
import { TreeNode }                     from './tree-node.model';

let currentId: number;

describe('DropdownTreeComponent', () => {
    let overlayContainerElement: HTMLElement;
    let dir: { value: 'ltr' | 'rtl' };
    let scrollableSubject: Subject<void>;
    let viewportRuler: ViewportRuler;

    beforeEach(() => {
        currentId = 1;
        scrollableSubject = new Subject<void>();

        TestBed.configureTestingModule({
            imports: [
                FormsModule,
                DropdownTreeModule,
                NoopAnimationsModule,
            ],
            declarations: [
                BasicModelComponent,
                PlainTabindexComponent,
            ],
            providers: [
                { provide: OverlayContainer, useFactory: () => overlayContainerFactory() },
                { provide: Directionality, useFactory: () => dir = { value: 'ltr' } },
                { provide: ScrollDispatcher, useFactory: () => scrollDispatcherFactory() },
                { provide: MATERIAL_SANITY_CHECKS, useValue: false },
            ],
        });
    });

    beforeEach(inject([ViewportRuler], (_ruler: ViewportRuler) => {
        viewportRuler = _ruler;
    }));

    afterEach(() => {
        document.body.removeChild(overlayContainerElement);
    });

    function overlayContainerFactory(): OverlayContainer {
        overlayContainerElement = document.createElement('div') as HTMLElement;
        overlayContainerElement.classList.add('cdk-overlay-container');

        document.body.appendChild(overlayContainerElement);

        document.body.style.padding = '0';
        document.body.style.margin = '0';

        return { getContainerElement: () => overlayContainerElement } as OverlayContainer;
    }

    function scrollDispatcherFactory(): ScrollDispatcher {
        return {
            scrolled: () => scrollableSubject.asObservable(),
        } as ScrollDispatcher;
    }

    describe('defaultNode', () => {
        let fixture: ComponentFixture<BasicModelComponent>;
        let component: BasicModelComponent;

        beforeEach(() => {
            fixture = TestBed.createComponent(BasicModelComponent);
            component = fixture.componentInstance;
        });

        it('is null when value is not null and defaultLabel is null', fakeAsync(() => {
            component.selectedNode = component.nodes[0];
            component.defaultLabel = null;

            fixture.detectChanges();
            tick();

            expect(component.dropdownTree.defaultNode).toBe(null);
        }));

        it('is not null when value is null and defaultLabel is null', fakeAsync(() => {
            component.selectedNode = null;
            component.defaultLabel = null;

            fixture.detectChanges();
            tick();

            expect(component.dropdownTree.defaultNode).not.toBe(null);
        }));

        it('is not null when value is null and defaultLabel is not null', fakeAsync(() => {
            component.selectedNode = component.nodes[0];
            component.defaultLabel = 'Any';

            fixture.detectChanges();
            tick();

            expect(component.dropdownTree.defaultNode).not.toBe(null);
        }));

        it('has defaultLabel text', fakeAsync(() => {
            component.selectedNode = component.nodes[0];
            component.defaultLabel = 'Any';

            fixture.detectChanges();
            tick();

            expect(component.dropdownTree.defaultNode.text).toBe('Any');
        }));

        it('has empty text when defaultLabel is null', fakeAsync(() => {
            component.selectedNode = null;
            component.defaultLabel = null;

            fixture.detectChanges();
            tick();

            expect(component.dropdownTree.defaultNode.text).toBe('');
        }));

        it('set to not null when value set to null and defaultLabel is null', fakeAsync(() => {
            component.selectedNode = component.nodes[0];
            component.defaultLabel = null;

            fixture.detectChanges();
            tick();

            component.selectedNode = null;

            fixture.detectChanges();
            tick();

            expect(component.dropdownTree.defaultNode).not.toBe(null);
        }));

        it('set to null when value set to not null and defaultLabel is null', fakeAsync(() => {
            component.selectedNode = null;
            component.defaultLabel = null;

            fixture.detectChanges();
            tick();

            component.selectedNode = component.nodes[0];

            fixture.detectChanges();
            tick();

            expect(component.dropdownTree.defaultNode).toBe(null);
        }));

        it('stays null when value set to another value and defaultLabel is null', fakeAsync(() => {
            component.selectedNode = component.nodes[0];
            component.defaultLabel = null;

            fixture.detectChanges();
            tick();

            component.selectedNode = component.nodes[0].children[0];

            fixture.detectChanges();
            tick();

            expect(component.dropdownTree.defaultNode).toBe(null);
        }));

        it('stays not null when value set to not null and defaultLabel is not null', fakeAsync(() => {
            component.selectedNode = null;
            component.defaultLabel = 'Any';

            fixture.detectChanges();
            tick();

            component.selectedNode = component.nodes[0].children[0];

            fixture.detectChanges();
            tick();

            expect(component.dropdownTree.defaultNode).not.toBe(null);
        }));

        it('set to not null when value is not null and defaultLabel set to not null', fakeAsync(() => {
            component.selectedNode = component.nodes[0];
            component.defaultLabel = null;

            fixture.detectChanges();
            tick();

            component.defaultLabel = 'Any';

            fixture.detectChanges();
            tick();

            expect(component.dropdownTree.defaultNode).not.toBe(null);
        }));

        it('set to null when value is not null and defaultLabel set to null', fakeAsync(() => {
            component.selectedNode = component.nodes[0];
            component.defaultLabel = 'Any';

            fixture.detectChanges();
            tick();

            component.defaultLabel = null;

            fixture.detectChanges();
            tick();

            expect(component.dropdownTree.defaultNode).toBe(null);
        }));

        it('changes text when defaultLabel changes', fakeAsync(() => {
            component.selectedNode = component.nodes[0];
            component.defaultLabel = 'Any';

            fixture.detectChanges();
            tick();

            component.defaultLabel = 'Select One';

            fixture.detectChanges();
            tick();

            expect(component.dropdownTree.defaultNode.text).toBe('Select One');
        }));

        it('changes text to empty string when defaultLabel set to null', fakeAsync(() => {
            component.selectedNode = null;
            component.defaultLabel = 'Any';

            fixture.detectChanges();
            tick();

            component.defaultLabel = null;

            fixture.detectChanges();
            tick();

            expect(component.dropdownTree.defaultNode.text).toBe('');
        }));

        it('changes text to defaultLabel when set to not null', fakeAsync(() => {
            component.selectedNode = null;
            component.defaultLabel = null;

            fixture.detectChanges();
            tick();

            component.defaultLabel = 'Any';

            fixture.detectChanges();
            tick();

            expect(component.dropdownTree.defaultNode.text).toBe('Any');
        }));
    });

    describe('triggerValue', () => {
        let fixture: ComponentFixture<BasicModelComponent>;
        let component: BasicModelComponent;

        beforeEach(() => {
            fixture = TestBed.createComponent(BasicModelComponent);
            component = fixture.componentInstance;
        });

        it('is empty string when value is null and defaultLabel is null', fakeAsync(() => {
            component.selectedNode = null;
            component.defaultLabel = null;
            component.showFullSelectedPath = false;

            fixture.detectChanges();
            tick();

            expect(component.dropdownTree.triggerValue).toBe('');
        }));

        it('is defaultLabel when value is null and defaultLabel is not null', fakeAsync(() => {
            component.selectedNode = null;
            component.defaultLabel = 'Any';
            component.showFullSelectedPath = false;

            fixture.detectChanges();
            tick();

            expect(component.dropdownTree.triggerValue).toBe('Any');
        }));

        it('is value text', fakeAsync(() => {
            component.selectedNode = component.nodes[0];
            component.defaultLabel = 'Any';
            component.showFullSelectedPath = false;

            fixture.detectChanges();
            tick();

            expect(component.dropdownTree.triggerValue).toBe(component.nodes[0].text);
        }));

        it('is value selectedText when not null', fakeAsync(() => {
            component.nodes[0].selectedText = 'Special Text';

            component.selectedNode = component.nodes[0];
            component.defaultLabel = 'Any';
            component.showFullSelectedPath = false;

            fixture.detectChanges();
            tick();

            expect(component.dropdownTree.triggerValue).toBe('Special Text');
        }));

        it('is empty string when value is null and defaultLabel is null and showFullSelectedPath is true', fakeAsync(() => {
            component.selectedNode = null;
            component.defaultLabel = null;
            component.showFullSelectedPath = true;

            fixture.detectChanges();
            tick();

            expect(component.dropdownTree.triggerValue).toBe('');
        }));

        it('is defaultLabel when value is null and defaultLabel is not null and showFullSelectedPath is true', fakeAsync(() => {
            component.selectedNode = null;
            component.defaultLabel = 'Any';
            component.showFullSelectedPath = true;

            fixture.detectChanges();
            tick();

            expect(component.dropdownTree.triggerValue).toBe('Any');
        }));

        it('is full path to value text and showFullSelectedPath is true', fakeAsync(() => {
            component.selectedNode = component.nodes[0].children[1].children[0];
            component.defaultLabel = 'Any';
            component.showFullSelectedPath = true;

            fixture.detectChanges();
            tick();

            const nodesInPath = [
                component.nodes[0],
                component.nodes[0].children[1],
                component.nodes[0].children[1].children[0],
            ];
            expect(component.dropdownTree.triggerValue).toBe(`${nodesInPath[0].text} / ${nodesInPath[1].text} / ${nodesInPath[2].text}`);
        }));

        it('is full path to value selectedText when not null and showFullSelectedPath is true', fakeAsync(() => {
            component.nodes[0].selectedText = 'First Special Text';
            component.nodes[0].children[1].children[0].selectedText = 'Second Special Text';

            component.selectedNode = component.nodes[0].children[1].children[0];
            component.defaultLabel = 'Any';
            component.showFullSelectedPath = true;

            fixture.detectChanges();
            tick();

            const nodesInPath = [
                component.nodes[0],
                component.nodes[0].children[1],
                component.nodes[0].children[1].children[0],
            ];
            expect(component.dropdownTree.triggerValue).toBe(`${nodesInPath[0].selectedText} / ${nodesInPath[1].text} / ${nodesInPath[2].selectedText}`);
        }));

        it('changes when defaultLabel changes', fakeAsync(() => {
            component.selectedNode = null;
            component.defaultLabel = 'Any';
            component.showFullSelectedPath = false;

            fixture.detectChanges();
            tick();

            component.defaultLabel = 'Select One';

            fixture.detectChanges();
            tick();

            expect(component.dropdownTree.triggerValue).toBe('Select One');
        }));

        it('changes when value changes to null', fakeAsync(() => {
            component.selectedNode = component.nodes[0];
            component.defaultLabel = 'Any';
            component.showFullSelectedPath = false;

            fixture.detectChanges();
            tick();

            component.selectedNode = null;

            fixture.detectChanges();
            tick();

            expect(component.dropdownTree.triggerValue).toBe('Any');
        }));

        it('changes when value changes from null', fakeAsync(() => {
            component.selectedNode = null;
            component.defaultLabel = 'Any';
            component.showFullSelectedPath = false;

            fixture.detectChanges();
            tick();

            component.selectedNode = component.nodes[0];

            fixture.detectChanges();
            tick();

            expect(component.dropdownTree.triggerValue).toBe(component.nodes[0].text);
        }));

        it('changes when value changes', fakeAsync(() => {
            component.selectedNode = component.nodes[0].children[0];
            component.defaultLabel = 'Any';
            component.showFullSelectedPath = false;

            fixture.detectChanges();
            tick();

            component.selectedNode = component.nodes[0];

            fixture.detectChanges();
            tick();

            expect(component.dropdownTree.triggerValue).toBe(component.nodes[0].text);
        }));

        it('changes when showFullSelectedPath changes to true', fakeAsync(() => {
            component.selectedNode = component.nodes[0].children[0];
            component.defaultLabel = 'Any';
            component.showFullSelectedPath = false;

            fixture.detectChanges();
            tick();

            component.showFullSelectedPath = true;

            fixture.detectChanges();
            tick();

            const nodesInPath = [
                component.nodes[0],
                component.nodes[0].children[0],
            ];
            expect(component.dropdownTree.triggerValue).toBe(`${nodesInPath[0].text} / ${nodesInPath[1].text}`);
        }));

        it('changes when showFullSelectedPath changes to false', fakeAsync(() => {
            component.selectedNode = component.nodes[0].children[0];
            component.defaultLabel = 'Any';
            component.showFullSelectedPath = true;

            fixture.detectChanges();
            tick();

            component.showFullSelectedPath = false;

            fixture.detectChanges();
            tick();

            expect(component.dropdownTree.triggerValue).toBe(component.nodes[0].children[0].text);
        }));
    });

    describe('expandedNodes', () => {
        let fixture: ComponentFixture<BasicModelComponent>;
        let component: BasicModelComponent;

        beforeEach(() => {
            fixture = TestBed.createComponent(BasicModelComponent);
            component = fixture.componentInstance;
        });

        it('expands nodes to value', fakeAsync(() => {
            component.selectedNode = component.nodes[0].children[2].children[0];

            fixture.detectChanges();
            tick();

            expect(sortBy(Array.from(component.dropdownTree.expandedNodes.keys()), i => i.id)).toEqual(sortBy([
                component.nodes[0],
                component.nodes[0].children[2],
            ], i => i.id));
        }));

        it('expands no nodes when value is null', fakeAsync(() => {
            component.selectedNode = null;

            fixture.detectChanges();
            tick();

            expect(component.dropdownTree.expandedNodes.size).toBe(0);
        }));

        it('expands no nodes when defaultExpansionLevel is 0', fakeAsync(() => {
            component.defaultExpansionLevel = 0;

            fixture.detectChanges();
            tick();

            expect(component.dropdownTree.expandedNodes.size).toBe(0);
        }));

        it('expands nodes to first level when defaultExpansionLevel is 1', fakeAsync(() => {
            component.defaultExpansionLevel = 1;

            fixture.detectChanges();
            tick();

            expect(sortBy(Array.from(component.dropdownTree.expandedNodes.keys()), i => i.id)).toEqual(sortBy([
                component.nodes[0],
                component.nodes[1],
            ], i => i.id));
        }));

        it('expands nodes to second level when defaultExpansionLevel is 2', fakeAsync(() => {
            component.defaultExpansionLevel = 2;

            fixture.detectChanges();
            tick();

            expect(sortBy(Array.from(component.dropdownTree.expandedNodes.keys()), i => i.id)).toEqual(sortBy([
                component.nodes[0],
                component.nodes[0].children[1],
                component.nodes[0].children[2],
                component.nodes[1],
                component.nodes[1].children[0],
            ], i => i.id));
        }));

        it('expands nodes to value and defaultExpansionLevel', fakeAsync(() => {
            component.selectedNode = component.nodes[0].children[2].children[0];
            component.defaultExpansionLevel = 1;

            fixture.detectChanges();
            tick();

            expect(sortBy(Array.from(component.dropdownTree.expandedNodes.keys()), i => i.id)).toEqual(sortBy([
                component.nodes[0],
                component.nodes[0].children[2],
                component.nodes[1],
            ], i => i.id));
        }));
    });

    describe('opens', () => {
        let fixture: ComponentFixture<BasicModelComponent>;
        let component: BasicModelComponent;
        let host: DebugElement;
        let trigger: HTMLElement;

        beforeEach(fakeAsync(() => {
            fixture = TestBed.createComponent(BasicModelComponent);
            component = fixture.componentInstance;

            fixture.detectChanges();
            tick();

            host = fixture.debugElement.query(By.css('.cf-dropdown-tree'));
            trigger = fixture.debugElement.query(By.css('.cf-dropdown-tree-trigger')).nativeElement;
        }));

        it('when clicked', fakeAsync(() => {
            trigger.click();

            fixture.detectChanges();
            tick();

            expect(component.dropdownTree.panelOpen).toBe(true);
        }));

        it('and emits opened', fakeAsync(() => {
            trigger.click();

            fixture.detectChanges();
            tick();

            expect(component.opened).toHaveBeenCalled();
        }));

        it('and sets the width of the overlay based on the trigger when clicked', fakeAsync(() => {
            trigger.style.width = '200px';

            fixture.detectChanges();
            tick();

            trigger.click();

            fixture.detectChanges();
            tick();

            const pane = overlayContainerElement.querySelector('.cdk-overlay-pane') as HTMLElement;
            expect(pane.style.minWidth).toBe('200px');
        }));

        it('and highlights value when visible', fakeAsync(() => {
            const selectedNode = component.nodes[0].children[2].children[1];
            component.selectedNode = selectedNode;

            fixture.detectChanges();
            tick();

            expandNodes(component.dropdownTree, [
                component.nodes[0],
                component.nodes[0].children[2],
                component.nodes[0].children[2].children[1],
            ]);
            component.dropdownTree.expandNode(component.nodes[0]);
            component.dropdownTree.expandNode(component.nodes[0].children[2]);
            component.dropdownTree.expandNode(component.nodes[0].children[2].children[1]);

            trigger.click();

            fixture.detectChanges();
            tick();

            expect(component.dropdownTree.highlightedNode).toBe(selectedNode);
        }));

        it('and highlights first node when value is not visible and defaultNode does not exist', fakeAsync(() => {
            const selectedNode = component.nodes[0].children[2].children[1];
            component.selectedNode = selectedNode;
            component.defaultLabel = null;

            fixture.detectChanges();
            tick();

            expandNodes(component.dropdownTree, [
                component.nodes[0],
            ]);

            trigger.click();

            fixture.detectChanges();
            tick();

            expect(component.dropdownTree.highlightedNode).toBe(component.nodes[0]);
        }));

        it('and highlights defaultNode when value is not visible and defaultNode exists', fakeAsync(() => {
            const selectedNode = component.nodes[0].children[2].children[1];
            component.selectedNode = selectedNode;
            component.defaultLabel = 'Any';

            fixture.detectChanges();
            tick();

            expandNodes(component.dropdownTree, [
                component.nodes[0],
            ]);

            trigger.click();

            fixture.detectChanges();
            tick();

            expect(component.dropdownTree.highlightedNode).toBe(component.dropdownTree.defaultNode);
        }));

        it('when Alt+ArrowDown pressed', fakeAsync(() => {
            const event = new KeyboardEvent('keydown', {
                altKey: true,
                key: 'ArrowDown',
            });
            host.triggerEventHandler('keydown', event);

            fixture.detectChanges();
            tick();

            expect(component.dropdownTree.panelOpen).toBe(true);
        }));

        it('when Enter pressed', fakeAsync(() => {
            const event = new KeyboardEvent('keydown', {
                key: 'Enter',
            });
            host.triggerEventHandler('keydown', event);

            fixture.detectChanges();
            tick();

            expect(component.dropdownTree.panelOpen).toBe(true);
        }));

        it('when Space pressed', fakeAsync(() => {
            const event = new KeyboardEvent('keydown', {
                key: ' ',
            });
            host.triggerEventHandler('keydown', event);

            fixture.detectChanges();
            tick();

            expect(component.dropdownTree.panelOpen).toBe(true);
        }));
    });

    describe('closes', () => {
        let fixture: ComponentFixture<BasicModelComponent>;
        let component: BasicModelComponent;
        let host: DebugElement;
        let trigger: HTMLElement;

        beforeEach(fakeAsync(() => {
            fixture = TestBed.createComponent(BasicModelComponent);
            component = fixture.componentInstance;

            fixture.detectChanges();
            tick();

            host = fixture.debugElement.query(By.css('.cf-dropdown-tree'));
            trigger = fixture.debugElement.query(By.css('.cf-dropdown-tree-trigger')).nativeElement;
            trigger.click();

            fixture.detectChanges();
            tick();
        }));

        it('when item clicked', fakeAsync(() => {
            const item = overlayContainerElement.querySelectorAll('.cf-dropdown-tree-node > .cf-dropdown-tree-node-line > .cf-dropdown-tree-node-text')[1] as HTMLElement;
            item.click();

            fixture.detectChanges();
            tick();
            tick(1000);

            expect(component.dropdownTree.panelOpen).toBe(false);
        }));

        it('when backdrop clicked', fakeAsync(() => {
            const backdrop = overlayContainerElement.querySelector('.cdk-overlay-backdrop') as HTMLElement;
            backdrop.click();

            fixture.detectChanges();
            tick();
            tick(1000);

            expect(component.dropdownTree.panelOpen).toBe(false);
        }));

        it('and emits closed', fakeAsync(() => {
            const item = overlayContainerElement.querySelectorAll('.cf-dropdown-tree-node > .cf-dropdown-tree-node-line > .cf-dropdown-tree-node-text')[1] as HTMLElement;
            item.click();

            fixture.detectChanges();
            tick();
            tick(1000);

            expect(component.closed).toHaveBeenCalled();
        }));

        it('when Alt+ArrowUp pressed', fakeAsync(() => {
            const event = new KeyboardEvent('keydown', {
                altKey: true,
                key: 'ArrowUp',
            });
            host.triggerEventHandler('keydown', event);

            fixture.detectChanges();
            tick();
            tick(1000);

            expect(component.dropdownTree.panelOpen).toBe(false);
        }));

        it('when Escape pressed', fakeAsync(() => {
            const event = new KeyboardEvent('keydown', {
                key: 'Escape',
            });
            host.triggerEventHandler('keydown', event);

            fixture.detectChanges();
            tick();
            tick(1000);

            expect(component.dropdownTree.panelOpen).toBe(false);
        }));

        it('when Tab pressed', fakeAsync(() => {
            const event = new KeyboardEvent('keydown', {
                key: 'Tab',
            });
            host.triggerEventHandler('keydown', event);

            fixture.detectChanges();
            tick();
            tick(1000);

            expect(component.dropdownTree.panelOpen).toBe(false);
        }));

        it('when Space pressed', fakeAsync(() => {
            const event = new KeyboardEvent('keydown', {
                key: ' ',
            });
            host.triggerEventHandler('keydown', event);

            fixture.detectChanges();
            tick();
            tick(1000);

            expect(component.dropdownTree.panelOpen).toBe(false);
        }));

        it('when Ctrl+Space pressed', fakeAsync(() => {
            const event = new KeyboardEvent('keydown', {
                ctrlKey: true,
                key: ' ',
            });
            host.triggerEventHandler('keydown', event);

            fixture.detectChanges();
            tick();
            tick(1000);

            expect(component.dropdownTree.panelOpen).toBe(false);
        }));

        it('when Enter pressed', fakeAsync(() => {
            const event = new KeyboardEvent('keydown', {
                key: 'Enter',
            });
            host.triggerEventHandler('keydown', event);

            fixture.detectChanges();
            tick();
            tick(1000);

            expect(component.dropdownTree.panelOpen).toBe(false);
        }));
    });

    describe('keyboard', () => {
        let fixture: ComponentFixture<BasicModelComponent>;
        let component: BasicModelComponent;
        let host: DebugElement;
        let trigger: HTMLElement;

        beforeEach(fakeAsync(() => {
            fixture = TestBed.createComponent(BasicModelComponent);
            component = fixture.componentInstance;

            component.defaultLabel = 'Any';

            fixture.detectChanges();
            tick();

            host = fixture.debugElement.query(By.css('.cf-dropdown-tree'));
            trigger = fixture.debugElement.query(By.css('.cf-dropdown-tree-trigger')).nativeElement;
            trigger.click();

            fixture.detectChanges();
            tick();
        }));

        it('ArrowUp highlights previous visible node of current highlighted node', fakeAsync(() => {
            component.dropdownTree.highlightedNode = component.nodes[1];
            component.selectedNode = component.nodes[2];

            const event = new KeyboardEvent('keydown', {
                key: 'ArrowUp',
            });
            host.triggerEventHandler('keydown', event);

            fixture.detectChanges();
            tick();

            expect(component.dropdownTree.highlightedNode).toBe(component.nodes[0]);
        }));

        it('ArrowUp selects previous visible node of current highlighted node', fakeAsync(() => {
            component.dropdownTree.highlightedNode = component.nodes[1];
            component.selectedNode = component.nodes[2];

            const event = new KeyboardEvent('keydown', {
                key: 'ArrowUp',
            });
            host.triggerEventHandler('keydown', event);

            fixture.detectChanges();
            tick();

            expect(component.selectedNode).toBe(component.nodes[0]);
        }));

        it('ArrowUp does not change highlighted node when current highlighted node is first visible node', fakeAsync(() => {
            component.dropdownTree.highlightedNode = component.dropdownTree.defaultNode;
            component.selectedNode = component.nodes[2];

            const event = new KeyboardEvent('keydown', {
                key: 'ArrowUp',
            });
            host.triggerEventHandler('keydown', event);

            fixture.detectChanges();
            tick();

            expect(component.dropdownTree.highlightedNode).toBe(component.dropdownTree.defaultNode);
        }));

        it('ArrowUp does not change selected node when current highlighted node is first visible node', fakeAsync(() => {
            component.dropdownTree.highlightedNode = component.dropdownTree.defaultNode;
            component.selectedNode = component.nodes[2];

            const event = new KeyboardEvent('keydown', {
                key: 'ArrowUp',
            });
            host.triggerEventHandler('keydown', event);

            fixture.detectChanges();
            tick();

            expect(component.selectedNode).toBe(component.nodes[2]);
        }));

        it('ArrowUp highlights previous visible node when previous visible node is not selectable', fakeAsync(() => {
            component.dropdownTree.highlightedNode = component.nodes[1];
            component.selectedNode = component.nodes[2];

            component.nodes[0].selectable = false;

            const event = new KeyboardEvent('keydown', {
                key: 'ArrowUp',
            });
            host.triggerEventHandler('keydown', event);

            fixture.detectChanges();
            tick();

            expect(component.dropdownTree.highlightedNode).toBe(component.nodes[0]);
        }));

        it('ArrowUp does not change selected node when previous visible node is not selectable', fakeAsync(() => {
            component.dropdownTree.highlightedNode = component.nodes[1];
            component.selectedNode = component.nodes[2];

            component.nodes[0].selectable = false;

            const event = new KeyboardEvent('keydown', {
                key: 'ArrowUp',
            });
            host.triggerEventHandler('keydown', event);

            fixture.detectChanges();
            tick();

            expect(component.selectedNode).toBe(component.nodes[2]);
        }));

        it('Ctrl+ArrowUp highlights previous visible node of current highlighted node', fakeAsync(() => {
            component.dropdownTree.highlightedNode = component.nodes[1];
            component.selectedNode = component.nodes[2];

            const event = new KeyboardEvent('keydown', {
                ctrlKey: true,
                key: 'ArrowUp',
            });
            host.triggerEventHandler('keydown', event);

            fixture.detectChanges();
            tick();

            expect(component.dropdownTree.highlightedNode).toBe(component.nodes[0]);
        }));

        it('Ctrl+ArrowUp does not change selected node', fakeAsync(() => {
            component.dropdownTree.highlightedNode = component.nodes[1];
            component.selectedNode = component.nodes[2];

            const event = new KeyboardEvent('keydown', {
                ctrlKey: true,
                key: 'ArrowUp',
            });
            host.triggerEventHandler('keydown', event);

            fixture.detectChanges();
            tick();

            expect(component.selectedNode).toBe(component.nodes[2]);
        }));

        it('Ctrl+ArrowUp does not change highlighted node when current highlighted node is first visible node', fakeAsync(() => {
            component.dropdownTree.highlightedNode = component.dropdownTree.defaultNode;
            component.selectedNode = component.nodes[2];

            const event = new KeyboardEvent('keydown', {
                ctrlKey: true,
                key: 'ArrowUp',
            });
            host.triggerEventHandler('keydown', event);

            fixture.detectChanges();
            tick();

            expect(component.dropdownTree.highlightedNode).toBe(component.dropdownTree.defaultNode);
        }));

        it('Ctrl+ArrowUp does not change selected node when current highlighted node is first visible node', fakeAsync(() => {
            component.dropdownTree.highlightedNode = component.dropdownTree.defaultNode;
            component.selectedNode = component.nodes[2];

            const event = new KeyboardEvent('keydown', {
                ctrlKey: true,
                key: 'ArrowUp',
            });
            host.triggerEventHandler('keydown', event);

            fixture.detectChanges();
            tick();

            expect(component.selectedNode).toBe(component.nodes[2]);
        }));

        it('Ctrl+ArrowUp highlights previous visible node when previous visible node is not selectable', fakeAsync(() => {
            component.dropdownTree.highlightedNode = component.nodes[1];
            component.selectedNode = component.nodes[2];

            component.nodes[0].selectable = false;

            const event = new KeyboardEvent('keydown', {
                ctrlKey: true,
                key: 'ArrowUp',
            });
            host.triggerEventHandler('keydown', event);

            fixture.detectChanges();
            tick();

            expect(component.dropdownTree.highlightedNode).toBe(component.nodes[0]);
        }));

        it('Ctrl+ArrowUp does not change selected node when previous visible node is not selectable', fakeAsync(() => {
            component.dropdownTree.highlightedNode = component.nodes[1];
            component.selectedNode = component.nodes[2];

            component.nodes[0].selectable = false;

            const event = new KeyboardEvent('keydown', {
                ctrlKey: true,
                key: 'ArrowUp',
            });
            host.triggerEventHandler('keydown', event);

            fixture.detectChanges();
            tick();

            expect(component.selectedNode).toBe(component.nodes[2]);
        }));

        it('ArrowDown highlights next visible node of current highlighted node', fakeAsync(() => {
            component.dropdownTree.highlightedNode = component.nodes[1];
            component.selectedNode = component.nodes[0];

            const event = new KeyboardEvent('keydown', {
                key: 'ArrowDown',
            });
            host.triggerEventHandler('keydown', event);

            fixture.detectChanges();
            tick();

            expect(component.dropdownTree.highlightedNode).toBe(component.nodes[2]);
        }));

        it('ArrowDown selects next visible node of current highlighted node', fakeAsync(() => {
            component.dropdownTree.highlightedNode = component.nodes[1];
            component.selectedNode = component.nodes[0];

            const event = new KeyboardEvent('keydown', {
                key: 'ArrowDown',
            });
            host.triggerEventHandler('keydown', event);

            fixture.detectChanges();
            tick();

            expect(component.selectedNode).toBe(component.nodes[2]);
        }));

        it('ArrowDown does not change highlighted node when current highlighted node is last visible node', fakeAsync(() => {
            component.dropdownTree.highlightedNode = component.nodes[2];
            component.selectedNode = component.nodes[0];

            const event = new KeyboardEvent('keydown', {
                key: 'ArrowDown',
            });
            host.triggerEventHandler('keydown', event);

            fixture.detectChanges();
            tick();

            expect(component.dropdownTree.highlightedNode).toBe(component.nodes[2]);
        }));

        it('ArrowDown does not change selected node when current highlighted node is last visible node', fakeAsync(() => {
            component.dropdownTree.highlightedNode = component.nodes[2];
            component.selectedNode = component.nodes[0];

            const event = new KeyboardEvent('keydown', {
                key: 'ArrowDown',
            });
            host.triggerEventHandler('keydown', event);

            fixture.detectChanges();
            tick();

            expect(component.selectedNode).toBe(component.nodes[0]);
        }));

        it('ArrowDown highlights next visible node when next visible node is not selectable', fakeAsync(() => {
            component.dropdownTree.highlightedNode = component.nodes[1];
            component.selectedNode = component.nodes[0];

            component.nodes[2].selectable = false;

            const event = new KeyboardEvent('keydown', {
                key: 'ArrowDown',
            });
            host.triggerEventHandler('keydown', event);

            fixture.detectChanges();
            tick();

            expect(component.dropdownTree.highlightedNode).toBe(component.nodes[2]);
        }));

        it('ArrowDown does not change selected node when next visible node is not selectable', fakeAsync(() => {
            component.dropdownTree.highlightedNode = component.nodes[1];
            component.selectedNode = component.nodes[0];

            component.nodes[2].selectable = false;

            const event = new KeyboardEvent('keydown', {
                key: 'ArrowDown',
            });
            host.triggerEventHandler('keydown', event);

            fixture.detectChanges();
            tick();

            expect(component.selectedNode).toBe(component.nodes[0]);
        }));

        it('Ctrl+ArrowDown highlights next visible node of current highlighted node', fakeAsync(() => {
            component.dropdownTree.highlightedNode = component.nodes[1];
            component.selectedNode = component.nodes[0];

            const event = new KeyboardEvent('keydown', {
                ctrlKey: true,
                key: 'ArrowDown',
            });
            host.triggerEventHandler('keydown', event);

            fixture.detectChanges();
            tick();

            expect(component.dropdownTree.highlightedNode).toBe(component.nodes[2]);
        }));

        it('Ctrl+ArrowDown does not change selected node', fakeAsync(() => {
            component.dropdownTree.highlightedNode = component.nodes[1];
            component.selectedNode = component.nodes[0];

            const event = new KeyboardEvent('keydown', {
                ctrlKey: true,
                key: 'ArrowDown',
            });
            host.triggerEventHandler('keydown', event);

            fixture.detectChanges();
            tick();

            expect(component.selectedNode).toBe(component.nodes[0]);
        }));

        it('Ctrl+ArrowDown does not change highlighted node when current highlighted node is last visible node', fakeAsync(() => {
            component.dropdownTree.highlightedNode = component.nodes[2];
            component.selectedNode = component.nodes[0];

            const event = new KeyboardEvent('keydown', {
                ctrlKey: true,
                key: 'ArrowDown',
            });
            host.triggerEventHandler('keydown', event);

            fixture.detectChanges();
            tick();

            expect(component.dropdownTree.highlightedNode).toBe(component.nodes[2]);
        }));

        it('Ctrl+ArrowDown does not change selected node when current highlighted node is last visible node', fakeAsync(() => {
            component.dropdownTree.highlightedNode = component.nodes[2];
            component.selectedNode = component.nodes[0];

            const event = new KeyboardEvent('keydown', {
                ctrlKey: true,
                key: 'ArrowDown',
            });
            host.triggerEventHandler('keydown', event);

            fixture.detectChanges();
            tick();

            expect(component.selectedNode).toBe(component.nodes[0]);
        }));

        it('Ctrl+ArrowDown highlights next visible node when next visible node is not selectable', fakeAsync(() => {
            component.dropdownTree.highlightedNode = component.nodes[1];
            component.selectedNode = component.nodes[0];

            component.nodes[2].selectable = false;

            const event = new KeyboardEvent('keydown', {
                ctrlKey: true,
                key: 'ArrowDown',
            });
            host.triggerEventHandler('keydown', event);

            fixture.detectChanges();
            tick();

            expect(component.dropdownTree.highlightedNode).toBe(component.nodes[2]);
        }));

        it('Ctrl+ArrowDown does not change selected node when next visible node is not selectable', fakeAsync(() => {
            component.dropdownTree.highlightedNode = component.nodes[1];
            component.selectedNode = component.nodes[0];

            component.nodes[2].selectable = false;

            const event = new KeyboardEvent('keydown', {
                ctrlKey: true,
                key: 'ArrowDown',
            });
            host.triggerEventHandler('keydown', event);

            fixture.detectChanges();
            tick();

            expect(component.selectedNode).toBe(component.nodes[0]);
        }));

        it('ArrowLeft does not change highlighted node when current highlighted node is expanded', fakeAsync(() => {
            component.dropdownTree.highlightedNode = component.nodes[0].children[1];
            component.selectedNode = component.nodes[2];

            fixture.detectChanges();
            tick();

            expandNodes(component.dropdownTree, [
                component.nodes[0],
                component.nodes[0].children[1],
            ]);

            const event = new KeyboardEvent('keydown', {
                key: 'ArrowLeft',
            });
            host.triggerEventHandler('keydown', event);

            fixture.detectChanges();
            tick();

            expect(component.dropdownTree.highlightedNode).toBe(component.nodes[0].children[1]);
        }));

        it('ArrowLeft does not change selected node when current highlighted node is expanded', fakeAsync(() => {
            component.dropdownTree.highlightedNode = component.nodes[0].children[1];
            component.selectedNode = component.nodes[2];

            fixture.detectChanges();
            tick();

            expandNodes(component.dropdownTree, [
                component.nodes[0],
                component.nodes[0].children[1],
            ]);

            const event = new KeyboardEvent('keydown', {
                key: 'ArrowLeft',
            });
            host.triggerEventHandler('keydown', event);

            fixture.detectChanges();
            tick();

            expect(component.selectedNode).toBe(component.nodes[2]);
        }));

        it('ArrowLeft collapses current highlighted node when current highlighted node is expanded', fakeAsync(() => {
            component.dropdownTree.highlightedNode = component.nodes[0].children[1];
            component.selectedNode = component.nodes[2];

            fixture.detectChanges();
            tick();

            expandNodes(component.dropdownTree, [
                component.nodes[0],
                component.nodes[0].children[1],
            ]);

            const event = new KeyboardEvent('keydown', {
                key: 'ArrowLeft',
            });
            host.triggerEventHandler('keydown', event);

            fixture.detectChanges();
            tick();

            expect(component.dropdownTree.expandedNodes.has(component.nodes[0].children[1])).toBe(false);
        }));

        it('ArrowLeft changes highlighted node to parent of current highlighted node when current highlighted node is collapsed', fakeAsync(() => {
            component.dropdownTree.highlightedNode = component.nodes[0].children[1];
            component.selectedNode = component.nodes[2];

            fixture.detectChanges();
            tick();

            expandNodes(component.dropdownTree, [
                component.nodes[0],
            ]);

            const event = new KeyboardEvent('keydown', {
                key: 'ArrowLeft',
            });
            host.triggerEventHandler('keydown', event);

            fixture.detectChanges();
            tick();

            expect(component.dropdownTree.highlightedNode).toBe(component.nodes[0]);
        }));

        it('ArrowLeft changes selected node to parent of current highlighted node when current highlighted node is collapsed', fakeAsync(() => {
            component.dropdownTree.highlightedNode = component.nodes[0].children[1];
            component.selectedNode = component.nodes[2];

            fixture.detectChanges();
            tick();

            expandNodes(component.dropdownTree, [
                component.nodes[0],
            ]);

            const event = new KeyboardEvent('keydown', {
                key: 'ArrowLeft',
            });
            host.triggerEventHandler('keydown', event);

            fixture.detectChanges();
            tick();

            expect(component.selectedNode).toBe(component.nodes[0]);
        }));

        it('ArrowLeft does not change highlighted node when current highlighted node is collapsed and has no parent', fakeAsync(() => {
            component.dropdownTree.highlightedNode = component.nodes[0];
            component.selectedNode = component.nodes[2];

            fixture.detectChanges();
            tick();

            collapseAllNodes(component.dropdownTree);

            const event = new KeyboardEvent('keydown', {
                key: 'ArrowLeft',
            });
            host.triggerEventHandler('keydown', event);

            fixture.detectChanges();
            tick();

            expect(component.dropdownTree.highlightedNode).toBe(component.nodes[0]);
        }));

        it('ArrowLeft does not change selected node when current highlighted node is collapsed and has no parent', fakeAsync(() => {
            component.dropdownTree.highlightedNode = component.nodes[0];
            component.selectedNode = component.nodes[2];

            fixture.detectChanges();
            tick();

            collapseAllNodes(component.dropdownTree);

            const event = new KeyboardEvent('keydown', {
                key: 'ArrowLeft',
            });
            host.triggerEventHandler('keydown', event);

            fixture.detectChanges();
            tick();

            expect(component.selectedNode).toBe(component.nodes[2]);
        }));

        it('ArrowLeft changes highlighted node to parent when current highlighted node is collapsed and parent node is not selectable', fakeAsync(() => {
            component.dropdownTree.highlightedNode = component.nodes[0].children[1];
            component.selectedNode = component.nodes[2];

            component.nodes[0].selectable = false;

            fixture.detectChanges();
            tick();

            expandNodes(component.dropdownTree, [
                component.nodes[0],
            ]);

            const event = new KeyboardEvent('keydown', {
                key: 'ArrowLeft',
            });
            host.triggerEventHandler('keydown', event);

            fixture.detectChanges();
            tick();

            expect(component.dropdownTree.highlightedNode).toBe(component.nodes[0]);
        }));

        it('ArrowLeft does not change selected node when current highlighted node is collapsed and parent node is not selectable', fakeAsync(() => {
            component.dropdownTree.highlightedNode = component.nodes[0].children[1];
            component.selectedNode = component.nodes[2];

            component.nodes[0].selectable = false;

            fixture.detectChanges();
            tick();

            expandNodes(component.dropdownTree, [
                component.nodes[0],
            ]);

            const event = new KeyboardEvent('keydown', {
                key: 'ArrowLeft',
            });
            host.triggerEventHandler('keydown', event);

            fixture.detectChanges();
            tick();

            expect(component.selectedNode).toBe(component.nodes[2]);
        }));

        it('ArrowRight does not change highlighted node when current highlighted node is collapsed', fakeAsync(() => {
            component.dropdownTree.highlightedNode = component.nodes[0];
            component.selectedNode = component.nodes[2];

            fixture.detectChanges();
            tick();

            collapseAllNodes(component.dropdownTree);

            const event = new KeyboardEvent('keydown', {
                key: 'ArrowRight',
            });
            host.triggerEventHandler('keydown', event);

            fixture.detectChanges();
            tick();

            expect(component.dropdownTree.highlightedNode).toBe(component.nodes[0]);
        }));

        it('ArrowRight does not change selected node when current highlighted node is collapsed', fakeAsync(() => {
            component.dropdownTree.highlightedNode = component.nodes[0];
            component.selectedNode = component.nodes[2];

            fixture.detectChanges();
            tick();

            collapseAllNodes(component.dropdownTree);

            const event = new KeyboardEvent('keydown', {
                key: 'ArrowRight',
            });
            host.triggerEventHandler('keydown', event);

            fixture.detectChanges();
            tick();

            expect(component.selectedNode).toBe(component.nodes[2]);
        }));

        it('ArrowRight expands current highlighted node when current highlighted node is collapsed', fakeAsync(() => {
            component.dropdownTree.highlightedNode = component.nodes[0];
            component.selectedNode = component.nodes[2];

            fixture.detectChanges();
            tick();

            collapseAllNodes(component.dropdownTree);

            const event = new KeyboardEvent('keydown', {
                key: 'ArrowRight',
            });
            host.triggerEventHandler('keydown', event);

            fixture.detectChanges();
            tick();

            expect(component.dropdownTree.expandedNodes.has(component.nodes[0])).toBe(true);
        }));

        it('ArrowRight changes highlighted node to first child of the current highlighted node when current highlighted node is expanded', fakeAsync(() => {
            component.dropdownTree.highlightedNode = component.nodes[0];
            component.selectedNode = component.nodes[2];

            fixture.detectChanges();
            tick();

            expandNodes(component.dropdownTree, [
                component.nodes[0],
            ]);

            const event = new KeyboardEvent('keydown', {
                key: 'ArrowRight',
            });
            host.triggerEventHandler('keydown', event);

            fixture.detectChanges();
            tick();

            expect(component.dropdownTree.highlightedNode).toBe(component.nodes[0].children[0]);
        }));

        it('ArrowRight changes selected node to first child of the current highlighted node when current highlighted node is expanded', fakeAsync(() => {
            component.dropdownTree.highlightedNode = component.nodes[0];
            component.selectedNode = component.nodes[2];

            fixture.detectChanges();
            tick();

            expandNodes(component.dropdownTree, [
                component.nodes[0],
            ]);

            const event = new KeyboardEvent('keydown', {
                key: 'ArrowRight',
            });
            host.triggerEventHandler('keydown', event);

            fixture.detectChanges();
            tick();

            expect(component.selectedNode).toBe(component.nodes[0].children[0]);
        }));

        it('ArrowRight does not change highlighted node when current highlighted node has no children', fakeAsync(() => {
            component.dropdownTree.highlightedNode = component.nodes[0].children[0];
            component.selectedNode = component.nodes[2];

            fixture.detectChanges();
            tick();

            expandNodes(component.dropdownTree, [
                component.nodes[0],
            ]);

            const event = new KeyboardEvent('keydown', {
                key: 'ArrowRight',
            });
            host.triggerEventHandler('keydown', event);

            fixture.detectChanges();
            tick();

            expect(component.dropdownTree.highlightedNode).toBe(component.nodes[0].children[0]);
        }));

        it('ArrowRight does not change selected node when current highlighted node has no children', fakeAsync(() => {
            component.dropdownTree.highlightedNode = component.nodes[0].children[0];
            component.selectedNode = component.nodes[2];

            fixture.detectChanges();
            tick();

            expandNodes(component.dropdownTree, [
                component.nodes[0],
            ]);

            const event = new KeyboardEvent('keydown', {
                key: 'ArrowRight',
            });
            host.triggerEventHandler('keydown', event);

            fixture.detectChanges();
            tick();

            expect(component.selectedNode).toBe(component.nodes[2]);
        }));

        it('ArrowRight changes highlighted node to first child when current highlighted node is expanded and first child node is not selectable', fakeAsync(() => {
            component.dropdownTree.highlightedNode = component.nodes[0];
            component.selectedNode = component.nodes[2];

            component.nodes[0].children[0].selectable = false;

            fixture.detectChanges();
            tick();

            expandNodes(component.dropdownTree, [
                component.nodes[0],
            ]);

            const event = new KeyboardEvent('keydown', {
                key: 'ArrowRight',
            });
            host.triggerEventHandler('keydown', event);

            fixture.detectChanges();
            tick();

            expect(component.dropdownTree.highlightedNode).toBe(component.nodes[0].children[0]);
        }));

        it('ArrowRight does not change selected node when current highlighted node is expanded and first child node is not selectable', fakeAsync(() => {
            component.dropdownTree.highlightedNode = component.nodes[0];
            component.selectedNode = component.nodes[2];

            component.nodes[0].children[0].selectable = false;

            fixture.detectChanges();
            tick();

            expandNodes(component.dropdownTree, [
                component.nodes[0],
            ]);

            const event = new KeyboardEvent('keydown', {
                key: 'ArrowRight',
            });
            host.triggerEventHandler('keydown', event);

            fixture.detectChanges();
            tick();

            expect(component.selectedNode).toBe(component.nodes[2]);
        }));

        it('Home changes highlighted node to first visible node', fakeAsync(() => {
            component.defaultLabel = null;
            component.dropdownTree.highlightedNode = component.nodes[0].children[1];
            component.selectedNode = component.nodes[2];

            fixture.detectChanges();
            tick();

            expandNodes(component.dropdownTree, [
                component.nodes[0],
            ]);

            const event = new KeyboardEvent('keydown', {
                key: 'Home',
            });
            host.triggerEventHandler('keydown', event);

            fixture.detectChanges();
            tick();

            expect(component.dropdownTree.highlightedNode).toBe(component.nodes[0]);
        }));

        it('Home changes selected node to first visible node', fakeAsync(() => {
            component.defaultLabel = null;
            component.dropdownTree.highlightedNode = component.nodes[0].children[1];
            component.selectedNode = component.nodes[2];

            fixture.detectChanges();
            tick();

            expandNodes(component.dropdownTree, [
                component.nodes[0],
            ]);

            const event = new KeyboardEvent('keydown', {
                key: 'Home',
            });
            host.triggerEventHandler('keydown', event);

            fixture.detectChanges();
            tick();

            expect(component.selectedNode).toBe(component.nodes[0]);
        }));

        it('Home changes highlighted node to default node when default label is not null', fakeAsync(() => {
            component.dropdownTree.highlightedNode = component.nodes[0].children[1];
            component.selectedNode = component.nodes[2];

            fixture.detectChanges();
            tick();

            expandNodes(component.dropdownTree, [
                component.nodes[0],
            ]);

            const event = new KeyboardEvent('keydown', {
                key: 'Home',
            });
            host.triggerEventHandler('keydown', event);

            fixture.detectChanges();
            tick();

            expect(component.dropdownTree.highlightedNode).toBe(component.dropdownTree.defaultNode);
        }));

        it('Home changes selected node to default node when default label is not null', fakeAsync(() => {
            component.dropdownTree.highlightedNode = component.nodes[0].children[1];
            component.selectedNode = component.nodes[2];

            fixture.detectChanges();
            tick();

            expandNodes(component.dropdownTree, [
                component.nodes[0],
            ]);

            const event = new KeyboardEvent('keydown', {
                key: 'Home',
            });
            host.triggerEventHandler('keydown', event);

            fixture.detectChanges();
            tick();

            expect(component.selectedNode).toBeNull();
        }));

        it('Home changes highlighted node to first visible node when first visible node is not selectable', fakeAsync(() => {
            component.defaultLabel = null;
            component.dropdownTree.highlightedNode = component.nodes[0].children[1];
            component.selectedNode = component.nodes[2];

            component.nodes[0].selectable = false;

            fixture.detectChanges();
            tick();

            expandNodes(component.dropdownTree, [
                component.nodes[0],
            ]);

            const event = new KeyboardEvent('keydown', {
                key: 'Home',
            });
            host.triggerEventHandler('keydown', event);

            fixture.detectChanges();
            tick();

            expect(component.dropdownTree.highlightedNode).toBe(component.nodes[0]);
        }));

        it('Home does not change selected node when first visible node is not selectable', fakeAsync(() => {
            component.defaultLabel = null;
            component.dropdownTree.highlightedNode = component.nodes[0].children[1];
            component.selectedNode = component.nodes[2];

            component.nodes[0].selectable = false;

            fixture.detectChanges();
            tick();

            expandNodes(component.dropdownTree, [
                component.nodes[0],
            ]);

            const event = new KeyboardEvent('keydown', {
                key: 'Home',
            });
            host.triggerEventHandler('keydown', event);

            fixture.detectChanges();
            tick();

            expect(component.selectedNode).toBe(component.nodes[2]);
        }));

        it('Ctrl+Home changes highlighted node to first visible node', fakeAsync(() => {
            component.defaultLabel = null;
            component.dropdownTree.highlightedNode = component.nodes[0].children[1];
            component.selectedNode = component.nodes[2];

            fixture.detectChanges();
            tick();

            expandNodes(component.dropdownTree, [
                component.nodes[0],
            ]);

            const event = new KeyboardEvent('keydown', {
                ctrlKey: true,
                key: 'Home',
            });
            host.triggerEventHandler('keydown', event);

            fixture.detectChanges();
            tick();

            expect(component.dropdownTree.highlightedNode).toBe(component.nodes[0]);
        }));

        it('Ctrl+Home does not change selected node', fakeAsync(() => {
            component.defaultLabel = null;
            component.dropdownTree.highlightedNode = component.nodes[0].children[1];
            component.selectedNode = component.nodes[2];

            fixture.detectChanges();
            tick();

            expandNodes(component.dropdownTree, [
                component.nodes[0],
            ]);

            const event = new KeyboardEvent('keydown', {
                ctrlKey: true,
                key: 'Home',
            });
            host.triggerEventHandler('keydown', event);

            fixture.detectChanges();
            tick();

            expect(component.selectedNode).toBe(component.nodes[2]);
        }));

        it('Ctrl+Home changes highlighted node to first visible node when default label is not null', fakeAsync(() => {
            component.dropdownTree.highlightedNode = component.nodes[0].children[1];
            component.selectedNode = component.nodes[2];

            fixture.detectChanges();
            tick();

            expandNodes(component.dropdownTree, [
                component.nodes[0],
            ]);

            const event = new KeyboardEvent('keydown', {
                ctrlKey: true,
                key: 'Home',
            });
            host.triggerEventHandler('keydown', event);

            fixture.detectChanges();
            tick();

            expect(component.dropdownTree.highlightedNode).toBe(component.dropdownTree.defaultNode);
        }));

        it('Ctrl+Home does not change selected node when default label is not null', fakeAsync(() => {
            component.dropdownTree.highlightedNode = component.nodes[0].children[1];
            component.selectedNode = component.nodes[2];

            fixture.detectChanges();
            tick();

            expandNodes(component.dropdownTree, [
                component.nodes[0],
            ]);

            const event = new KeyboardEvent('keydown', {
                ctrlKey: true,
                key: 'Home',
            });
            host.triggerEventHandler('keydown', event);

            fixture.detectChanges();
            tick();

            expect(component.selectedNode).toBe(component.nodes[2]);
        }));

        it('Ctrl+Home changes highlighted node to first visible node when first visible node is not selectable', fakeAsync(() => {
            component.defaultLabel = null;
            component.dropdownTree.highlightedNode = component.nodes[0].children[1];
            component.selectedNode = component.nodes[2];

            component.nodes[0].selectable = false;

            fixture.detectChanges();
            tick();

            expandNodes(component.dropdownTree, [
                component.nodes[0],
            ]);

            const event = new KeyboardEvent('keydown', {
                ctrlKey: true,
                key: 'Home',
            });
            host.triggerEventHandler('keydown', event);

            fixture.detectChanges();
            tick();

            expect(component.dropdownTree.highlightedNode).toBe(component.nodes[0]);
        }));

        it('Ctrl+Home does not change selected node when first visible node is not selectable', fakeAsync(() => {
            component.defaultLabel = null;
            component.dropdownTree.highlightedNode = component.nodes[0].children[1];
            component.selectedNode = component.nodes[2];

            component.nodes[0].selectable = false;

            fixture.detectChanges();
            tick();

            expandNodes(component.dropdownTree, [
                component.nodes[0],
            ]);

            const event = new KeyboardEvent('keydown', {
                ctrlKey: true,
                key: 'Home',
            });
            host.triggerEventHandler('keydown', event);

            fixture.detectChanges();
            tick();

            expect(component.selectedNode).toBe(component.nodes[2]);
        }));

        it('End changes highlighted node to last visible node', fakeAsync(() => {
            component.dropdownTree.highlightedNode = component.nodes[0].children[1];
            component.selectedNode = component.nodes[0];

            fixture.detectChanges();
            tick();

            expandNodes(component.dropdownTree, [
                component.nodes[0],
            ]);

            const event = new KeyboardEvent('keydown', {
                key: 'End',
            });
            host.triggerEventHandler('keydown', event);

            fixture.detectChanges();
            tick();

            expect(component.dropdownTree.highlightedNode).toBe(component.nodes[2]);
        }));

        it('End changes selected node to last visible node', fakeAsync(() => {
            component.dropdownTree.highlightedNode = component.nodes[0].children[1];
            component.selectedNode = component.nodes[0];

            fixture.detectChanges();
            tick();

            expandNodes(component.dropdownTree, [
                component.nodes[0],
            ]);

            const event = new KeyboardEvent('keydown', {
                key: 'End',
            });
            host.triggerEventHandler('keydown', event);

            fixture.detectChanges();
            tick();

            expect(component.selectedNode).toBe(component.nodes[2]);
        }));

        it('End changes highlighted node to last visible node when last visible node is not selectable', fakeAsync(() => {
            component.dropdownTree.highlightedNode = component.nodes[0].children[1];
            component.selectedNode = component.nodes[0];

            component.nodes[2].selectable = false;

            fixture.detectChanges();
            tick();

            expandNodes(component.dropdownTree, [
                component.nodes[0],
            ]);

            const event = new KeyboardEvent('keydown', {
                key: 'End',
            });
            host.triggerEventHandler('keydown', event);

            fixture.detectChanges();
            tick();

            expect(component.dropdownTree.highlightedNode).toBe(component.nodes[2]);
        }));

        it('End does not change selected node when last visible node is not selectable', fakeAsync(() => {
            component.dropdownTree.highlightedNode = component.nodes[0].children[1];
            component.selectedNode = component.nodes[0];

            component.nodes[2].selectable = false;

            fixture.detectChanges();
            tick();

            expandNodes(component.dropdownTree, [
                component.nodes[0],
            ]);

            const event = new KeyboardEvent('keydown', {
                key: 'End',
            });
            host.triggerEventHandler('keydown', event);

            fixture.detectChanges();
            tick();

            expect(component.selectedNode).toBe(component.nodes[0]);
        }));

        it('Ctrl+End changes highlighted node to last visible node', fakeAsync(() => {
            component.dropdownTree.highlightedNode = component.nodes[0].children[1];
            component.selectedNode = component.nodes[0];

            fixture.detectChanges();
            tick();

            expandNodes(component.dropdownTree, [
                component.nodes[0],
            ]);

            const event = new KeyboardEvent('keydown', {
                ctrlKey: true,
                key: 'End',
            });
            host.triggerEventHandler('keydown', event);

            fixture.detectChanges();
            tick();

            expect(component.dropdownTree.highlightedNode).toBe(component.nodes[2]);
        }));

        it('Ctrl+End does not change selected node', fakeAsync(() => {
            component.dropdownTree.highlightedNode = component.nodes[0].children[1];
            component.selectedNode = component.nodes[0];

            fixture.detectChanges();
            tick();

            expandNodes(component.dropdownTree, [
                component.nodes[0],
            ]);

            const event = new KeyboardEvent('keydown', {
                ctrlKey: true,
                key: 'End',
            });
            host.triggerEventHandler('keydown', event);

            fixture.detectChanges();
            tick();

            expect(component.selectedNode).toBe(component.nodes[0]);
        }));

        it('Ctrl+End changes highlighted node to last visible node when last visible node is not selectable', fakeAsync(() => {
            component.dropdownTree.highlightedNode = component.nodes[0].children[1];
            component.selectedNode = component.nodes[0];

            component.nodes[2].selectable = false;

            fixture.detectChanges();
            tick();

            expandNodes(component.dropdownTree, [
                component.nodes[0],
            ]);

            const event = new KeyboardEvent('keydown', {
                ctrlKey: true,
                key: 'End',
            });
            host.triggerEventHandler('keydown', event);

            fixture.detectChanges();
            tick();

            expect(component.dropdownTree.highlightedNode).toBe(component.nodes[2]);
        }));

        it('Ctrl+End does not change selected node when last visible node is not selectable', fakeAsync(() => {
            component.dropdownTree.highlightedNode = component.nodes[0].children[1];
            component.selectedNode = component.nodes[0];

            component.nodes[2].selectable = false;

            fixture.detectChanges();
            tick();

            expandNodes(component.dropdownTree, [
                component.nodes[0],
            ]);

            const event = new KeyboardEvent('keydown', {
                ctrlKey: true,
                key: 'End',
            });
            host.triggerEventHandler('keydown', event);

            fixture.detectChanges();
            tick();

            expect(component.selectedNode).toBe(component.nodes[0]);
        }));

        it('Space changes selected node to current highlighted node', fakeAsync(() => {
            component.dropdownTree.highlightedNode = component.nodes[0].children[1];
            component.selectedNode = component.nodes[2];

            fixture.detectChanges();
            tick();

            expandNodes(component.dropdownTree, [
                component.nodes[0],
            ]);

            const event = new KeyboardEvent('keydown', {
                key: ' ',
            });
            host.triggerEventHandler('keydown', event);

            fixture.detectChanges();
            tick();
            tick(1000);

            expect(component.selectedNode).toBe(component.nodes[0].children[1]);
        }));

        it('Space does not change selected node when highlighted node is not selectable', fakeAsync(() => {
            component.dropdownTree.highlightedNode = component.nodes[0].children[1];
            component.selectedNode = component.nodes[2];

            component.nodes[0].children[1].selectable = false;

            fixture.detectChanges();
            tick();

            expandNodes(component.dropdownTree, [
                component.nodes[0],
            ]);

            const event = new KeyboardEvent('keydown', {
                key: ' ',
            });
            host.triggerEventHandler('keydown', event);

            fixture.detectChanges();
            tick();
            tick(1000);

            expect(component.selectedNode).toBe(component.nodes[2]);
        }));

        it('Ctrl+Space changes selected node to current highlighted node', fakeAsync(() => {
            component.dropdownTree.highlightedNode = component.nodes[0].children[1];
            component.selectedNode = component.nodes[2];

            fixture.detectChanges();
            tick();

            expandNodes(component.dropdownTree, [
                component.nodes[0],
            ]);

            const event = new KeyboardEvent('keydown', {
                ctrlKey: true,
                key: ' ',
            });
            host.triggerEventHandler('keydown', event);

            fixture.detectChanges();
            tick();
            tick(1000);

            expect(component.selectedNode).toBe(component.nodes[0].children[1]);
        }));

        it('Ctrl+Space does not change selected node when highlighted node is not selectable', fakeAsync(() => {
            component.dropdownTree.highlightedNode = component.nodes[0].children[1];
            component.selectedNode = component.nodes[2];

            component.nodes[0].children[1].selectable = false;

            fixture.detectChanges();
            tick();

            expandNodes(component.dropdownTree, [
                component.nodes[0],
            ]);

            const event = new KeyboardEvent('keydown', {
                ctrlKey: true,
                key: ' ',
            });
            host.triggerEventHandler('keydown', event);

            fixture.detectChanges();
            tick();
            tick(1000);

            expect(component.selectedNode).toBe(component.nodes[2]);
        }));

        it('Enter changes selected node to current highlighted node', fakeAsync(() => {
            component.dropdownTree.highlightedNode = component.nodes[0].children[1];
            component.selectedNode = component.nodes[2];

            fixture.detectChanges();
            tick();

            expandNodes(component.dropdownTree, [
                component.nodes[0],
            ]);

            const event = new KeyboardEvent('keydown', {
                key: 'Enter',
            });
            host.triggerEventHandler('keydown', event);

            fixture.detectChanges();
            tick();
            tick(1000);

            expect(component.selectedNode).toBe(component.nodes[0].children[1]);
        }));

        it('Enter does not change selected node when highlighted node is not selectable', fakeAsync(() => {
            component.dropdownTree.highlightedNode = component.nodes[0].children[1];
            component.selectedNode = component.nodes[2];

            component.nodes[0].children[1].selectable = false;

            fixture.detectChanges();
            tick();

            expandNodes(component.dropdownTree, [
                component.nodes[0],
            ]);

            const event = new KeyboardEvent('keydown', {
                key: 'Enter',
            });
            host.triggerEventHandler('keydown', event);

            fixture.detectChanges();
            tick();
            tick(1000);

            expect(component.selectedNode).toBe(component.nodes[2]);
        }));
    });

    describe('when disabled', () => {
        let fixture: ComponentFixture<BasicModelComponent>;
        let component: BasicModelComponent;
        let trigger: HTMLElement;

        beforeEach(fakeAsync(() => {
            fixture = TestBed.createComponent(BasicModelComponent);
            component = fixture.componentInstance;

            fixture.detectChanges();
            tick();

            trigger = fixture.debugElement.query(By.css('.cf-dropdown-tree-trigger')).nativeElement;
        }));

        it('will not open when clicked', fakeAsync(() => {
            component.disabled = true;

            fixture.detectChanges();
            tick();

            trigger.click();

            fixture.detectChanges();
            tick();

            expect(component.dropdownTree.panelOpen).toBe(false);
        }));

        it('will open when clicked after reenabling', fakeAsync(() => {
            component.disabled = true;

            fixture.detectChanges();
            tick();

            component.disabled = false;

            fixture.detectChanges();
            tick();

            trigger.click();

            fixture.detectChanges();
            tick();

            expect(component.dropdownTree.panelOpen).toBe(true);
        }));
    });

    function expandNodes(dropdownTree: DropdownTreeComponent, nodes: TreeNode[]): void {
        collapseAllNodes(dropdownTree);
        for(const node of nodes) {
            dropdownTree.expandNode(node);
        }
    }

    function collapseAllNodes(dropdownTree: DropdownTreeComponent): void {
        const nodes = Array.from(dropdownTree.expandedNodes.values());
        for(const node of nodes) {
            dropdownTree.collapseNode(node);
        }
    }
});

@Component({
    template: `
<cf-dropdown-tree
    placeholder="Basic Model"
    [(ngModel)]="selectedNode"
    [defaultExpansionLevel]="defaultExpansionLevel"
    [defaultLabel]="defaultLabel"
    [disabled]="disabled"
    [nodes]="nodes"
    [required]="required"
    [showFullSelectedPath]="showFullSelectedPath"
    [tabIndex]="tabIndexOverride"
    (opened)="opened()"
    (closed)="closed()">
</cf-dropdown-tree>`,
})
class BasicModelComponent {
    defaultExpansionLevel: number = 0;
    defaultLabel: string = null;
    disabled: boolean = false;
    nodes: TreeNode[] = createNodeTree();
    required: boolean = false;
    selectedNode: TreeNode = null;
    showFullSelectedPath: boolean = false;
    tabIndexOverride: number;

    @ViewChild(DropdownTreeComponent) dropdownTree: DropdownTreeComponent;

    opened: jasmine.Spy = jasmine.createSpy('opened');
    closed: jasmine.Spy = jasmine.createSpy('closed');
}

@Component({
    template: `
<cf-dropdown-tree
    placeholder="Basic Model"
    [(ngModel)]="selectedNode"
    [nodes]="nodes"
    tabindex="5">
</cf-dropdown-tree>`,
})
class PlainTabindexComponent {
    nodes: TreeNode[] = createNodeTree();
    selectedNode: TreeNode = null;
}

function createNode(...children: TreeNode[]): TreeNode {
    const id = currentId++;

    return {
        id,
        text: 'ABC-' + id,
        children,
    };
}

function createNodeTree(): TreeNode[] {
    return [
        createNode(
            createNode(),
            createNode(
                createNode(),
                createNode(),
            ),
            createNode(
                createNode(),
                createNode(
                    createNode(),
                ),
                createNode(),
            ),
        ),
        createNode(
            createNode(
                createNode(),
            ),
        ),
        createNode(),
    ];
}
