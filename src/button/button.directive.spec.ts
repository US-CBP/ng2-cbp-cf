import { CommonModule }             from '@angular/common';
import { Component }                from '@angular/core';
import {
    ComponentFixture,
    TestBed
}                                   from '@angular/core/testing';
import { By }                       from '@angular/platform-browser';

import {
    ButtonRole,
    ButtonRoles
}                                   from './button-roles.model';
import {
    ButtonSize,
    ButtonSizes
}                                   from './button-sizes.model';
import { ButtonDirective }          from './button.directive';
import { ButtonModule }             from './button.module';

describe('ButtonDirective', () => {
    describe('role', () => {
        let fixture: ComponentFixture<TestRoleComponent>;
        let component: TestRoleComponent;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [CommonModule, ButtonModule.forRoot()],
                declarations: [TestRoleComponent]
            });

            fixture = TestBed.createComponent(TestRoleComponent);
            fixture.detectChanges();

            component = fixture.componentInstance;
        });

        it('adds default class when not provided', () => {
            let buttonWithDefaultRole = fixture.debugElement.queryAll(By.directive(ButtonDirective))[0];

            expect(buttonWithDefaultRole.classes['btn-default']).toBe(true);
        });

        it('adds class for specified value', () => {
            let button = fixture.debugElement.queryAll(By.directive(ButtonDirective))[1];

            expect(button.classes['btn-danger']).toBe(true);
        });

        it('adds class for new value when changed', () => {
            let button = fixture.debugElement.queryAll(By.directive(ButtonDirective))[1];

            component.role = ButtonRoles.success;
            fixture.detectChanges();

            expect(button.classes['btn-success']).toBe(true);
        });

        it('removes class for old value when changed', () => {
            let button = fixture.debugElement.queryAll(By.directive(ButtonDirective))[1];

            component.role = ButtonRoles.success;
            fixture.detectChanges();

            expect(button.classes['btn-danger']).not.toBe(true);
        });

        it('adds default class when changed to null', () => {
            let button = fixture.debugElement.queryAll(By.directive(ButtonDirective))[1];

            component.role = null;
            fixture.detectChanges();

            expect(button.classes['btn-default']).toBe(true);
        });
    });

    describe('size', () => {
        let fixture: ComponentFixture<TestSizeComponent>;
        let component: TestSizeComponent;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [CommonModule, ButtonModule.forRoot()],
                declarations: [TestSizeComponent]
            });

            fixture = TestBed.createComponent(TestSizeComponent);
            fixture.detectChanges();

            component = fixture.componentInstance;
        });

        it('adds no class when not provided', () => {
            let buttonWithDefaultSize = fixture.debugElement.queryAll(By.directive(ButtonDirective))[0];

            expect(buttonWithDefaultSize.classes['btn-lg']).not.toBe(true);
            expect(buttonWithDefaultSize.classes['btn-sm']).not.toBe(true);
            expect(buttonWithDefaultSize.classes['btn-xs']).not.toBe(true);
        });

        it('adds class for specified value', () => {
            let button = fixture.debugElement.queryAll(By.directive(ButtonDirective))[1];

            expect(button.classes['btn-lg']).toBe(true);
        });

        it('adds class for new value when changed', () => {
            let button = fixture.debugElement.queryAll(By.directive(ButtonDirective))[1];

            component.size = ButtonSizes.small;
            fixture.detectChanges();

            expect(button.classes['btn-sm']).toBe(true);
        });

        it('removes class for old value when changed', () => {
            let button = fixture.debugElement.queryAll(By.directive(ButtonDirective))[1];

            component.size = ButtonSizes.small;
            fixture.detectChanges();

            expect(button.classes['btn-lg']).not.toBe(true);
        });

        it('adds no class when changed to null', () => {
            let button = fixture.debugElement.queryAll(By.directive(ButtonDirective))[1];

            component.size = null;
            fixture.detectChanges();

            expect(button.classes['btn-lg']).not.toBe(true);
            expect(button.classes['btn-sm']).not.toBe(true);
            expect(button.classes['btn-xs']).not.toBe(true);
        });
    });

    describe('block', () => {
        let fixture: ComponentFixture<TestBlockComponent>;
        let component: TestBlockComponent;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [CommonModule, ButtonModule.forRoot()],
                declarations: [TestBlockComponent]
            });

            fixture = TestBed.createComponent(TestBlockComponent);
            fixture.detectChanges();

            component = fixture.componentInstance;
        });

        it('adds no class when not provided', () => {
            let buttonWithDefaultSize = fixture.debugElement.queryAll(By.directive(ButtonDirective))[0];

            expect(buttonWithDefaultSize.classes['btn-block']).not.toBe(true);
        });

        it('adds class for specified value', () => {
            let button = fixture.debugElement.queryAll(By.directive(ButtonDirective))[1];

            expect(button.classes['btn-block']).toBe(true);
        });

        it('removes class when changed to false', () => {
            let button = fixture.debugElement.queryAll(By.directive(ButtonDirective))[1];

            component.block = false;
            fixture.detectChanges();

            expect(button.classes['btn-block']).not.toBe(true);
        });

        it('removes class when changed to null', () => {
            let button = fixture.debugElement.queryAll(By.directive(ButtonDirective))[1];

            component.block = null;
            fixture.detectChanges();

            expect(button.classes['btn-block']).not.toBe(true);
        });

        it('adds class when changed to true', () => {
            let button = fixture.debugElement.queryAll(By.directive(ButtonDirective))[1];

            component.block = false;
            fixture.detectChanges();

            component.block = true;
            fixture.detectChanges();

            expect(button.classes['btn-block']).toBe(true);
        });
    });

    describe('iconOnly', () => {
        let fixture: ComponentFixture<TestIconOnlyComponent>;
        let component: TestIconOnlyComponent;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [CommonModule, ButtonModule.forRoot()],
                declarations: [TestIconOnlyComponent]
            });

            fixture = TestBed.createComponent(TestIconOnlyComponent);
            fixture.detectChanges();

            component = fixture.componentInstance;
        });

        it('adds no class when not provided', () => {
            let buttonWithDefaultSize = fixture.debugElement.queryAll(By.directive(ButtonDirective))[0];

            expect(buttonWithDefaultSize.classes['btn-icon-only']).not.toBe(true);
        });

        it('adds class for specified value', () => {
            let button = fixture.debugElement.queryAll(By.directive(ButtonDirective))[1];

            expect(button.classes['btn-icon-only']).toBe(true);
        });

        it('removes class when changed to false', () => {
            let button = fixture.debugElement.queryAll(By.directive(ButtonDirective))[1];

            component.iconOnly = false;
            fixture.detectChanges();

            expect(button.classes['btn-icon-only']).not.toBe(true);
        });

        it('removes class when changed to null', () => {
            let button = fixture.debugElement.queryAll(By.directive(ButtonDirective))[1];

            component.iconOnly = null;
            fixture.detectChanges();

            expect(button.classes['btn-icon-only']).not.toBe(true);
        });

        it('adds class when changed to true', () => {
            let button = fixture.debugElement.queryAll(By.directive(ButtonDirective))[1];

            component.iconOnly = false;
            fixture.detectChanges();

            component.iconOnly = true;
            fixture.detectChanges();

            expect(button.classes['btn-icon-only']).toBe(true);
        });
    });
});

@Component({
    template: `
        <button cfButton>Default</button>
        <button cfButton [cfRole]='role'>With Value</button>
`
})
class TestRoleComponent {
    role: ButtonRole = ButtonRoles.danger;
}

@Component({
    template: `
        <button cfButton>Default</button>
        <button cfButton [cfSize]='size'>With Value</button>
`
})
class TestSizeComponent {
    size: ButtonSize = ButtonSizes.large;
}

@Component({
    template: `
        <button cfButton>Default</button>
        <button cfButton [cfBlock]='block'>With Value</button>
`
})
class TestBlockComponent {
    block: boolean = true;
}

@Component({
    template: `
        <button cfButton>Default <i class='fa fa-arrow-right'></i></button>
        <button cfButton [cfIconOnly]='iconOnly'>With Value <i class='fa fa-arrow-right'></i></button>
`
})
class TestIconOnlyComponent {
    iconOnly: boolean = true;
}
