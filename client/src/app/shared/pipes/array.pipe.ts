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

// -----------------

@Pipe({
	name: 'arrayReverse',
	standalone: true,
})
export class ArrayReversePipe implements PipeTransform {
	transform<T extends unknown>(value: T[]): T[] {
		return value.slice().reverse();
	}
}

// -----------------

@Pipe({
	name: 'arrayExclude',
	standalone: true,
})
export class ArrayExcludePipe implements PipeTransform {
	transform<T extends Record<string, unknown>>(arrayItems: T[], excludeData: T[], excludeKey: keyof T): T[] {
		return arrayItems.filter(
			(item) => !excludeData.some((excludeItem) => excludeItem[excludeKey] === item[excludeKey])
		);
	}
}
