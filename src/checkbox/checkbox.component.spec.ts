import {
    Component,
    DebugElement,
}                       from '@angular/core';
import {
    ComponentFixture,
    TestBed,
    async,
    fakeAsync,
    flushMicrotasks,
}                       from '@angular/core/testing';
import {
    FormsModule,
    NgControl,
}                       from '@angular/forms';
import { By }           from '@angular/platform-browser';

import {
    CheckboxChange,
    CheckboxComponent,
    CheckboxModule,
}                       from '../checkbox';

describe('CheckboxComponent', () => {
    let fixture: ComponentFixture<any>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [FormsModule, CheckboxModule.forRoot()],
            declarations: [
                SingleCheckbox,
                CheckboxWithFormDirectives,
                MultipleCheckboxes,
                CheckboxWithTabIndex,
                CheckboxWithAriaLabel,
                CheckboxWithAriaLabelledby,
                CheckboxWithNameAttribute,
                CheckboxWithChangeEvent,
            ],
        });

        TestBed.compileComponents();
    }));

    describe('basic behaviors', () => {
        let checkboxDebugElement: DebugElement;
        let checkboxNativeElement: HTMLElement;
        let checkboxInstance: CheckboxComponent;
        let testComponent: SingleCheckbox;
        let inputElement: HTMLInputElement;
        let labelElement: HTMLLabelElement;

        beforeEach(() => {
            fixture = TestBed.createComponent(SingleCheckbox);
            fixture.detectChanges();

            checkboxDebugElement = fixture.debugElement.query(By.directive(CheckboxComponent));
            checkboxNativeElement = checkboxDebugElement.nativeElement;
            checkboxInstance = checkboxDebugElement.componentInstance;
            testComponent = fixture.debugElement.componentInstance;
            inputElement = <HTMLInputElement>checkboxNativeElement.querySelector('input');
            labelElement = <HTMLLabelElement>checkboxNativeElement.querySelector('label');
        });

        it('should add and remove the checked state', () => {
            expect(checkboxInstance.checked).toBe(false);
            // expect(checkboxNativeElement.classList).not.toContain('is-checked');
            expect(inputElement.checked).toBe(false);

            testComponent.isChecked = true;
            fixture.detectChanges();

            expect(checkboxInstance.checked).toBe(true);
            // expect(checkboxNativeElement.classList).toContain('is-checked');
            expect(inputElement.checked).toBe(true);

            testComponent.isChecked = false;
            fixture.detectChanges();

            expect(checkboxInstance.checked).toBe(false);
            // expect(checkboxNativeElement.classList).not.toContain('is-checked');
            expect(inputElement.checked).toBe(false);
        });

        it('should add and remove indeterminate state', () => {
            // expect(checkboxNativeElement.classList).not.toContain('is-checked');
            expect(inputElement.checked).toBe(false);
            expect(inputElement.indeterminate).toBe(false);

            testComponent.isIndeterminate = true;
            fixture.detectChanges();

            // expect(checkboxNativeElement.classList).toContain('md-checkbox-indeterminate');
            expect(inputElement.checked).toBe(false);
            expect(inputElement.indeterminate).toBe(true);

            testComponent.isIndeterminate = false;
            fixture.detectChanges();

            // expect(checkboxNativeElement.classList).not.toContain('md-checkbox-indeterminate');
            expect(inputElement.checked).toBe(false);
            expect(inputElement.indeterminate).toBe(false);
        });

        it('should toggle checked state on click', () => {
            expect(checkboxInstance.checked).toBe(false);

            labelElement.click();
            fixture.detectChanges();

            expect(checkboxInstance.checked).toBe(true);

            labelElement.click();
            fixture.detectChanges();

            expect(checkboxInstance.checked).toBe(false);
        });

        it('should change from indeterminate to checked on click', () => {
            testComponent.isChecked = false;
            testComponent.isIndeterminate = true;
            fixture.detectChanges();

            expect(checkboxInstance.checked).toBe(false);
            expect(checkboxInstance.indeterminate).toBe(true);

            checkboxInstance.onInputChange(<Event>{stopPropagation: () => {}});

            expect(checkboxInstance.checked).toBe(true);
            expect(checkboxInstance.indeterminate).toBe(false);

            checkboxInstance.onInputChange(<Event>{stopPropagation: () => {}});
            fixture.detectChanges();

            expect(checkboxInstance.checked).toBe(false);
            expect(checkboxInstance.indeterminate).toBe(false);
        });

        it('should add and remove disabled state', () => {
            expect(checkboxInstance.disabled).toBe(false);
            // expect(checkboxNativeElement.classList).not.toContain('is-disabled');
            expect(inputElement.tabIndex).toBe(0);
            expect(inputElement.disabled).toBe(false);

            testComponent.isDisabled = true;
            fixture.detectChanges();

            expect(checkboxInstance.disabled).toBe(true);
            // expect(checkboxNativeElement.classList).toContain('is-disabled');
            expect(inputElement.disabled).toBe(true);

            testComponent.isDisabled = false;
            fixture.detectChanges();

            expect(checkboxInstance.disabled).toBe(false);
            // expect(checkboxNativeElement.classList).not.toContain('is-disabled');
            expect(inputElement.tabIndex).toBe(0);
            expect(inputElement.disabled).toBe(false);
        });

        it('should not toggle `checked` state upon interation while disabled', () => {
            testComponent.isDisabled = true;
            fixture.detectChanges();

            checkboxNativeElement.click();
            expect(checkboxInstance.checked).toBe(false);
        });

        it('should overwrite indeterminate state when checked is re-set', () => {
            testComponent.isIndeterminate = true;
            fixture.detectChanges();

            testComponent.isChecked = true;
            fixture.detectChanges();

            expect(checkboxInstance.checked).toBe(true);
            expect(checkboxInstance.indeterminate).toBe(false);
        });

        it('should preserve the user-provided id', () => {
            expect(checkboxNativeElement.id).toBe('simple-check');
        });

        it('should project the checkbox content into the label element', () => {
            let label = <HTMLLabelElement>checkboxNativeElement.querySelector('.mdl-checkbox__label');
            expect(label.textContent.trim()).toBe('Simple checkbox');
        });

        it('should make the host element a tab stop', () => {
            expect(inputElement.tabIndex).toBe(0);
        });

        it('should not trigger the click event multiple times', () => {
            // By default, when clicking on a label element, a generated click will be dispatched
            // on the associated input element.
            // Since we're using a label element and a visual hidden input, this behavior can led
            // to an issue, where the click events on the checkbox are getting executed twice.

            spyOn(testComponent, 'onCheckboxClick');

            expect(inputElement.checked).toBe(false);
            // expect(checkboxNativeElement.classList).not.toContain('is-checked');

            labelElement.click();
            fixture.detectChanges();

            // expect(checkboxNativeElement.classList).toContain('is-checked');
            expect(inputElement.checked).toBe(true);

            expect(testComponent.onCheckboxClick).toHaveBeenCalledTimes(1);
        });

        it('should trigger a change event when the native input does', async(() => {
            spyOn(testComponent, 'onCheckboxChange');

            expect(inputElement.checked).toBe(false);
            // expect(checkboxNativeElement.classList).not.toContain('is-checked');

            labelElement.click();
            fixture.detectChanges();

            expect(inputElement.checked).toBe(true);
            // expect(checkboxNativeElement.classList).toContain('is-checked');

            // Wait for the fixture to become stable, because the EventEmitter for the change event,
            // will only fire after the zone async change detection has finished.
            fixture.whenStable().then(() => {
                // The change event shouldn't fire, because the value change was not caused
                // by any interaction.
                expect(testComponent.onCheckboxChange).toHaveBeenCalledTimes(1);
            });
        }));

        it('should not trigger the change event by changing the native value', async(() => {
            spyOn(testComponent, 'onCheckboxChange');

            expect(inputElement.checked).toBe(false);
            // expect(checkboxNativeElement.classList).not.toContain('is-checked');

            testComponent.isChecked = true;
            fixture.detectChanges();

            expect(inputElement.checked).toBe(true);
            // expect(checkboxNativeElement.classList).toContain('is-checked');

            // Wait for the fixture to become stable, because the EventEmitter for the change event,
            // will only fire after the zone async change detection has finished.
            fixture.whenStable().then(() => {
                // The change event shouldn't fire, because the value change was not caused
                // by any interaction.
                expect(testComponent.onCheckboxChange).not.toHaveBeenCalled();
            });

        }));

        it('should forward the required attribute', () => {
            testComponent.isRequired = true;
            fixture.detectChanges();

            expect(inputElement.required).toBe(true);

            testComponent.isRequired = false;
            fixture.detectChanges();

            expect(inputElement.required).toBe(false);
        });
    });

    describe('with change event and no initial value', () => {
        let checkboxDebugElement: DebugElement;
        let checkboxNativeElement: HTMLElement;
        let checkboxInstance: CheckboxComponent;
        let testComponent: CheckboxWithChangeEvent;
        let inputElement: HTMLInputElement;
        let labelElement: HTMLLabelElement;

        beforeEach(() => {
            fixture = TestBed.createComponent(CheckboxWithChangeEvent);
            fixture.detectChanges();

            checkboxDebugElement = fixture.debugElement.query(By.directive(CheckboxComponent));
            checkboxNativeElement = checkboxDebugElement.nativeElement;
            checkboxInstance = checkboxDebugElement.componentInstance;
            testComponent = fixture.debugElement.componentInstance;
            inputElement = <HTMLInputElement>checkboxNativeElement.querySelector('input');
            labelElement = <HTMLLabelElement>checkboxNativeElement.querySelector('label');
        });

        it('should emit the event to the change observable', () => {
            let changeSpy = jasmine.createSpy('onChangeObservable');

            checkboxInstance.change.subscribe(changeSpy);

            fixture.detectChanges();
            expect(changeSpy).not.toHaveBeenCalled();

            // When changing the native `checked` property the checkbox will not fire a change event,
            // because the element is not focused and it's not the native behavior of the input element.
            labelElement.click();
            fixture.detectChanges();

            expect(changeSpy).toHaveBeenCalledTimes(1);
        });

        it('should not emit a DOM event to the change output', async(() => {
            fixture.detectChanges();
            expect(testComponent.lastEvent).toBeUndefined();

            // Trigger the click on the inputElement, because the input will probably
            // emit a DOM event to the change output.
            inputElement.click();
            fixture.detectChanges();

            fixture.whenStable().then(() => {
                // We're checking the arguments type / emitted value to be a boolean, because sometimes the
                // emitted value can be a DOM Event, which is not valid.
                // See angular/angular#4059
                expect(testComponent.lastEvent.checked).toBe(true);
            });

        }));
    });

    describe('with provided aria-label ', () => {
        let checkboxDebugElement: DebugElement;
        let checkboxNativeElement: HTMLElement;
        let inputElement: HTMLInputElement;

        it('should use the provided aria-label', () => {
            fixture = TestBed.createComponent(CheckboxWithAriaLabel);
            checkboxDebugElement = fixture.debugElement.query(By.directive(CheckboxComponent));
            checkboxNativeElement = checkboxDebugElement.nativeElement;
            inputElement = <HTMLInputElement>checkboxNativeElement.querySelector('input');

            fixture.detectChanges();
            expect(inputElement.getAttribute('aria-label')).toBe('Super effective');
        });
    });

    describe('with provided aria-labelledby ', () => {
        let checkboxDebugElement: DebugElement;
        let checkboxNativeElement: HTMLElement;
        let inputElement: HTMLInputElement;

        it('should use the provided aria-labelledby', () => {
            fixture = TestBed.createComponent(CheckboxWithAriaLabelledby);
            checkboxDebugElement = fixture.debugElement.query(By.directive(CheckboxComponent));
            checkboxNativeElement = checkboxDebugElement.nativeElement;
            inputElement = <HTMLInputElement>checkboxNativeElement.querySelector('input');

            fixture.detectChanges();
            expect(inputElement.getAttribute('aria-labelledby')).toBe('some-id');
            });

        it('should not assign aria-labelledby if none is provided', () => {
            fixture = TestBed.createComponent(SingleCheckbox);
            checkboxDebugElement = fixture.debugElement.query(By.directive(CheckboxComponent));
            checkboxNativeElement = checkboxDebugElement.nativeElement;
            inputElement = <HTMLInputElement>checkboxNativeElement.querySelector('input');

            fixture.detectChanges();
            expect(inputElement.getAttribute('aria-labelledby')).toBe(null);
        });
    });

    describe('with provided tabIndex', () => {
        let checkboxDebugElement: DebugElement;
        let checkboxNativeElement: HTMLElement;
        let testComponent: CheckboxWithTabIndex;
        let inputElement: HTMLInputElement;
        let labelElement: HTMLLabelElement;

        beforeEach(() => {
            fixture = TestBed.createComponent(CheckboxWithTabIndex);
            fixture.detectChanges();

            testComponent = fixture.debugElement.componentInstance;
            checkboxDebugElement = fixture.debugElement.query(By.directive(CheckboxComponent));
            checkboxNativeElement = checkboxDebugElement.nativeElement;
            inputElement = <HTMLInputElement>checkboxNativeElement.querySelector('input');
            labelElement = <HTMLLabelElement>checkboxNativeElement.querySelector('label');
        });

        it('should preserve any given tabIndex', () => {
            expect(inputElement.tabIndex).toBe(7);
        });

        it('should preserve given tabIndex when the checkbox is disabled then enabled', () => {
            testComponent.isDisabled = true;
            fixture.detectChanges();

            testComponent.customTabIndex = 13;
            fixture.detectChanges();

            testComponent.isDisabled = false;
            fixture.detectChanges();

            expect(inputElement.tabIndex).toBe(13);
        });
    });

    describe('with multiple checkboxes', () => {
        beforeEach(() => {
            fixture = TestBed.createComponent(MultipleCheckboxes);
            fixture.detectChanges();
        });

        it('should assign a unique id to each checkbox', () => {
            let [firstId, secondId] =
              fixture.debugElement.queryAll(By.directive(CheckboxComponent))
              .map(debugElement => debugElement.nativeElement.querySelector('input').id);

            expect(firstId).toBeTruthy();
            expect(secondId).toBeTruthy();
            expect(firstId).not.toEqual(secondId);
        });
    });

    describe('with ngModel', () => {
        beforeEach(() => {
            fixture = TestBed.createComponent(CheckboxWithFormDirectives);
            fixture.detectChanges();
        });

        it('should be in pristine, untouched, and valid states initially', fakeAsync(() => {
            flushMicrotasks();

            let checkboxElement = fixture.debugElement.query(By.directive(CheckboxComponent));
            let ngControl = <NgControl> checkboxElement.injector.get(NgControl);

            expect(ngControl.valid).toBe(true);
            expect(ngControl.pristine).toBe(true);
            expect(ngControl.touched).toBe(false);

            // TODO(jelbourn): test that `touched` and `pristine` state are modified appropriately.
            // This is currently blocked on issues with async() and fakeAsync().
        }));
    });

    describe('with name attribute', () => {
        beforeEach(() => {
            fixture = TestBed.createComponent(CheckboxWithNameAttribute);
            fixture.detectChanges();
        });

        it('should forward name value to input element', () => {
            let checkboxElement = fixture.debugElement.query(By.directive(CheckboxComponent));
            let inputElement = <HTMLInputElement> checkboxElement.nativeElement.querySelector('input');

            expect(inputElement.getAttribute('name')).toBe('test-name');
        });
    });
});

/** Simple component for testing a single checkbox. */
@Component({
    template: `
    <div (click)="parentElementClicked = true" (keyup)="parentElementKeyedUp = true">
        <cf-checkbox
            id="simple-check"
            [required]="isRequired"
            [checked]="isChecked" 
            [indeterminate]="isIndeterminate" 
            [disabled]="isDisabled"
            (change)="changeCount = changeCount + 1"
            (click)="onCheckboxClick($event)"
            (change)="onCheckboxChange($event)">
          Simple checkbox
        </cf-checkbox>
    </div>`,
})
/* tslint:disable:component-class-suffix */
class SingleCheckbox {
    alignment: string = 'start';
    isChecked: boolean = false;
    isRequired: boolean = false;
    isIndeterminate: boolean = false;
    isDisabled: boolean = false;
    parentElementClicked: boolean = false;
    parentElementKeyedUp: boolean = false;
    lastKeydownEvent: Event = null;
    changeCount: number = 0;

    onCheckboxClick(event: Event): void {}
    onCheckboxChange(event: CheckboxChange): void {}
}

/** Simple component for testing an CheckboxComponent with ngModel. */
@Component({
    template: `
        <form>
            <cf-checkbox name="cb" [(ngModel)]="isGood">Be good</cf-checkbox>
        </form>
    `,
})
/* tslint:disable:component-class-suffix */
class CheckboxWithFormDirectives {
/* tslint:enable */
    isGood: boolean = false;
}

/** Simple test component with multiple checkboxes. */
@Component(({
    template: `
        <cf-checkbox>Option 1</cf-checkbox>
        <cf-checkbox>Option 2</cf-checkbox>
    `,
}))
/* tslint:disable:component-class-suffix */
class MultipleCheckboxes {}
/* tslint:enable */

/** Simple test component with tabIndex */
@Component({
    template: `
        <cf-checkbox [tabindex]="customTabIndex" [disabled]="isDisabled">
        </cf-checkbox>`,
})
/* tslint:disable:component-class-suffix */
class CheckboxWithTabIndex {
/* tslint:enable */
    customTabIndex: number = 7;
    isDisabled: boolean = false;
}

/** Simple test component with an aria-label set. */
@Component({
    template: `<cf-checkbox aria-label="Super effective"></cf-checkbox>`,
})
/* tslint:disable:component-class-suffix */
class CheckboxWithAriaLabel {}
/* tslint:enable */

/** Simple test component with an aria-label set. */
@Component({
    template: `<cf-checkbox aria-labelledby="some-id"></cf-checkbox>`,
})
/* tslint:disable:component-class-suffix */
class CheckboxWithAriaLabelledby {}
/* tslint:enable */

/** Simple test component with name attribute */
@Component({
    template: `<cf-checkbox name="test-name"></cf-checkbox>`,
})
/* tslint:disable:component-class-suffix */
class CheckboxWithNameAttribute {}
/* tslint:enable */

/** Simple test component with change event */
@Component({
    template: `<cf-checkbox (change)="lastEvent = $event"></cf-checkbox>`,
})
/* tslint:disable:component-class-suffix */
class CheckboxWithChangeEvent {
/* tslint:enable */
  lastEvent: CheckboxChange;
}
