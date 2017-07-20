import {
        AfterViewInit,
        Component,
        DebugElement,
        OnDestroy,
        OnInit,
        ViewChild ,
}                                       from '@angular/core';
import { ComponentFixture, TestBed }    from '@angular/core/testing';
import { By }                           from '@angular/platform-browser';

import {
    ToolbarTemplatePortalDirective,
}                                       from './toolbar-template-portal.directive';
import { ToolbarModule }                from './toolbar.module';
import { ToolbarService }               from './toolbar.service';

// Test component to host a toolbar with a global element and instantiates
// the TestPageComponent
@Component({
  template: `<cf-toolbar><span id="global" class="test">global</span></cf-toolbar><cf-page-test></cf-page-test>`,
})
class TestHostComponent { }

// Test component that simulates a page adding content to a toolbar
@Component({
  template: `
  <ng-template cfToolbarPortal #toolbarPortal="toolbarPortal">
    <span id="page" class="test">page</span>
  </ng-template>`,
  selector: 'cf-page-test',
})
class TestPageComponent implements OnInit, AfterViewInit, OnDestroy {

    @ViewChild('toolbarPortal') toolbarPortal: ToolbarTemplatePortalDirective;

    constructor(private _toolbarService: ToolbarService) {}

    ngOnInit(): void {
        this._toolbarService.setPortal(this.toolbarPortal);
        this._toolbarService.setTitle('Tabs');
    }

    ngAfterViewInit(): void {
        if(this.toolbarPortal) {
            this.toolbarPortal.detectChangesInView();
        }
    }

    ngOnDestroy(): void {
        this._toolbarService.setPortal(null);
    }
}

describe('ToolbarComponent', () => {

  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
        imports: [ToolbarModule ],
        declarations: [ TestHostComponent, TestPageComponent], // declare the test components
    });
    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });

  it('should show global buttons then page buttons', () => {
    let toolbarService: ToolbarService = TestBed.get(ToolbarService);
    toolbarService.setGlobalButtonAlign('left');
    fixture.detectChanges();
    let de: DebugElement[] = fixture.debugElement.queryAll(By.css('.test'));
    expect(de.length).toBe(2);
    expect(de[0].nativeElement.id).toBe('global');
    expect(de[1].nativeElement.id).toBe('page');
  });

  it('should show page buttons then global buttons', () => {
    let toolbarService: ToolbarService = TestBed.get(ToolbarService);
    toolbarService.setGlobalButtonAlign('right');
    fixture.detectChanges();
    let de: DebugElement[] = fixture.debugElement.queryAll(By.css('.test'));
    expect(de.length).toBe(2);
    expect(de[0].nativeElement.id).toBe('page');
    expect(de[1].nativeElement.id).toBe('global');
  });
});
