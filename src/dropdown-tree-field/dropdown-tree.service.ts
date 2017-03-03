import {
    ElementRef,
    Injectable,
}                   from '@angular/core';

@Injectable()
export class DropdownTreeService {
    elementToScrollTo: ElementRef;

    constructor() {
    }
}
