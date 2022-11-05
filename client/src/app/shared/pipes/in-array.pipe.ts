import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'inArray',
	standalone: true,
})
export class InArrayPipe<T> implements PipeTransform {
	transform(valueArray: T[], value: T, key?: keyof T): boolean {
		// array of numbers, strings
		if (!key) {
			return !!valueArray.find((d) => d === value);
		}

		// array of objects
		return !!valueArray.find((d) => d[key] === value[key]);
	}
}
