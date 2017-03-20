import {
    Directive,
    Input,
}               from '@angular/core';

@Directive({
    selector: '[cf-badge]',
    host: {
        '[class.cf-badge]': 'true',
        '[class.mat-primary]': 'color === \'primary\'',
        '[class.mat-accent]': 'color === \'accent\'',
        '[class.mat-warn]': 'color === \'warn\'',
    },
})
export class BadgeDirective {
    @Input() color: 'primary' | 'accent' | 'warn';
}
