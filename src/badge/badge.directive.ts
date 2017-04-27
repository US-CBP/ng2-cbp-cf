import {
    Directive,
    Input,
}               from '@angular/core';

@Directive({
    selector: '[cfBadge]',
    /* tslint:disable:use-host-property-decorator */
    host: {
        '[class.cf-badge]': 'true',
        '[class.mat-primary]': 'color === \'primary\'',
        '[class.mat-accent]': 'color === \'accent\'',
        '[class.mat-warn]': 'color === \'warn\'',
    },
    /* tslint:enable */
})
export class BadgeDirective {
    @Input() color: 'primary' | 'accent' | 'warn';
}
