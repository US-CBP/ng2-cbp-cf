import { Portal }           from '@angular/cdk/portal';

import { LeftAction }       from './left-action.model';

export class Toolbar {
    constructor(
        public leftAction: LeftAction | null | undefined,
        public portal: Portal<any> | null | undefined,
        public title: string | null | undefined) {
    }
}
