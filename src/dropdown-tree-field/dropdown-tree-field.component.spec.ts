import { OverlayContainer }             from '@angular/cdk/overlay';
import {
    Component,
    DebugElement,
    ViewChild,
}                                       from '@angular/core';
import {
    ComponentFixture,
    TestBed,
    fakeAsync,
    tick,
}                                       from '@angular/core/testing';
import { FormsModule }                  from '@angular/forms';
import {
    Dir,
    MATERIAL_SANITY_CHECKS,
}                                       from '@angular/material';
import { By }                           from '@angular/platform-browser';
import { NoopAnimationsModule }         from '@angular/platform-browser/animations';

import { DropdownTreeFieldComponent }   from './dropdown-tree-field.component';
import { DropdownTreeFieldModule }      from './dropdown-tree-field.module';
import { TreeNode }                     from './tree-node.model';
import { ViewportRuler }                from './viewport-ruler';

let currentId: number;

describe('DropdownTreeFieldComponent', () => {
    let overlayContainerElement: HTMLElement;
    let dir: { value: string };

    beforeEach(() => {
        currentId = 1;

        TestBed.configureTestingModule({
            imports: [
                FormsModule,
                DropdownTreeFieldModule,
                NoopAnimationsModule,
            ],
            declarations: [
                BasicModelComponent,
                PlainTabindexComponent,
            ],
            providers: [
                { provide: OverlayContainer, useFactory: () => overlayContainerFactory() },
                { provide: Dir, useFactory: () => dir = { value: 'ltr' } },
                { provide: ViewportRuler, useClass: FakeViewportRuler },
                { provide: MATERIAL_SANITY_CHECKS, useValue: false },
            ],
        });
    });

    afterEach(() => {
        document.body.removeChild(overlayContainerElement);
    });

    function overlayContainerFactory(): any {
        overlayContainerElement = document.createElement('div');
        overlayContainerElement.classList.add('cdk-overlay-container');

        document.body.appendChild(overlayContainerElement);

        document.body.style.padding = '0';
        document.body.style.margin = '0';

        return { getContainerElement: () => overlayContainerElement };
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

            let nodesInPath = [
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

            let nodesInPath = [
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

            let nodesInPath = [
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

            expect(component.dropdownTree.expandedNodes).toEqual({
                asymmetricMatch(actual: Set<TreeNode>): boolean {
                    return actual.size === 2 &&
                        actual.has(component.nodes[0]) &&
                        actual.has(component.nodes[0].children[2]);
                },
            });
        }));

        it('expands no nodes when value is null', fakeAsync(() => {
            component.selectedNode = null;

            fixture.detectChanges();
            tick();

            expect(component.dropdownTree.expandedNodes.size).toBe(0);
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

            expect(component.dropdownTree.isPanelOpen).toBe(true);
        }));

        it('and emits opened', fakeAsync(() => {
            trigger.click();

            fixture.detectChanges();
            tick();

            expect(component.opened).toHaveBeenCalled();
        }));

        xit('and sets the width of the overlay based on the trigger when clicked', fakeAsync(() => {
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
            let selectedNode = component.nodes[0].children[2].children[1];
            component.selectedNode = selectedNode;

            fixture.detectChanges();
            tick();

            component.dropdownTree.expandedNodes = new Set<TreeNode>([
                component.nodes[0],
                component.nodes[0].children[2],
                component.nodes[0].children[2].children[1],
            ]);

            trigger.click();

            fixture.detectChanges();
            tick();

            expect(component.dropdownTree.highlightedNode).toBe(selectedNode);
        }));

        it('and highlights first node when value is not visible and defaultNode does not exist', fakeAsync(() => {
            let selectedNode = component.nodes[0].children[2].children[1];
            component.selectedNode = selectedNode;
            component.defaultLabel = null;

            fixture.detectChanges();
            tick();

            component.dropdownTree.expandedNodes = new Set<TreeNode>([
                component.nodes[0],
            ]);

            trigger.click();

            fixture.detectChanges();
            tick();

            expect(component.dropdownTree.highlightedNode).toBe(component.nodes[0]);
        }));

        it('and highlights defaultNode when value is not visible and defaultNode exists', fakeAsync(() => {
            let selectedNode = component.nodes[0].children[2].children[1];
            component.selectedNode = selectedNode;
            component.defaultLabel = 'Any';

            fixture.detectChanges();
            tick();

            component.dropdownTree.expandedNodes = new Set<TreeNode>([
                component.nodes[0],
            ]);

            trigger.click();

            fixture.detectChanges();
            tick();

            expect(component.dropdownTree.highlightedNode).toBe(component.dropdownTree.defaultNode);
        }));

        it('when Alt+ArrowDown pressed', fakeAsync(() => {
            let event = new KeyboardEvent('keydown', {
                altKey: true,
                key: 'ArrowDown',
            });
            host.triggerEventHandler('keydown', event);

            fixture.detectChanges();
            tick();

            expect(component.dropdownTree.isPanelOpen).toBe(true);
        }));

        it('when Enter pressed', fakeAsync(() => {
            let event = new KeyboardEvent('keydown', {
                key: 'Enter',
            });
            host.triggerEventHandler('keydown', event);

            fixture.detectChanges();
            tick();

            expect(component.dropdownTree.isPanelOpen).toBe(true);
        }));

        it('when Space pressed', fakeAsync(() => {
            let event = new KeyboardEvent('keydown', {
                key: ' ',
            });
            host.triggerEventHandler('keydown', event);

            fixture.detectChanges();
            tick();

            expect(component.dropdownTree.isPanelOpen).toBe(true);
        }));
    });

    describe('closes', () => {
        let fixture: ComponentFixture<BasicModelComponent>;
        let component: BasicModelComponent;
        let panel: HTMLElement;
        let trigger: HTMLElement;

        beforeEach(fakeAsync(() => {
            fixture = TestBed.createComponent(BasicModelComponent);
            component = fixture.componentInstance;

            fixture.detectChanges();
            tick();

            trigger = fixture.debugElement.query(By.css('.cf-dropdown-tree-trigger')).nativeElement;
            trigger.click();

            fixture.detectChanges();
            tick();

            panel = overlayContainerElement.querySelector('.cf-dropdown-tree-panel') as HTMLElement;
        }));

        it('when item clicked', fakeAsync(() => {
            const item = overlayContainerElement.querySelectorAll('.cf-dropdown-tree-node > .cf-dropdown-tree-node-line > .cf-dropdown-tree-node-text')[1] as HTMLElement;
            item.click();

            fixture.detectChanges();
            tick();
            tick(1000);

            expect(component.dropdownTree.isPanelOpen).toBe(false);
        }));

        it('when backdrop clicked', fakeAsync(() => {
            const backdrop = overlayContainerElement.querySelector('.cdk-overlay-backdrop') as HTMLElement;
            backdrop.click();

            fixture.detectChanges();
            tick();
            tick(1000);

            expect(component.dropdownTree.isPanelOpen).toBe(false);
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
            let event = new KeyboardEvent('keydown', {
                altKey: true,
                key: 'ArrowUp',
            });
            panel.dispatchEvent(event);

            fixture.detectChanges();
            tick();
            tick(1000);

            expect(component.dropdownTree.isPanelOpen).toBe(false);
        }));

        it('when Escape pressed', fakeAsync(() => {
            let event = new KeyboardEvent('keydown', {
                key: 'Escape',
            });
            panel.dispatchEvent(event);

            fixture.detectChanges();
            tick();
            tick(1000);

            expect(component.dropdownTree.isPanelOpen).toBe(false);
        }));

        it('when Tab pressed', fakeAsync(() => {
            let event = new KeyboardEvent('keydown', {
                key: 'Tab',
            });
            panel.dispatchEvent(event);

            fixture.detectChanges();
            tick();
            tick(1000);

            expect(component.dropdownTree.isPanelOpen).toBe(false);
        }));

        it('when Space pressed', fakeAsync(() => {
            let event = new KeyboardEvent('keydown', {
                key: ' ',
            });
            panel.dispatchEvent(event);

            fixture.detectChanges();
            tick();
            tick(1000);

            expect(component.dropdownTree.isPanelOpen).toBe(false);
        }));

        it('when Ctrl+Space pressed', fakeAsync(() => {
            let event = new KeyboardEvent('keydown', {
                ctrlKey: true,
                key: ' ',
            });
            panel.dispatchEvent(event);

            fixture.detectChanges();
            tick();
            tick(1000);

            expect(component.dropdownTree.isPanelOpen).toBe(false);
        }));

        it('when Enter pressed', fakeAsync(() => {
            let event = new KeyboardEvent('keydown', {
                key: 'Enter',
            });
            panel.dispatchEvent(event);

            fixture.detectChanges();
            tick();
            tick(1000);

            expect(component.dropdownTree.isPanelOpen).toBe(false);
        }));
    });

    describe('keyboard', () => {
        let fixture: ComponentFixture<BasicModelComponent>;
        let component: BasicModelComponent;
        let panel: HTMLElement;
        let trigger: HTMLElement;

        beforeEach(fakeAsync(() => {
            fixture = TestBed.createComponent(BasicModelComponent);
            component = fixture.componentInstance;

            component.defaultLabel = 'Any';

            fixture.detectChanges();
            tick();

            trigger = fixture.debugElement.query(By.css('.cf-dropdown-tree-trigger')).nativeElement;
            trigger.click();

            fixture.detectChanges();
            tick();

            panel = overlayContainerElement.querySelector('.cf-dropdown-tree-panel') as HTMLElement;
        }));

        it('ArrowUp highlights previous visible node of current highlighted node', fakeAsync(() => {
            component.dropdownTree.highlightedNode = component.nodes[1];
            component.selectedNode = component.nodes[2];

            let event = new KeyboardEvent('keydown', {
                key: 'ArrowUp',
            });
            panel.dispatchEvent(event);

            fixture.detectChanges();
            tick();

            expect(component.dropdownTree.highlightedNode).toBe(component.nodes[0]);
        }));

        it('ArrowUp selects previous visible node of current highlighted node', fakeAsync(() => {
            component.dropdownTree.highlightedNode = component.nodes[1];
            component.selectedNode = component.nodes[2];

            let event = new KeyboardEvent('keydown', {
                key: 'ArrowUp',
            });
            panel.dispatchEvent(event);

            fixture.detectChanges();
            tick();

            expect(component.selectedNode).toBe(component.nodes[0]);
        }));

        it('ArrowUp does not change highlighted node when current highlighted node is first visible node', fakeAsync(() => {
            component.dropdownTree.highlightedNode = component.dropdownTree.defaultNode;
            component.selectedNode = component.nodes[2];

            let event = new KeyboardEvent('keydown', {
                key: 'ArrowUp',
            });
            panel.dispatchEvent(event);

            fixture.detectChanges();
            tick();

            expect(component.dropdownTree.highlightedNode).toBe(component.dropdownTree.defaultNode);
        }));

        it('ArrowUp does not change selected node when current highlighted node is first visible node', fakeAsync(() => {
            component.dropdownTree.highlightedNode = component.dropdownTree.defaultNode;
            component.selectedNode = component.nodes[2];

            let event = new KeyboardEvent('keydown', {
                key: 'ArrowUp',
            });
            panel.dispatchEvent(event);

            fixture.detectChanges();
            tick();

            expect(component.selectedNode).toBe(component.nodes[2]);
        }));

        it('Ctrl+ArrowUp highlights previous visible node of current highlighted node', fakeAsync(() => {
            component.dropdownTree.highlightedNode = component.nodes[1];
            component.selectedNode = component.nodes[2];

            let event = new KeyboardEvent('keydown', {
                ctrlKey: true,
                key: 'ArrowUp',
            });
            panel.dispatchEvent(event);

            fixture.detectChanges();
            tick();

            expect(component.dropdownTree.highlightedNode).toBe(component.nodes[0]);
        }));

        it('Ctrl+ArrowUp does not change selected node', fakeAsync(() => {
            component.dropdownTree.highlightedNode = component.nodes[1];
            component.selectedNode = component.nodes[2];

            let event = new KeyboardEvent('keydown', {
                ctrlKey: true,
                key: 'ArrowUp',
            });
            panel.dispatchEvent(event);

            fixture.detectChanges();
            tick();

            expect(component.selectedNode).toBe(component.nodes[2]);
        }));

        it('Ctrl+ArrowUp does not change highlighted node when current highlighted node is first visible node', fakeAsync(() => {
            component.dropdownTree.highlightedNode = component.dropdownTree.defaultNode;
            component.selectedNode = component.nodes[2];

            let event = new KeyboardEvent('keydown', {
                ctrlKey: true,
                key: 'ArrowUp',
            });
            panel.dispatchEvent(event);

            fixture.detectChanges();
            tick();

            expect(component.dropdownTree.highlightedNode).toBe(component.dropdownTree.defaultNode);
        }));

        it('Ctrl+ArrowUp does not change selected node when current highlighted node is first visible node', fakeAsync(() => {
            component.dropdownTree.highlightedNode = component.dropdownTree.defaultNode;
            component.selectedNode = component.nodes[2];

            let event = new KeyboardEvent('keydown', {
                ctrlKey: true,
                key: 'ArrowUp',
            });
            panel.dispatchEvent(event);

            fixture.detectChanges();
            tick();

            expect(component.selectedNode).toBe(component.nodes[2]);
        }));

        it('ArrowDown highlights next visible node of current highlighted node', fakeAsync(() => {
            component.dropdownTree.highlightedNode = component.nodes[1];
            component.selectedNode = component.nodes[0];

            let event = new KeyboardEvent('keydown', {
                key: 'ArrowDown',
            });
            panel.dispatchEvent(event);

            fixture.detectChanges();
            tick();

            expect(component.dropdownTree.highlightedNode).toBe(component.nodes[2]);
        }));

        it('ArrowDown selects next visible node of current highlighted node', fakeAsync(() => {
            component.dropdownTree.highlightedNode = component.nodes[1];
            component.selectedNode = component.nodes[0];

            let event = new KeyboardEvent('keydown', {
                key: 'ArrowDown',
            });
            panel.dispatchEvent(event);

            fixture.detectChanges();
            tick();

            expect(component.selectedNode).toBe(component.nodes[2]);
        }));

        it('ArrowDown does not change highlighted node when current highlighted node is last visible node', fakeAsync(() => {
            component.dropdownTree.highlightedNode = component.nodes[2];
            component.selectedNode = component.nodes[0];

            let event = new KeyboardEvent('keydown', {
                key: 'ArrowDown',
            });
            panel.dispatchEvent(event);

            fixture.detectChanges();
            tick();

            expect(component.dropdownTree.highlightedNode).toBe(component.nodes[2]);
        }));

        it('ArrowDown does not change selected node when current highlighted node is last visible node', fakeAsync(() => {
            component.dropdownTree.highlightedNode = component.nodes[2];
            component.selectedNode = component.nodes[0];

            let event = new KeyboardEvent('keydown', {
                key: 'ArrowDown',
            });
            panel.dispatchEvent(event);

            fixture.detectChanges();
            tick();

            expect(component.selectedNode).toBe(component.nodes[0]);
        }));

        it('Ctrl+ArrowDown highlights next visible node of current highlighted node', fakeAsync(() => {
            component.dropdownTree.highlightedNode = component.nodes[1];
            component.selectedNode = component.nodes[0];

            let event = new KeyboardEvent('keydown', {
                ctrlKey: true,
                key: 'ArrowDown',
            });
            panel.dispatchEvent(event);

            fixture.detectChanges();
            tick();

            expect(component.dropdownTree.highlightedNode).toBe(component.nodes[2]);
        }));

        it('Ctrl+ArrowDown does not change selected node', fakeAsync(() => {
            component.dropdownTree.highlightedNode = component.nodes[1];
            component.selectedNode = component.nodes[0];

            let event = new KeyboardEvent('keydown', {
                ctrlKey: true,
                key: 'ArrowDown',
            });
            panel.dispatchEvent(event);

            fixture.detectChanges();
            tick();

            expect(component.selectedNode).toBe(component.nodes[0]);
        }));

        it('Ctrl+ArrowDown does not change highlighted node when current highlighted node is last visible node', fakeAsync(() => {
            component.dropdownTree.highlightedNode = component.nodes[2];
            component.selectedNode = component.nodes[0];

            let event = new KeyboardEvent('keydown', {
                ctrlKey: true,
                key: 'ArrowDown',
            });
            panel.dispatchEvent(event);

            fixture.detectChanges();
            tick();

            expect(component.dropdownTree.highlightedNode).toBe(component.nodes[2]);
        }));

        it('Ctrl+ArrowDown does not change selected node when current highlighted node is last visible node', fakeAsync(() => {
            component.dropdownTree.highlightedNode = component.nodes[2];
            component.selectedNode = component.nodes[0];

            let event = new KeyboardEvent('keydown', {
                ctrlKey: true,
                key: 'ArrowDown',
            });
            panel.dispatchEvent(event);

            fixture.detectChanges();
            tick();

            expect(component.selectedNode).toBe(component.nodes[0]);
        }));

        it('ArrowLeft does not change highlighted node when current highlighted node is expanded', fakeAsync(() => {
            component.dropdownTree.highlightedNode = component.nodes[0].children[1];
            component.selectedNode = component.nodes[2];

            fixture.detectChanges();
            tick();

            component.dropdownTree.expandedNodes = new Set<TreeNode>([
                component.nodes[0],
                component.nodes[0].children[1],
            ]);

            let event = new KeyboardEvent('keydown', {
                key: 'ArrowLeft',
            });
            panel.dispatchEvent(event);

            fixture.detectChanges();
            tick();

            expect(component.dropdownTree.highlightedNode).toBe(component.nodes[0].children[1]);
        }));

        it('ArrowLeft does not change selected node when current highlighted node is expanded', fakeAsync(() => {
            component.dropdownTree.highlightedNode = component.nodes[0].children[1];
            component.selectedNode = component.nodes[2];

            fixture.detectChanges();
            tick();

            component.dropdownTree.expandedNodes = new Set<TreeNode>([
                component.nodes[0],
                component.nodes[0].children[1],
            ]);

            let event = new KeyboardEvent('keydown', {
                key: 'ArrowLeft',
            });
            panel.dispatchEvent(event);

            fixture.detectChanges();
            tick();

            expect(component.selectedNode).toBe(component.nodes[2]);
        }));

        it('ArrowLeft collapses current highlighted node when current highlighted node is expanded', fakeAsync(() => {
            component.dropdownTree.highlightedNode = component.nodes[0].children[1];
            component.selectedNode = component.nodes[2];

            fixture.detectChanges();
            tick();

            component.dropdownTree.expandedNodes = new Set<TreeNode>([
                component.nodes[0],
                component.nodes[0].children[1],
            ]);

            let event = new KeyboardEvent('keydown', {
                key: 'ArrowLeft',
            });
            panel.dispatchEvent(event);

            fixture.detectChanges();
            tick();

            expect(component.dropdownTree.expandedNodes.has(component.nodes[0].children[1])).toBe(false);
        }));

        it('ArrowLeft changes highlighted node to parent of current highlighted node when current highlighted node is collapsed', fakeAsync(() => {
            component.dropdownTree.highlightedNode = component.nodes[0].children[1];
            component.selectedNode = component.nodes[2];

            fixture.detectChanges();
            tick();

            component.dropdownTree.expandedNodes = new Set<TreeNode>([
                component.nodes[0],
            ]);

            let event = new KeyboardEvent('keydown', {
                key: 'ArrowLeft',
            });
            panel.dispatchEvent(event);

            fixture.detectChanges();
            tick();

            expect(component.dropdownTree.highlightedNode).toBe(component.nodes[0]);
        }));

        it('ArrowLeft changes selected node to parent of current highlighted node when current highlighted node is collapsed', fakeAsync(() => {
            component.dropdownTree.highlightedNode = component.nodes[0].children[1];
            component.selectedNode = component.nodes[2];

            fixture.detectChanges();
            tick();

            component.dropdownTree.expandedNodes = new Set<TreeNode>([
                component.nodes[0],
            ]);

            let event = new KeyboardEvent('keydown', {
                key: 'ArrowLeft',
            });
            panel.dispatchEvent(event);

            fixture.detectChanges();
            tick();

            expect(component.selectedNode).toBe(component.nodes[0]);
        }));

        it('ArrowLeft does not change highlighted node when current highlighted node is collapsed and has no parent', fakeAsync(() => {
            component.dropdownTree.highlightedNode = component.nodes[0];
            component.selectedNode = component.nodes[2];

            fixture.detectChanges();
            tick();

            component.dropdownTree.expandedNodes = new Set<TreeNode>();

            let event = new KeyboardEvent('keydown', {
                key: 'ArrowLeft',
            });
            panel.dispatchEvent(event);

            fixture.detectChanges();
            tick();

            expect(component.dropdownTree.highlightedNode).toBe(component.nodes[0]);
        }));

        it('ArrowLeft does not change selected node when current highlighted node is collapsed and has no parent', fakeAsync(() => {
            component.dropdownTree.highlightedNode = component.nodes[0];
            component.selectedNode = component.nodes[2];

            fixture.detectChanges();
            tick();

            component.dropdownTree.expandedNodes = new Set<TreeNode>();

            let event = new KeyboardEvent('keydown', {
                key: 'ArrowLeft',
            });
            panel.dispatchEvent(event);

            fixture.detectChanges();
            tick();

            expect(component.selectedNode).toBe(component.nodes[2]);
        }));

        it('ArrowRight does not change highlighted node when current highlighted node is collapsed', fakeAsync(() => {
            component.dropdownTree.highlightedNode = component.nodes[0];
            component.selectedNode = component.nodes[2];

            fixture.detectChanges();
            tick();

            component.dropdownTree.expandedNodes = new Set<TreeNode>();

            let event = new KeyboardEvent('keydown', {
                key: 'ArrowRight',
            });
            panel.dispatchEvent(event);

            fixture.detectChanges();
            tick();

            expect(component.dropdownTree.highlightedNode).toBe(component.nodes[0]);
        }));

        it('ArrowRight does not change selected node when current highlighted node is collapsed', fakeAsync(() => {
            component.dropdownTree.highlightedNode = component.nodes[0];
            component.selectedNode = component.nodes[2];

            fixture.detectChanges();
            tick();

            component.dropdownTree.expandedNodes = new Set<TreeNode>();

            let event = new KeyboardEvent('keydown', {
                key: 'ArrowRight',
            });
            panel.dispatchEvent(event);

            fixture.detectChanges();
            tick();

            expect(component.selectedNode).toBe(component.nodes[2]);
        }));

        it('ArrowRight expands current highlighted node when current highlighted node is collapsed', fakeAsync(() => {
            component.dropdownTree.highlightedNode = component.nodes[0];
            component.selectedNode = component.nodes[2];

            fixture.detectChanges();
            tick();

            component.dropdownTree.expandedNodes = new Set<TreeNode>();

            let event = new KeyboardEvent('keydown', {
                key: 'ArrowRight',
            });
            panel.dispatchEvent(event);

            fixture.detectChanges();
            tick();

            expect(component.dropdownTree.expandedNodes.has(component.nodes[0])).toBe(true);
        }));

        it('ArrowRight changes highlighted node to first child of the current highlighted node when current highlighted node is expanded', fakeAsync(() => {
            component.dropdownTree.highlightedNode = component.nodes[0];
            component.selectedNode = component.nodes[2];

            fixture.detectChanges();
            tick();

            component.dropdownTree.expandedNodes = new Set<TreeNode>([
                component.nodes[0],
            ]);

            let event = new KeyboardEvent('keydown', {
                key: 'ArrowRight',
            });
            panel.dispatchEvent(event);

            fixture.detectChanges();
            tick();

            expect(component.dropdownTree.highlightedNode).toBe(component.nodes[0].children[0]);
        }));

        it('ArrowRight changes selected node to first child of the current highlighted node when current highlighted node is expanded', fakeAsync(() => {
            component.dropdownTree.highlightedNode = component.nodes[0];
            component.selectedNode = component.nodes[2];

            fixture.detectChanges();
            tick();

            component.dropdownTree.expandedNodes = new Set<TreeNode>([
                component.nodes[0],
            ]);

            let event = new KeyboardEvent('keydown', {
                key: 'ArrowRight',
            });
            panel.dispatchEvent(event);

            fixture.detectChanges();
            tick();

            expect(component.selectedNode).toBe(component.nodes[0].children[0]);
        }));

        it('ArrowRight does not change highlighted node when current highlighted node has no children', fakeAsync(() => {
            component.dropdownTree.highlightedNode = component.nodes[0].children[0];
            component.selectedNode = component.nodes[2];

            fixture.detectChanges();
            tick();

            component.dropdownTree.expandedNodes = new Set<TreeNode>([
                component.nodes[0],
            ]);

            let event = new KeyboardEvent('keydown', {
                key: 'ArrowRight',
            });
            panel.dispatchEvent(event);

            fixture.detectChanges();
            tick();

            expect(component.dropdownTree.highlightedNode).toBe(component.nodes[0].children[0]);
        }));

        it('ArrowRight does not change selected node when current highlighted node has no children', fakeAsync(() => {
            component.dropdownTree.highlightedNode = component.nodes[0].children[0];
            component.selectedNode = component.nodes[2];

            fixture.detectChanges();
            tick();

            component.dropdownTree.expandedNodes = new Set<TreeNode>([
                component.nodes[0],
            ]);

            let event = new KeyboardEvent('keydown', {
                key: 'ArrowRight',
            });
            panel.dispatchEvent(event);

            fixture.detectChanges();
            tick();

            expect(component.selectedNode).toBe(component.nodes[2]);
        }));

        it('Home changes highlighted node to first visible node', fakeAsync(() => {
            component.dropdownTree.highlightedNode = component.nodes[0].children[1];
            component.selectedNode = component.nodes[2];

            fixture.detectChanges();
            tick();

            component.dropdownTree.expandedNodes = new Set<TreeNode>([
                component.nodes[0],
            ]);

            let event = new KeyboardEvent('keydown', {
                key: 'Home',
            });
            panel.dispatchEvent(event);

            fixture.detectChanges();
            tick();

            expect(component.dropdownTree.highlightedNode).toBe(component.dropdownTree.defaultNode);
        }));

        it('Home changes selected node to first visible node', fakeAsync(() => {
            component.dropdownTree.highlightedNode = component.nodes[0].children[1];
            component.selectedNode = component.nodes[2];

            fixture.detectChanges();
            tick();

            component.dropdownTree.expandedNodes = new Set<TreeNode>([
                component.nodes[0],
            ]);

            let event = new KeyboardEvent('keydown', {
                key: 'Home',
            });
            panel.dispatchEvent(event);

            fixture.detectChanges();
            tick();

            expect(component.selectedNode).toBeNull();
        }));

        it('Ctrl+Home changes highlighted node to first visible node', fakeAsync(() => {
            component.dropdownTree.highlightedNode = component.nodes[0].children[1];
            component.selectedNode = component.nodes[2];

            fixture.detectChanges();
            tick();

            component.dropdownTree.expandedNodes = new Set<TreeNode>([
                component.nodes[0],
            ]);

            let event = new KeyboardEvent('keydown', {
                ctrlKey: true,
                key: 'Home',
            });
            panel.dispatchEvent(event);

            fixture.detectChanges();
            tick();

            expect(component.dropdownTree.highlightedNode).toBe(component.dropdownTree.defaultNode);
        }));

        it('Ctrl+Home does not change selected node', fakeAsync(() => {
            component.dropdownTree.highlightedNode = component.nodes[0].children[1];
            component.selectedNode = component.nodes[2];

            fixture.detectChanges();
            tick();

            component.dropdownTree.expandedNodes = new Set<TreeNode>([
                component.nodes[0],
            ]);

            let event = new KeyboardEvent('keydown', {
                ctrlKey: true,
                key: 'Home',
            });
            panel.dispatchEvent(event);

            fixture.detectChanges();
            tick();

            expect(component.selectedNode).toBe(component.nodes[2]);
        }));

        it('End changes highlighted node to last visible node', fakeAsync(() => {
            component.dropdownTree.highlightedNode = component.nodes[0].children[1];
            component.selectedNode = component.nodes[0];

            fixture.detectChanges();
            tick();

            component.dropdownTree.expandedNodes = new Set<TreeNode>([
                component.nodes[0],
            ]);

            let event = new KeyboardEvent('keydown', {
                key: 'End',
            });
            panel.dispatchEvent(event);

            fixture.detectChanges();
            tick();

            expect(component.dropdownTree.highlightedNode).toBe(component.nodes[2]);
        }));

        it('End changes selected node to last visible node', fakeAsync(() => {
            component.dropdownTree.highlightedNode = component.nodes[0].children[1];
            component.selectedNode = component.nodes[0];

            fixture.detectChanges();
            tick();

            component.dropdownTree.expandedNodes = new Set<TreeNode>([
                component.nodes[0],
            ]);

            let event = new KeyboardEvent('keydown', {
                key: 'End',
            });
            panel.dispatchEvent(event);

            fixture.detectChanges();
            tick();

            expect(component.selectedNode).toBe(component.nodes[2]);
        }));

        it('Ctrl+End changes highlighted node to last visible node', fakeAsync(() => {
            component.dropdownTree.highlightedNode = component.nodes[0].children[1];
            component.selectedNode = component.nodes[0];

            fixture.detectChanges();
            tick();

            component.dropdownTree.expandedNodes = new Set<TreeNode>([
                component.nodes[0],
            ]);

            let event = new KeyboardEvent('keydown', {
                ctrlKey: true,
                key: 'End',
            });
            panel.dispatchEvent(event);

            fixture.detectChanges();
            tick();

            expect(component.dropdownTree.highlightedNode).toBe(component.nodes[2]);
        }));

        it('Ctrl+End does not change selected node', fakeAsync(() => {
            component.dropdownTree.highlightedNode = component.nodes[0].children[1];
            component.selectedNode = component.nodes[0];

            fixture.detectChanges();
            tick();

            component.dropdownTree.expandedNodes = new Set<TreeNode>([
                component.nodes[0],
            ]);

            let event = new KeyboardEvent('keydown', {
                ctrlKey: true,
                key: 'End',
            });
            panel.dispatchEvent(event);

            fixture.detectChanges();
            tick();

            expect(component.selectedNode).toBe(component.nodes[0]);
        }));

        it('Space changes selected node to current highlighted node', fakeAsync(() => {
            component.dropdownTree.highlightedNode = component.nodes[0].children[1];
            component.selectedNode = component.nodes[2];

            fixture.detectChanges();
            tick();

            component.dropdownTree.expandedNodes = new Set<TreeNode>([
                component.nodes[0],
            ]);

            let event = new KeyboardEvent('keydown', {
                key: ' ',
            });
            panel.dispatchEvent(event);

            fixture.detectChanges();
            tick();
            tick(1000);

            expect(component.selectedNode).toBe(component.nodes[0].children[1]);
        }));

        it('Ctrl+Space changes selected node to current highlighted node', fakeAsync(() => {
            component.dropdownTree.highlightedNode = component.nodes[0].children[1];
            component.selectedNode = component.nodes[2];

            fixture.detectChanges();
            tick();

            component.dropdownTree.expandedNodes = new Set<TreeNode>([
                component.nodes[0],
            ]);

            let event = new KeyboardEvent('keydown', {
                ctrlKey: true,
                key: ' ',
            });
            panel.dispatchEvent(event);

            fixture.detectChanges();
            tick();
            tick(1000);

            expect(component.selectedNode).toBe(component.nodes[0].children[1]);
        }));

        it('Enter changes selected node to current highlighted node', fakeAsync(() => {
            component.dropdownTree.highlightedNode = component.nodes[0].children[1];
            component.selectedNode = component.nodes[2];

            fixture.detectChanges();
            tick();

            component.dropdownTree.expandedNodes = new Set<TreeNode>([
                component.nodes[0],
            ]);

            let event = new KeyboardEvent('keydown', {
                key: 'Enter',
            });
            panel.dispatchEvent(event);

            fixture.detectChanges();
            tick();
            tick(1000);

            expect(component.selectedNode).toBe(component.nodes[0].children[1]);
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

            expect(component.dropdownTree.isPanelOpen).toBe(false);
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

            expect(component.dropdownTree.isPanelOpen).toBe(true);
        }));
    });

    describe('animations', () => {
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

        it('should initially put placeholder in the normal position', fakeAsync(() => {
            expect(component.dropdownTree.getPlaceholderAnimationState()).toBe('');
        }));

        it('should float the placeholder when the panel is open and unselected', fakeAsync(() => {
            trigger.click();

            fixture.detectChanges();
            tick();

            expect(component.dropdownTree.getPlaceholderAnimationState()).toBe('floating-ltr');
        }));

        it('should revert placeholder back to normal position after panel closes', fakeAsync(() => {
            trigger.click();

            fixture.detectChanges();
            tick();

            const backdrop = overlayContainerElement.querySelector('.cdk-overlay-backdrop') as HTMLElement;
            backdrop.click();

            fixture.detectChanges();
            tick();
            tick(1000);

            expect(component.dropdownTree.getPlaceholderAnimationState()).toBe('');
        }));

        it('should float the placeholder without animation when value is set', fakeAsync(() => {
            component.selectedNode = component.nodes[0];

            fixture.detectChanges();
            tick();

            const placeholder = fixture.debugElement.query(By.css('.cf-dropdown-tree-placeholder')).nativeElement as HTMLElement;
            expect(placeholder.classList).toContain('mat-floating-placeholder', 'Expected placeholder to display as floating.');
            expect(component.dropdownTree.getPlaceholderAnimationState()).toBe('', 'Expected animation state to be empty to avoid animation.');
        }));

        it('should use the floating-rtl state when the dir is rtl', fakeAsync(() => {
            dir.value = 'rtl';

            trigger.click();

            fixture.detectChanges();
            tick();

            expect(component.dropdownTree.getPlaceholderAnimationState()).toBe('floating-rtl');
        }));

        it('should not add class to the panel when the menu is still animating', fakeAsync(() => {
            trigger.click();

            fixture.detectChanges();
            tick();

            const panel = overlayContainerElement.querySelector('.cf-dropdown-tree-panel');

            expect(panel.classList).not.toContain('cf-dropdown-tree-panel-done-animating');
        }));

        it('should add a class to the panel when the menu is done animating', fakeAsync(() => {
            trigger.click();

            fixture.detectChanges();
            tick();

            const panel = overlayContainerElement.querySelector('.cf-dropdown-tree-panel');

            tick(250);
            fixture.detectChanges();

            expect(panel.classList).toContain('cf-dropdown-tree-panel-done-animating');
        }));
    });

    xdescribe('positioning', () => {
        let fixture: ComponentFixture<BasicModelComponent>;
        let component: BasicModelComponent;
        let trigger: HTMLElement;
        let dropdownTree: HTMLElement;
        let visibleNodes: TreeNode[];

        beforeEach(fakeAsync(() => {
            fixture = TestBed.createComponent(BasicModelComponent);
            component = fixture.componentInstance;

            component.defaultLabel = 'Any';

            fixture.detectChanges();
            tick();

            dropdownTree = fixture.debugElement.query(By.css('.cf-dropdown-tree')).nativeElement;
            trigger = fixture.debugElement.query(By.css('.cf-dropdown-tree-trigger')).nativeElement;
        }));

        describe('with ample space to open', () => {
            beforeEach(() => {
                dropdownTree.style.marginTop = '300px';
                dropdownTree.style.marginLeft = '20px';
                dropdownTree.style.marginRight = '20px';
            });

            it('should align the default node with the trigger text if value is null', fakeAsync(() => {
                expandNodesToShow8Items();

                trigger.click();

                fixture.detectChanges();
                tick();

                const scrollContainer = document.querySelector('.cdk-overlay-pane .cf-dropdown-tree-panel');

                expect(scrollContainer.scrollTop).toEqual(0, 'Expected panel not to be scrolled.');
                checkTriggerAlignedWithOption(0);
            }));

            it('should align a selected node too high to be centered with the trigger text', fakeAsync(() => {
                component.selectedNode = visibleNodes[1];

                fixture.detectChanges();
                tick();

                expandNodesToShow8Items();

                trigger.click();

                fixture.detectChanges();
                tick();

                const scrollContainer = document.querySelector('.cdk-overlay-pane .cf-dropdown-tree-panel');

                expect(scrollContainer.scrollTop).toEqual(0, 'Expected panel not to be scrolled.');
                checkTriggerAlignedWithOption(1);
            }));
        });

        function expandNodesToShow8Items(): void {
            component.dropdownTree.expandedNodes = new Set<TreeNode>([
                component.nodes[0],
                component.nodes[0].children[1],
            ]);

            visibleNodes = [
                null, // Default node
                component.nodes[0],
                component.nodes[0].children[0],
                component.nodes[0].children[1],
                component.nodes[0].children[1].children[0],
                component.nodes[0].children[1].children[1],
                component.nodes[0].children[2],
                component.nodes[1],
                component.nodes[2],
            ];
        }

        function checkTriggerAlignedWithOption(index: number): void {
            const overlayPane = overlayContainerElement.querySelector('.cdk-overlay-pane');
            const triggerTop = trigger.getBoundingClientRect().top;
            const overlayTop = overlayPane.getBoundingClientRect().top;
            const nodes = overlayPane.querySelectorAll('.cf-dropdown-tree-node');
            const nodeTop = nodes[index].getBoundingClientRect().top;

            expect(nodeTop.toFixed(2)).toEqual((triggerTop - 9).toFixed(2), `Expected trigger to align with node ${index}.`);

            const expectedOrigin = nodeTop - overlayTop + 24;
            expect(component.dropdownTree.transformOrigin).toContain(`${expectedOrigin}px`, `Expected panel animation to originate in the center of option ${index}.`);
        }
    });

    describe('accessibility', () => {
        describe('for dropdown tree', () => {
            let fixture: ComponentFixture<BasicModelComponent>;
            let component: BasicModelComponent;
            let dropdownTree: HTMLElement;

            beforeEach(() => {
                fixture = TestBed.createComponent(BasicModelComponent);
                component = fixture.componentInstance;

                fixture.detectChanges();

                dropdownTree = fixture.debugElement.query(By.css('.cf-dropdown-tree')).nativeElement;
            });

            it('should set the role of the select to combobox', () => {
                expect(dropdownTree.getAttribute('role')).toEqual('combobox');
            });

            it('should set the aria label to the placeholder', () => {
                expect(dropdownTree.getAttribute('aria-label')).toEqual('Basic Model');
            });

            it('should set the tabindex of the select to 0 by default', () => {
                expect(dropdownTree.getAttribute('tabindex')).toEqual('0');
            });

            it('should be able to override the tabindex', () => {
                component.tabIndexOverride = 3;
                fixture.detectChanges();

                expect(dropdownTree.getAttribute('tabindex')).toEqual('3');
            });

            it('should be able to set the tabindex via the native attribute', () => {
                fixture.destroy();

                const plainTabindexFixture = TestBed.createComponent(PlainTabindexComponent);
                plainTabindexFixture.detectChanges();

                dropdownTree = plainTabindexFixture.debugElement.query(By.css('.cf-dropdown-tree')).nativeElement;

                expect(dropdownTree.getAttribute('tabindex')).toEqual('5');
            });

            it('should not set aria-required for non-required dropdown trees', () => {
                expect(dropdownTree.getAttribute('aria-required')).toEqual('false');
            });

            it('should set aria-required for required dropdown trees', () => {
                component.required = true;
                fixture.detectChanges();

                expect(dropdownTree.getAttribute('aria-required')).toEqual('true');
            });

            it('should not set aria-invalid for valid dropdown trees', () => {
                expect(dropdownTree.getAttribute('aria-invalid')).toEqual('false');
            });

            it('should set aria-invalid for invalid dropdown trees', () => {
                component.required = true;
                fixture.detectChanges();

                expect(dropdownTree.getAttribute('aria-invalid')).toEqual('true');
            });

            it('should not set aria-disabled for enabled dropdown trees', () => {
                expect(dropdownTree.getAttribute('aria-disabled')).toEqual('false');
            });

            it('should set aria-disabled for disabled dropdown trees', () => {
                component.disabled = true;
                fixture.detectChanges();

                expect(dropdownTree.getAttribute('aria-disabled')).toEqual('true');
            });

            it('should set the tabindex of the dropdown tree to -1 if disabled', () => {
                component.disabled = true;
                fixture.detectChanges();

                expect(dropdownTree.getAttribute('tabindex')).toEqual('-1');
            });

            it('should set the tabindex of the dropdown tree to 0 if reenabled', () => {
                component.disabled = true;
                fixture.detectChanges();

                component.disabled = false;
                fixture.detectChanges();

                expect(dropdownTree.getAttribute('tabindex')).toEqual('0');
            });
        });
    });
});

@Component({
    template: `
<cf-dropdown-tree-field
    placeholder="Basic Model"
    [(ngModel)]="selectedNode"
    [defaultLabel]="defaultLabel"
    [disabled]="disabled"
    [nodes]="nodes"
    [required]="required"
    [showFullSelectedPath]="showFullSelectedPath"
    [tabIndex]="tabIndexOverride"
    (opened)="opened()"
    (closed)="closed()">
</cf-dropdown-tree-field>`,
})
class BasicModelComponent {
    defaultLabel: string = null;
    disabled: boolean = false;
    nodes: TreeNode[] = createNodeTree();
    required: boolean = false;
    selectedNode: TreeNode = null;
    showFullSelectedPath: boolean = false;
    tabIndexOverride: number;

    @ViewChild(DropdownTreeFieldComponent) dropdownTree: DropdownTreeFieldComponent;

    opened: jasmine.Spy = jasmine.createSpy('opened');
    closed: jasmine.Spy = jasmine.createSpy('closed');
}

@Component({
    template: `
<cf-dropdown-tree-field
    placeholder="Basic Model"
    [(ngModel)]="selectedNode"
    [nodes]="nodes"
    tabindex="5">
</cf-dropdown-tree-field>`,
})
class PlainTabindexComponent {
    nodes: TreeNode[] = createNodeTree();
    selectedNode: TreeNode = null;
}

class FakeViewportRuler {
    getViewportRect(): ClientRect {
        return {
            left: 0,
            top: 0,
            width: 1014,
            height: 686,
            bottom: 686,
            right: 1014,
        };
    }

    getViewportScrollPosition(): { top: number, left: number } {
        return { top: 0, left: 0 };
    }
}

function createNode(...children: TreeNode[]): TreeNode {
    let id = currentId++;

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
