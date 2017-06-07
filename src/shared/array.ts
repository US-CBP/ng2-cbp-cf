export function count<T>(array: T[], criteria: (item: T, index: number, arr: T[]) => boolean): number {
    return array.filter(criteria).length;
}

export class SortKey<T> {
    constructor(public getValue: (item: T) => any, public ascending: boolean = true) { }
}

export function sortBy<T>(array: T[], ...sortKeys: Array<((item: T) => any) | SortKey<T>>): T[] {
    return array.sort((item1, item2) => {
        for(let sortKey of sortKeys) {
            const getSortKey = (sortKey instanceof SortKey) ? sortKey.getValue : sortKey;
            const ascending = (sortKey instanceof SortKey) ? sortKey.ascending : true;

            let sortKey1 = getSortKey(item1);
            let sortKey2 = getSortKey(item2);
            if(sortKey1 < sortKey2) {
                return ascending ? -1 : 1;
            } else if(sortKey1 > sortKey2) {
                return ascending ? 1 : -1;
            }
        }

        return 0;
    });
}

export function toMap<T, TKey>(array: T[], getKey: (item: T) => TKey): Map<TKey, T>;
export function toMap<T, TKey, TItem>(array: T[], getKey: (item: T) => TKey, getItem: (item: T) => TItem): Map<TKey, TItem>;
export function toMap<T, TKey, TItem>(array: T[], getKey: (item: T) => TKey, getItem: (item: T) => T | TItem = (item => item)): Map<TKey, T | TItem> {
    let map = new Map<TKey, T | TItem>();

    for(let x of array) {
        let key = getKey(x);
        let item = getItem(x);
        map.set(key, item);
    }

    return map;
}
