import { Injectable } from '@angular/core';
import { Http, URLSearchParams } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { PayPeriod } from './pay-period.model';

@Injectable()
export class PayPeriodCalendarService {
    constructor(private http: Http) {
    }

    loadPayPeriods(url: string, year: number, month: number): Promise<PayPeriod[]> {
        let params = new URLSearchParams();
        params.set('year', year.toString());
        params.set('month', month.toString());

        return this.http.get(url, { search: params })
            .toPromise()
            .then(response => response.json().payPeriods as PayPeriod[]);
    }
}
