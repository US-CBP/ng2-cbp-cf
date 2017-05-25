import { CUSTOM_ELEMENTS_SCHEMA }       from '@angular/core';
import {
    ComponentFixture,
    TestBed,
}                                       from '@angular/core/testing';
import { MATERIAL_SANITY_CHECKS }       from '@angular/material';
import { NoopAnimationsModule }         from '@angular/platform-browser/animations';
import * as moment                      from 'moment/moment';

import { PayPeriodCalendarComponent }   from './pay-period-calendar.component';
import { PayPeriodCalendarModule }      from './pay-period-calendar.module';
import { PayPeriodMonth }               from './pay-period-month.model';
import { PayPeriod }                    from './pay-period.model';

describe('PayPeriodCalendarComponent', () => {
    let months: PayPeriodMonth[];
    let fixture: ComponentFixture<PayPeriodCalendarComponent>;
    let component: PayPeriodCalendarComponent;
    let monthSelected: jasmine.Spy;

    beforeEach(() => {
        monthSelected = jasmine.createSpy('monthSelected');

        months = createMonthsFromCurrent(-12, 12);

        TestBed.configureTestingModule({
            imports: [PayPeriodCalendarModule, NoopAnimationsModule],
            declarations: [],
            providers: [
                { provide: MATERIAL_SANITY_CHECKS, useValue: false },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        });
        fixture = TestBed.createComponent(PayPeriodCalendarComponent);

        component = fixture.componentInstance;
        component.months = months;
        component.monthSelected.subscribe(monthSelected);
    });

    describe('on init', () => {
        it('should set shownYear to year of the selectedPayPeriod', () => {
            let startDate = moment().startOf('day').startOf('month').add(2, 'months');
            let selectedPayPeriod = {
                id: 22,
                number: 22,
                startDate: startDate.toDate(),
                isSelectable: true,
            };

            component.selectedPayPeriod = selectedPayPeriod;
            fixture.detectChanges();

            expect(component.shownYear).toBe(startDate.year());
        });

        it('should set shownMonth to month of the selectedPayPeriod', () => {
            let startDate = moment().startOf('day').startOf('month').add(2, 'months');
            let selectedPayPeriod = {
                id: 22,
                number: 22,
                startDate: startDate.toDate(),
                isSelectable: true,
            };

            component.selectedPayPeriod = selectedPayPeriod;
            fixture.detectChanges();

            let month = months.find(m => m.year === startDate.year() && m.number === startDate.month() + 1);
            expect(component.shownMonth).toBe(month);
        });

        it('should set shownYear to earliest valid year when selectedPayPeriod is not in months', () => {
            let startDate = moment().startOf('day').startOf('month').add(20, 'months');
            let selectedPayPeriod = {
                id: 22,
                number: 22,
                startDate: startDate.toDate(),
                isSelectable: true,
            };

            component.selectedPayPeriod = selectedPayPeriod;
            fixture.detectChanges();

            expect(component.shownYear).toBe(months[0].year);
        });

        it('should set shownMonth to earliest valid month when selectedPayPeriod is not in months', () => {
            let startDate = moment().startOf('day').startOf('month').add(20, 'months');
            let selectedPayPeriod = {
                id: 22,
                number: 22,
                startDate: startDate.toDate(),
                isSelectable: true,
            };

            component.selectedPayPeriod = selectedPayPeriod;
            fixture.detectChanges();

            expect(component.shownMonth).toBe(months[0]);
        });

        it('should set shownYear to current year when selectedPayPeriod is null', () => {
            fixture.detectChanges();

            expect(component.shownYear).toBe(moment().year());
        });

        it('should set shownMonth to current month when selectedPayPeriod is null', () => {
            fixture.detectChanges();

            let currentMoment = moment();
            let month = months.find(m => m.year === currentMoment.year() && m.number === currentMoment.month() + 1);
            expect(component.shownMonth).toBe(month);
        });

        it('should set shownYear to first year when selectedPayPeriod is null and current month is not in months', () => {
            months = createMonthsFromCurrent(-13, -2);
            component.months = months;

            fixture.detectChanges();

            expect(component.shownYear).toBe(months[0].year);
        });

        it('should set shownMonth to current month when selectedPayPeriod is null and current month is not in months', () => {
            months = createMonthsFromCurrent(-13, -2);
            component.months = months;

            fixture.detectChanges();

            expect(component.shownMonth).toBe(months[0]);
        });

        it('should set years to distinct years in months', () => {
            fixture.detectChanges();

            let currentYear = moment().year();
            expect(component.years).toEqual([currentYear - 1, currentYear, currentYear + 1]);
        });

        it('should set monthsOfYear to months in shown year', () => {
            fixture.detectChanges();

            let currentYear = moment().year();
            let monthsOfYear = months.filter(m => m.year === currentYear);
            expect(component.monthsOfYear).toEqual(monthsOfYear);
        });

        it('should raise monthSelected event with shownMonth', () => {
            fixture.detectChanges();

            let currentMoment = moment();
            let month = months.find(m => m.year === currentMoment.year() && m.number === currentMoment.month() + 1);
            expect(monthSelected).toHaveBeenCalledWith(month);
        });
    });

    describe('isFirstMonthShown', () => {
        beforeEach(() => {
            fixture.detectChanges();
        });

        it('should return true when first month is shown', () => {
            component.shownYear = months[0].year;
            component.shownMonth = months[0];

            expect(component.isFirstMonthShown()).toBe(true);
        });

        it('should return false when first month is not shown', () => {
            component.shownYear = months[1].year;
            component.shownMonth = months[1];

            expect(component.isFirstMonthShown()).toBe(false);
        });
    });

    describe('isLastMonthShown', () => {
        beforeEach(() => {
            fixture.detectChanges();
        });

        it('should return true when last month is shown', () => {
            component.shownYear = months[months.length - 1].year;
            component.shownMonth = months[months.length - 1];

            expect(component.isLastMonthShown()).toBe(true);
        });

        it('should return false when last month is not shown', () => {
            component.shownYear = months[months.length - 2].year;
            component.shownMonth = months[months.length - 2];

            expect(component.isLastMonthShown()).toBe(false);
        });
    });

    describe('showPreviousMonth', () => {
        beforeEach(() => {
            fixture.detectChanges();
            monthSelected.calls.reset();
        });

        it('should not change shownYear when shownMonth is first month', () => {
            component.shownYear = months[0].year;
            component.shownMonth = months[0];

            component.showPreviousMonth();

            expect(component.shownYear).toBe(months[0].year);
        });

        it('should not change shownMonth when shownMonth is first month', () => {
            component.shownYear = months[0].year;
            component.shownMonth = months[0];

            component.showPreviousMonth();

            expect(component.shownMonth).toBe(months[0]);
        });

        it('should not raise monthSelected event when shownMonth is first month', () => {
            component.shownYear = months[0].year;
            component.shownMonth = months[0];
            monthSelected.calls.reset();

            component.showPreviousMonth();

            expect(monthSelected).not.toHaveBeenCalled();
        });

        it('should not change shownYear when previous month in the same year', () => {
            let currentYear = moment().year();
            let middleMonth = months.find(m => m.year === currentYear && m.number === 6);

            component.shownYear = currentYear;
            component.shownMonth = middleMonth;

            component.showPreviousMonth();

            expect(component.shownYear).toBe(currentYear);
        });

        it('should change shownMonth when previous month in the same year', () => {
            let currentYear = moment().year();
            let middleMonth = months.find(m => m.year === currentYear && m.number === 6);

            component.shownYear = currentYear;
            component.shownMonth = middleMonth;

            component.showPreviousMonth();

            let previousMonth = months.find(m => m.year === currentYear && m.number === 5);
            expect(component.shownMonth).toBe(previousMonth);
        });

        it('should change shownYear when previous month in the different year', () => {
            let currentYear = moment().year();
            let firstMonth = months.find(m => m.year === currentYear && m.number === 1);

            component.shownYear = currentYear;
            component.shownMonth = firstMonth;

            component.showPreviousMonth();

            expect(component.shownYear).toBe(currentYear - 1);
        });

        it('should change shownMonth when previous month in the same year', () => {
            let currentYear = moment().year();
            let firstMonth = months.find(m => m.year === currentYear && m.number === 1);

            component.shownYear = currentYear;
            component.shownMonth = firstMonth;

            component.showPreviousMonth();

            let previousMonth = months.find(m => m.year === currentYear - 1 && m.number === 12);
            expect(component.shownMonth).toBe(previousMonth);
        });

        it('should raise monthSelected event', () => {
            let currentYear = moment().year();
            let middleMonth = months.find(m => m.year === currentYear && m.number === 6);

            component.shownYear = currentYear;
            component.shownMonth = middleMonth;
            monthSelected.calls.reset();

            component.showPreviousMonth();

            let previousMonth = months.find(m => m.year === currentYear && m.number === 5);
            expect(monthSelected).toHaveBeenCalledWith(previousMonth);
        });
    });

    describe('showNextMonth', () => {
        beforeEach(() => {
            fixture.detectChanges();
            monthSelected.calls.reset();
        });

        it('should not change shownYear when shownMonth is last month', () => {
            component.shownYear = months[months.length - 1].year;
            component.shownMonth = months[months.length - 1];

            component.showNextMonth();

            expect(component.shownYear).toBe(months[months.length - 1].year);
        });

        it('should not change shownMonth when shownMonth is last month', () => {
            component.shownYear = months[months.length - 1].year;
            component.shownMonth = months[months.length - 1];

            component.showNextMonth();

            expect(component.shownMonth).toBe(months[months.length - 1]);
        });

        it('should not raise monthSelected event when shownMonth is last month', () => {
            component.shownYear = months[months.length - 1].year;
            component.shownMonth = months[months.length - 1];
            monthSelected.calls.reset();

            component.showNextMonth();

            expect(monthSelected).not.toHaveBeenCalled();
        });

        it('should not change shownYear when next month in the same year', () => {
            let currentYear = moment().year();
            let middleMonth = months.find(m => m.year === currentYear && m.number === 6);

            component.shownYear = currentYear;
            component.shownMonth = middleMonth;

            component.showNextMonth();

            expect(component.shownYear).toBe(currentYear);
        });

        it('should change shownMonth when next month in the same year', () => {
            let currentYear = moment().year();
            let middleMonth = months.find(m => m.year === currentYear && m.number === 6);

            component.shownYear = currentYear;
            component.shownMonth = middleMonth;

            component.showNextMonth();

            let nextMonth = months.find(m => m.year === currentYear && m.number === 7);
            expect(component.shownMonth).toBe(nextMonth);
        });

        it('should change shownYear when next month in the different year', () => {
            let currentYear = moment().year();
            let lastMonth = months.find(m => m.year === currentYear && m.number === 12);

            component.shownYear = currentYear;
            component.shownMonth = lastMonth;

            component.showNextMonth();

            expect(component.shownYear).toBe(currentYear + 1);
        });

        it('should change shownMonth when next month in the same year', () => {
            let currentYear = moment().year();
            let firstMonth = months.find(m => m.year === currentYear && m.number === 12);

            component.shownYear = currentYear;
            component.shownMonth = firstMonth;

            component.showNextMonth();

            let nextMonth = months.find(m => m.year === currentYear + 1 && m.number === 1);
            expect(component.shownMonth).toBe(nextMonth);
        });

        it('should raise monthSelected event', () => {
            let currentYear = moment().year();
            let middleMonth = months.find(m => m.year === currentYear && m.number === 6);

            component.shownYear = currentYear;
            component.shownMonth = middleMonth;
            monthSelected.calls.reset();

            component.showNextMonth();

            let nextMonth = months.find(m => m.year === currentYear && m.number === 7);
            expect(monthSelected).toHaveBeenCalledWith(nextMonth);
        });
    });

    describe('isSelected', () => {
        beforeEach(() => {
            let startDate = moment().startOf('day').startOf('month');
            let selectedPayPeriod = {
                id: 22,
                number: 22,
                startDate: startDate.toDate(),
                isSelectable: true,
            };
            component.selectedPayPeriod = selectedPayPeriod;

            fixture.detectChanges();
        });

        it('should return false when pay periods has different id as selected pay period', () => {
            let startDate = moment().startOf('day').startOf('month');
            let payPeriod = {
                id: 1,
                number: 1,
                startDate: startDate.toDate(),
                isSelectable: true,
            };

            expect(component.isSelected(payPeriod)).toBe(false);
        });

        it('should return true when pay periods has same id as selected pay period', () => {
            let startDate = moment().startOf('day').startOf('month');
            let payPeriod = {
                id: 22,
                number: 22,
                startDate: startDate.toDate(),
                isSelectable: true,
            };

            expect(component.isSelected(payPeriod)).toBe(true);
        });
    });

    describe('selectPayPeriod', () => {
        beforeEach(() => {
            fixture.detectChanges();
        });

        it('should not change selectedPayPeriod directly', () => {
            let startDate = moment().startOf('day').startOf('month');
            let payPeriod = {
                id: 1,
                number: 1,
                startDate: startDate.toDate(),
                isSelectable: true,
            };

            component.selectPayPeriod(payPeriod);

            expect(component.selectedPayPeriod).toBeUndefined();
        });

        it('should raise payPeriodSelected event', () => {
            let subscriber = jasmine.createSpy('onPayPeriodSelected');
            component.payPeriodSelected.subscribe(subscriber);

            let startDate = moment().startOf('day').startOf('month');
            let payPeriod = {
                id: 1,
                number: 1,
                startDate: startDate.toDate(),
                isSelectable: true,
            };

            component.selectPayPeriod(payPeriod);

            expect(subscriber).toHaveBeenCalledWith(payPeriod);
        });
    });

    describe('setting shownYear', () => {
        beforeEach(() => {
            fixture.detectChanges();
            monthSelected.calls.reset();
        });

        it('to same value should not change shownMonth', () => {
            let shownYear = component.shownYear;
            let shownMonth = component.shownMonth;

            component.shownYear = shownYear;

            expect(component.shownMonth).toBe(shownMonth);
        });

        it('to same value should not raise monthSelected event', () => {
            let shownYear = component.shownYear;

            component.shownYear = shownYear;

            expect(monthSelected).not.toHaveBeenCalled();
        });

        it('to new value should change shownMonth to first month of new year', () => {
            let shownYear = component.shownYear;
            let firstMonth = months.find(m => m.year === shownYear + 1 && m.number === 1);

            component.shownYear = shownYear + 1;

            expect(component.shownMonth).toBe(firstMonth);
        });

        it('to new value should raise monthSelected event', () => {
            let shownYear = component.shownYear;
            let firstMonth = months.find(m => m.year === shownYear + 1 && m.number === 1);

            component.shownYear = shownYear + 1;

            expect(monthSelected).toHaveBeenCalledWith(firstMonth);
        });

        it('to new value should change shownMonth to first available month of new year when first month is not available', () => {
            let shownYear = component.shownYear;
            let firstAvailableMonth = months[0];

            component.shownYear = shownYear - 1;

            expect(component.shownMonth).toBe(firstAvailableMonth);
        });

        it('to new value should change monthsOfYear to months for the new year', () => {
            let shownYear = component.shownYear;
            let monthsOfYear = months.filter(m => m.year === shownYear - 1);

            component.shownYear = shownYear - 1;

            expect(component.monthsOfYear).toEqual(monthsOfYear);
        });
    });

    describe('setting shownMonth', () => {
        beforeEach(() => {
            fixture.detectChanges();

            monthSelected.calls.reset();
        });

        it('to same value should not raise monthSelected event', () => {
            let shownMonth = component.shownMonth;

            component.shownMonth = shownMonth;

            expect(monthSelected).not.toHaveBeenCalled();
        });

        it('to new value should raise monthSelected event', () => {
            component.shownMonth = months[0];

            expect(monthSelected).toHaveBeenCalledWith(months[0]);
        });
    });

    describe('dayOfWeek', () => {
        let startDate: moment.Moment;
        let payPeriodsOfMonth: PayPeriod[];

        beforeEach(() => {
            startDate = moment().startOf('day').startOf('week');
            payPeriodsOfMonth = [
                {
                    id: 1,
                    number: 1,
                    startDate: startDate.toDate(),
                    isSelectable: true,
                },
            ];
            component.payPeriodsOfMonth = payPeriodsOfMonth;

            fixture.detectChanges();
        });

        it('returns start date day for week 1 day 0', () => {
            expect(component.dayOfMonth(payPeriodsOfMonth[0], 1, 0)).toBe(startDate.clone().add(0, 'days').date());
        });

        it('returns day for week 1 offset with day 0', () => {
            expect(component.dayOfMonth(payPeriodsOfMonth[0], 1, 2)).toBe(startDate.clone().add(2, 'days').date());
        });

        it('returns day for week 2 offset with day 0', () => {
            expect(component.dayOfMonth(payPeriodsOfMonth[0], 2, 2)).toBe(startDate.clone().add(7 + 2, 'days').date());
        });
    });

    function createMonthsFromCurrent(startIndex: number, endIndex: number): PayPeriodMonth[] {
        let results: any[] = [];
        let currentMoment = moment().startOf('day').startOf('month');
        for(let i = startIndex; i <= endIndex; i++) {
            let m = currentMoment.clone().add(i, 'months');
            results.push({ year: m.year(), number: m.month() + 1, name: m.format('MMM') });
        }

        return results;
    }
});
