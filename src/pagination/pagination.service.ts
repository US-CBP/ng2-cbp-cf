import { Injectable }   from '@angular/core';
import * as _           from 'lodash';

import { Pager }        from './pagination-pager.model';

@Injectable()
export class PaginationService {
    constructor() {
    }

    getPager(totalItems: number, currentPage: number, pageSize: number) {
        // default to first page
        currentPage = currentPage || 1;

        // default page size is 10
        pageSize = pageSize || 10;

        // calculate total pages
        let totalPages: number = Math.ceil(totalItems / pageSize);

        let startPage: number;
        let endPage: number;
        if (totalPages <= 5) {
            // less than 10 total pages so show all
            startPage = 2;
            endPage = totalPages - 1;
        } else {
            // more than 10 total pages so calculate start and end pages
            if (currentPage <= 3) {
                startPage = 2;
                endPage = 6;
            } else if (currentPage + 2 >= totalPages) {
                startPage = totalPages - 4;
                endPage = totalPages - 1;
            } else {
                startPage = currentPage - 2;
                endPage = currentPage + 2;
            }
        }

        // calculate start and end item indexes
        let startIndex: number = (currentPage - 1) * pageSize;
        let endIndex: number = Math.min(startIndex + pageSize - 1, totalItems - 1);

        // create an array of pages to ng-repeat in the pager control
        let pages = _.range(startPage, endPage + 1);

        // return object with all pager properties required by the view
        let pager = {} as Pager;
        pager.totalItems = totalItems;
        pager.currentPage = currentPage;
        pager.pageSize = pageSize;
        pager.totalPages = totalPages;
        pager.startPage = startPage;
        pager.endPage = endPage;
        pager.startIndex = startIndex;
        pager.endIndex = endIndex;
        pager.pages = pages;

        return pager;
    }
}
