import { CommonModule }             from '@angular/common';
import {
    Component
}                                   from '@angular/core';
import {
    ComponentFixture,
    TestBed
}                                   from '@angular/core/testing';
import { By }                       from '@angular/platform-browser';

import { ToggleButtonDirective }    from './toggle-button.directive';

describe('ToggleButtonDirective', () => {
    let fixture: ComponentFixture<TestActiveComponent>;
    let component: TestActiveComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [CommonModule],
            declarations: [ToggleButtonDirective, TestActiveComponent]
        });

        fixture = TestBed.createComponent(TestActiveComponent);
        component = fixture.componentInstance;

        fixture.detectChanges();
    });

    it('adds active class when initially active', () => {
        let buttonInitiallyActive = fixture.debugElement.queryAll(By.directive(ToggleButtonDirective))[0];

        expect(buttonInitiallyActive.classes['active']).toBe(true);
    });

    it('sets aria-pressed to true when initially active', () => {
        let buttonInitiallyActive = fixture.debugElement.queryAll(By.directive(ToggleButtonDirective))[0];

        expect(buttonInitiallyActive.attributes['aria-pressed']).toBe('true');
    });

    it('removes active class when changed to inactive', () => {
        let buttonInitiallyActive = fixture.debugElement.queryAll(By.directive(ToggleButtonDirective))[0];

        component.active = false;
        fixture.detectChanges();

        expect(buttonInitiallyActive.classes['active']).not.toBe(true);
    });

    it('removes aria-pressed attribute when changed to inactive', () => {
        let buttonInitiallyActive = fixture.debugElement.queryAll(By.directive(ToggleButtonDirective))[0];

        component.active = false;
        fixture.detectChanges();

        expect(buttonInitiallyActive.attributes['aria-pressed']).toBeNull();
    });

    it('changes to inactive when active and clicked', () => {
        let buttonInitiallyActive = fixture.debugElement.queryAll(By.directive(ToggleButtonDirective))[0];

        buttonInitiallyActive.triggerEventHandler('click', {});
        fixture.detectChanges();

        expect(buttonInitiallyActive.classes['active']).not.toBe(true);
    });

    it('emits change event when active and clicked', () => {
        let buttonInitiallyActive = fixture.debugElement.queryAll(By.directive(ToggleButtonDirective))[0];
        let spy = spyOn(component, 'onInitiallyActiveChange');

        buttonInitiallyActive.triggerEventHandler('click', {});

        expect(spy).toHaveBeenCalledWith(false);
    });

    it('does not add active class when initially inactive', () => {
        let buttonInitiallyInactive = fixture.debugElement.queryAll(By.directive(ToggleButtonDirective))[1];

        expect(buttonInitiallyInactive.classes['active']).not.toBe(true);
    });

    it('does not add aria-pressed attribute when initially inactive', () => {
        let buttonInitiallyInactive = fixture.debugElement.queryAll(By.directive(ToggleButtonDirective))[1];

        expect(buttonInitiallyInactive.attributes['aria-pressed']).toBeNull();
    });

    it('adds active class when changed to active', () => {
        let buttonInitiallyInactive = fixture.debugElement.queryAll(By.directive(ToggleButtonDirective))[1];

        component.inactive = true;
        fixture.detectChanges();

        expect(buttonInitiallyInactive.classes['active']).toBe(true);
    });

    it('sets aria-pressed attribute to true when changed to active', () => {
        let buttonInitiallyInactive = fixture.debugElement.queryAll(By.directive(ToggleButtonDirective))[1];

        component.inactive = true;
        fixture.detectChanges();

        expect(buttonInitiallyInactive.attributes['aria-pressed']).toBe('true');
    });

    it('changes to active when inactive and clicked', () => {
        let buttonInitiallyInactive = fixture.debugElement.queryAll(By.directive(ToggleButtonDirective))[1];

        buttonInitiallyInactive.triggerEventHandler('click', {});
        fixture.detectChanges();

        expect(buttonInitiallyInactive.classes['active']).toBe(true);
    });

    it('emits change event when inactive and clicked', () => {
        let buttonInitiallyInactive = fixture.debugElement.queryAll(By.directive(ToggleButtonDirective))[1];
        let spy = spyOn(component, 'onInitiallyInactiveChange');

        buttonInitiallyInactive.triggerEventHandler('click', {});

        expect(spy).toHaveBeenCalledWith(true);
    });
});

@Component({
    template: `
        <button [cfToggleButton]='active' (change)='onInitiallyActiveChange($event)'>Active</button>
        <button [cfToggleButton]='inactive' (change)='onInitiallyInactiveChange($event)'>Inactive</button>
`
})
class TestActiveComponent {
    active: boolean = true;
    inactive: boolean = false;

    onInitiallyActiveChange(newValue: boolean) {
    }

    onInitiallyInactiveChange(newValue: boolean) {
    }
}
