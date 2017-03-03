/**
 * Annotation Factory that allows HTML style boolean attributes. For example,
 * a field declared like this:
 * @Directive({ selector: 'component' }) class MyComponent {
 *   @Input() @BooleanFieldValueFactory() myField: boolean;
 * }
 *
 * You could set it up this way:
 *   <component myField>
 * or:
 *   <component myField="">
 * @deprecated
 */
function booleanFieldValueFactory(): Function {
    /* tslint:disable:only-arrow-functions */
    return function booleanFieldValueMetadata(target: any, key: string): void {
        const defaultValue = target[key];
        const localKey = `__md_private_symbol_${key}`;
        target[localKey] = defaultValue;

        Object.defineProperty(target, key, {
            get(): boolean { return (<any>this)[localKey]; },
            set(value: boolean): void {
                (<any>this)[localKey] = value != null && `${value}` !== 'false';
            },
        });
    };
    /* tslint:enable */
}
export { booleanFieldValueFactory as BooleanFieldValue };
