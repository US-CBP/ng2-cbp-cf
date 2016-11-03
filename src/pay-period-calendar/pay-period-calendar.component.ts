import {
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output
}                                   from '@angular/core';
import * as moment                  from 'moment/moment';

import { PayPeriod }                from './pay-period.model';
import { PayPeriodMonth }           from './pay-period-month.model';
import { ButtonRoles }              from '../button';

@Component({
    selector: 'cf-pay-period-calendar',
    templateUrl: 'pay-period-calendar.component.html',
    styleUrls: ['pay-period-calendar.component.scss']
})
export class PayPeriodCalendarComponent implements OnInit {
    @Input() id: string;
    @Input() selectedPayPeriod: PayPeriod;
    @Input() payPeriodsOfMonth: PayPeriod[];
    @Output() payPeriodSelected = new EventEmitter<PayPeriod>();
    @Output() monthSelected = new EventEmitter<PayPeriodMonth>();

    years: number[];
    monthsOfYear: PayPeriodMonth[];
    nextMonths: Map<PayPeriodMonth, PayPeriodMonth>;
    previousMonths: Map<PayPeriodMonth, PayPeriodMonth>;

    ButtonRoles: any = ButtonRoles;

    private _months: PayPeriodMonth[];
    private _monthsByYear: Map<number, PayPeriodMonth[]>;
    private _shownYear: number;
    private _shownMonth: PayPeriodMonth;
    private _initialized: boolean = false;

    constructor() {
    }

    ngOnInit() {
        this._initialize();
        this._initialized = true;
    }

    private _initialize() {
        this._initializeMonths();
        this._initializeYears();
        this._initializeNextPrevious();
        this._initializeShownValues();

        this.monthsOfYear = this._monthsByYear.get(this._shownYear);
        this._emitMonthSelected();
    }

    private _initializeMonths() {
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

    private _initializeYears() {
        this.years = Array.from(this._monthsByYear.keys()).sort();
    }

    private _initializeNextPrevious() {
        this.nextMonths = new Map<PayPeriodMonth, PayPeriodMonth>();
        this.previousMonths = new Map<PayPeriodMonth, PayPeriodMonth>();

        let previous: PayPeriodMonth = null;
        for(let y of this.years) {
            for(let m of this._monthsByYear.get(y)) {
                this.previousMonths.set(m, previous);

                if(previous != null) {
                    this.nextMonths.set(previous, m);
                }

                previous = m;
            }
        }
        this.nextMonths.set(previous, null);
    }

    private _initializeShownValues() {
        let startDateMoment = this.selectedPayPeriod == null ? moment() : moment(this.selectedPayPeriod.startDate);
        let year = startDateMoment.year();
        let months = this._monthsByYear.get(year);

        if(months == null) {
            startDateMoment = moment();
            year = startDateMoment.year();
            months = this._monthsByYear.get(year);
        }

        let monthNumber = startDateMoment.month() + 1;
        let month = months.find(m => monthNumber === m.number);

        if(month == null) {
            year = this.years[0];
            month = this._findFirstAvailableMonth(year);
        }

        this._shownYear = year;
        this._shownMonth = month;
    }

    private _emitMonthSelected() {
        this.monthSelected.emit(this._shownMonth);
    }

    private _findFirstAvailableMonth(year: number): PayPeriodMonth {
        return this._monthsByYear.get(year)[0];
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

    get shownYear(): number {
        return this._shownYear;
    }
    set shownYear(value: number) {
        if(this._shownYear !== value) {
            this._shownYear = value;
            this.monthsOfYear = this._monthsByYear.get(value);
            this.shownMonth = this.monthsOfYear[0];
        }
    }

    get shownMonth(): PayPeriodMonth {
        return this._shownMonth;
    }
    set shownMonth(value: PayPeriodMonth) {
        if(this._shownMonth !== value) {
            this._shownMonth = value;
            this.shownYear = value.year;
            this._emitMonthSelected();
        }
    }

    showPreviousMonth() {
        let previousMonth = this.previousMonths.get(this._shownMonth);
        if(previousMonth != null) {
            this.shownYear = previousMonth.year;
            this.shownMonth = previousMonth;
        }
    }

    showNextMonth() {
        let nextMonth = this.nextMonths.get(this._shownMonth);
        if(nextMonth != null) {
            this.shownYear = nextMonth.year;
            this.shownMonth = nextMonth;
        }
    }

    isFirstMonthShown(): boolean {
        return this.previousMonths.get(this._shownMonth) == null;
    }

    isLastMonthShown(): boolean {
        return this.nextMonths.get(this._shownMonth) == null;
    }

    payPeriodTrackBy(index: number, pp: PayPeriod): number {
        return pp.id;
    }

    isSelected(pp: PayPeriod): boolean {
        return this.selectedPayPeriod != null && this.selectedPayPeriod.id === pp.id;
    }

    selectPayPeriod(pp: PayPeriod) {
        this.payPeriodSelected.emit(pp);
    }

    dayOfMonth(pp: PayPeriod, week: number, dayOfWeek: number): number {
        return moment(pp.startDate).add(week - 1, 'weeks').add(dayOfWeek, 'days').date();
    }
}
