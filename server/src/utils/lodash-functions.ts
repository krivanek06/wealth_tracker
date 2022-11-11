import { Dictionary, List, ValueIteratee } from 'lodash';
import chunks from 'lodash/chunk';
import cloneDeep from 'lodash/cloneDeep';
import flatten from 'lodash/flatten';
import groupBy from 'lodash/groupBy';
import isEqual from 'lodash/isEqual';
import round from 'lodash/round';
import takeRight from 'lodash/takeRight';
import zip from 'lodash/zip';

export class LodashServiceUtil {
	static round(n: number, precision?: number): number {
		return round(n, precision);
	}

	static groupBy<T>(collection: List<T> | null | undefined, iteratee?: ValueIteratee<T>): Dictionary<T[]> {
		return groupBy(collection, iteratee);
	}

	static cloneDeep<T>(value: T): T {
		return cloneDeep(value);
	}

	static chunk<T>(array: List<T> | null | undefined, size?: number): T[][] {
		return chunks(array, size);
	}

	static takeRight<T>(array: T[] | null | undefined, n?: number): T[] {
		return takeRight(array, n);
	}

	static flattenArray<T>(array: T[][] | null | undefined): T[] {
		return flatten(array);
	}

	static zipArrays<T>(...arrays: Array<T[] | null | undefined>): Array<Array<T | undefined>> {
		return zip(...arrays);
	}

	static isEqual(value: any, other: any): boolean {
		return isEqual(value, other);
	}
}
