import {
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
}                                   from '@angular/core';
import * as moment                  from 'moment/moment';

import { PayPeriodMonth }           from './pay-period-month.model';
import { PayPeriodSelection }       from './pay-period-selection.model';
import { PayPeriod }                from './pay-period.model';

@Component({
    selector: 'cf-pay-period-calendar',
    templateUrl: 'pay-period-calendar.component.html',
    styleUrls: ['pay-period-calendar.component.scss'],
})
export class PayPeriodCalendarComponent implements OnInit {
    @Input() id: string | undefined;
    @Input() selectedPayPeriod: PayPeriod | undefined;
    @Input() selectedPayPeriodDayIndex: number | undefined;
    @Input() payPeriodsOfMonth: PayPeriod[] | undefined;

    @Output() payPeriodSelected: EventEmitter<PayPeriodSelection> = new EventEmitter<PayPeriodSelection>();
    @Output() monthSelected: EventEmitter<PayPeriodMonth> = new EventEmitter<PayPeriodMonth>();

    years: number[] = [];
    monthsOfYear: PayPeriodMonth[] = [];
    nextMonths: Map<PayPeriodMonth, PayPeriodMonth | undefined> = new Map<PayPeriodMonth, PayPeriodMonth | undefined>();
    previousMonths: Map<PayPeriodMonth, PayPeriodMonth | undefined> = new Map<PayPeriodMonth, PayPeriodMonth | undefined>();

    private _months: PayPeriodMonth[] = [];
    private _monthsByYear: Map<number, PayPeriodMonth[]> = new Map<number, PayPeriodMonth[]>();
    private _shownYear: number | undefined;
    private _shownMonth: PayPeriodMonth | undefined;
    private _initialized: boolean = false;

    constructor() { }

    ngOnInit(): void {
        this._initialize();
        this._initialized = true;
    }

    @Input()
    get months(): PayPeriodMonth[] {
        return this._months;
    }
    set months(newValue: PayPeriodMonth[]) {
        if(this._months !== newValue) {
            this._months = newValue;

            if(this._initialized) {
                this._initialize();
            }
        }
    }

    get shownYear(): number | undefined {
        return this._shownYear;
    }
    set shownYear(value: number | undefined) {
        if(this._shownYear !== value) {
            this._shownYear = value;
            this.monthsOfYear = value == null ? [] : this._monthsByYear.get(value) || [];
            this.shownMonth = this.monthsOfYear[0];
        }
    }

    get shownMonth(): PayPeriodMonth | undefined {
        return this._shownMonth;
    }
    set shownMonth(value: PayPeriodMonth | undefined) {
        if(this._shownMonth !== value) {
            this._shownMonth = value;
            this.shownYear = value == null ? undefined : value.year;
            this._emitMonthSelected();
        }
    }

    showPreviousMonth(): void {
        const previousMonth = this._shownMonth == null ? undefined : this.previousMonths.get(this._shownMonth);
        if(previousMonth != null) {
            this.shownYear = previousMonth.year;
            this.shownMonth = previousMonth;
        }
    }

    showNextMonth(): void {
        const nextMonth = this._shownMonth == null ? undefined : this.nextMonths.get(this._shownMonth);
        if(nextMonth != null) {
            this.shownYear = nextMonth.year;
            this.shownMonth = nextMonth;
        }
    }

    isFirstMonthShown(): boolean {
        return this._shownMonth == null || this.previousMonths.get(this._shownMonth) == null;
    }

    isLastMonthShown(): boolean {
        return this._shownMonth == null || this.nextMonths.get(this._shownMonth) == null;
    }

    payPeriodTrackBy(_index: number, pp: PayPeriod): number {
        return pp.id;
    }

    isSelected(pp: PayPeriod): boolean {
        return this.selectedPayPeriod != null && this.selectedPayPeriod.id === pp.id;
    }

    isDaySelected(pp: PayPeriod, ppDayIndex: number): boolean {
        return this.isSelected(pp) && this.selectedPayPeriodDayIndex === ppDayIndex;
    }

    selectPayPeriod(pp: PayPeriod, ppDayIndex?: number): void {
        if(pp.isSelectable) {
            this.payPeriodSelected.emit({
                payPeriod: pp,
                dayIndex: ppDayIndex,
            });
        }
    }

    dayOfMonth(pp: PayPeriod, week: number, dayOfWeek: number): number {
        return moment(pp.startDate).add(week - 1, 'weeks').add(dayOfWeek, 'days').date();
    }

    private _initialize(): void {
        this._initializeMonths();
        this._initializeYears();
        this._initializeNextPrevious();
        this._initializeShownValues();

        this.monthsOfYear = this._shownYear == null ? [] : this._monthsByYear.get(this._shownYear) || [];
        this._emitMonthSelected();
    }

    private _initializeMonths(): void {
        this._monthsByYear = new Map<number, PayPeriodMonth[]>();
        this._months.forEach(m => {
            let months = this._monthsByYear.get(m.year);
            if(months == null) {
                months = [];
                this._monthsByYear.set(m.year, months);
            }
            months.push(m);
        });

        this._monthsByYear.forEach(months => {
            months.sort((m1, m2) => {
                if(m1.number === m2.number) {
                    return 0;
                } else if(m1.number < m2.number) {
                    return -1;
                } else {
                    return 1;
                }
            });
        });
    }

    private _initializeYears(): void {
        this.years = Array.from(this._monthsByYear.keys()).sort();
    }

    private _initializeNextPrevious(): void {
        this.nextMonths = new Map<PayPeriodMonth, PayPeriodMonth | undefined>();
        this.previousMonths = new Map<PayPeriodMonth, PayPeriodMonth | undefined>();

        let previous: PayPeriodMonth | undefined;
        for(const y of this.years) {
            const months = this._monthsByYear.get(y) || [];
            for(const m of months) {
                this.previousMonths.set(m, previous);

                if(previous != null) {
                    this.nextMonths.set(previous, m);
                }

                previous = m;
            }
        }
        if(previous != null) {
            this.nextMonths.set(previous, undefined);
        }
    }

    private _initializeShownValues(): void {
        const startDateMoment = this.selectedPayPeriod == null ? moment() : moment(this.selectedPayPeriod.startDate);
        let year = startDateMoment.year();
        const monthNumber = startDateMoment.month() + 1;
        let month = null;

        if(this._monthsByYear.has(year)) {
            month = this._monthsByYear.get(year)!.find(m => monthNumber === m.number);
        }

        if(month == null) {
            year = this.years[0];
            month = this._findFirstAvailableMonth(year);
        }

        this._shownYear = year;
        this._shownMonth = month;
    }

    private _emitMonthSelected(): void {
        this.monthSelected.emit(this._shownMonth);
    }

    private _findFirstAvailableMonth(year: number): PayPeriodMonth | undefined {
        const months = this._monthsByYear.get(year);
        return months == null ? undefined : months[0];
    }
}
