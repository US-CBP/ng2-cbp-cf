import { TableHeader }  from './table-header.model';
import { TableOptions } from './table-options.model';

export interface Table {
    options: TableOptions;
    header: TableHeader[];
    data: any[];
    totalCount: number;
}
