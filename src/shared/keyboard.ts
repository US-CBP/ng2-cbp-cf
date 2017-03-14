interface MetaKeyFlags {
    altKey?: boolean;
    ctrlKey?: boolean;
    shiftKey?: boolean;
}

const keyCode0 = 48;
const keyCode9 = 57;
const keyCodeUpperA = 65;
const keyCodeUpperZ = 90;
const keyCodeLowerA = 97;
const keyCodeLowerZ = 122;

export function isKey(
    $event: KeyboardEvent,
    key: string,
    { altKey = false, ctrlKey = false, shiftKey = false }: MetaKeyFlags = { altKey: false, ctrlKey: false, shiftKey: false }): boolean {

    return $event.key === key &&
        $event.altKey === altKey &&
        $event.ctrlKey === ctrlKey &&
        $event.shiftKey === shiftKey &&
        $event.metaKey === false;
}

export function isAlphaKey($event: KeyboardEvent): boolean {
    if($event.altKey || $event.ctrlKey || $event.metaKey || $event.key.length > 1) {
        return false;
    }

    let code = $event.key.charCodeAt(0);
    return (code >= keyCodeUpperA && code <= keyCodeUpperZ) || (code >= keyCodeLowerA && code <= keyCodeLowerZ);
}

export function isNumberKey($event: KeyboardEvent): boolean {
    if($event.altKey || $event.ctrlKey || $event.shiftKey || $event.metaKey || $event.key.length > 1) {
        return false;
    }

    let code = $event.key.charCodeAt(0);
    return code >= keyCode0 && code <= keyCode9;
}

export function isAlphanumericKey($event: KeyboardEvent): boolean {
    return isAlphaKey($event) || isNumberKey($event);
}

export function isSingleCharacterKey($event: KeyboardEvent): boolean {
    if($event.altKey || $event.ctrlKey || $event.metaKey || $event.key.length > 1) {
        return false;
    }

    return $event.key.length === 1;
}
