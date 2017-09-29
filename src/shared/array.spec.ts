import {
    SortKey,
    sortBy,
}               from './array';

/* tslint:disable:no-magic-numbers */
describe('sortBy', () => {
    it('sorts ascending with one key', () => {
        const array = [
            { key: 5 },
            { key: 1 },
        ];

        const result = sortBy(array.slice(), x => x.key);

        expect(result).toEqual([array[1], array[0]]);
    });

    it('sorts descending with one key', () => {
        const array = [
            { key: 1 },
            { key: 5 },
        ];

        const result = sortBy(array.slice(), new SortKey<{ key: number }>(x => x.key, false));

        expect(result).toEqual([array[1], array[0]]);
    });

    it('sorts ascending with multiple keys', () => {
        const array = [
            { key1: 5, key2: 2 },
            { key1: 1, key2: 5 },
            { key1: 3, key2: 2 },
            { key1: 1, key2: 2 },
            { key1: 5, key2: 1 },
        ];

        const result = sortBy(array.slice(), x => x.key1, x => x.key2);

        const expected = [
            array[3],
            array[1],
            array[2],
            array[4],
            array[0],
        ];
        expect(result).toEqual(expected);
    });

    it('sorts descending with multiple keys', () => {
        const array = [
            { key1: 5, key2: 2 },
            { key1: 1, key2: 5 },
            { key1: 3, key2: 2 },
            { key1: 1, key2: 2 },
            { key1: 5, key2: 1 },
        ];

        const sortKey1 = new SortKey<{ key1: number; key2: number }>(x => x.key1, false);
        const sortKey2 = new SortKey<{ key1: number; key2: number }>(x => x.key2, false);
        const result = sortBy(array.slice(), sortKey1, sortKey2);

        const expected = [
            array[0],
            array[4],
            array[2],
            array[1],
            array[3],
        ];
        expect(result).toEqual(expected);
    });

    it('sorts mixed ascending/descending', () => {
        const array = [
            { key1: 5, key2: 2 },
            { key1: 1, key2: 5 },
            { key1: 3, key2: 2 },
            { key1: 1, key2: 2 },
            { key1: 5, key2: 1 },
        ];

        const sortKey1 = new SortKey<{ key1: number; key2: number }>(x => x.key1, true);
        const sortKey2 = new SortKey<{ key1: number; key2: number }>(x => x.key2, false);
        const result = sortBy(array.slice(), sortKey1, sortKey2);

        const expected = [
            array[1],
            array[3],
            array[2],
            array[0],
            array[4],
        ];
        expect(result).toEqual(expected);
    });
});
/* tslint:enable:no-magic-numbers */
