import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'sortByKey',
	standalone: true,
})
export class SortByKeyPipe<T> implements PipeTransform {
	transform(values: T[] | null, key: keyof T, order: 'asc' | 'desc' = 'asc'): T[] {
		if (!values) {
			return [];
		}
		return values.slice().sort((a, b) => (order === 'desc' ? (a[key] < b[key] ? 1 : -1) : a[key] < b[key] ? -1 : 1));
	}
}
