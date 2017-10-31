import { PayPeriod }                from './pay-period.model';

export interface PayPeriodSelection {
    payPeriod: PayPeriod;
    dayIndex: number | null;
}
