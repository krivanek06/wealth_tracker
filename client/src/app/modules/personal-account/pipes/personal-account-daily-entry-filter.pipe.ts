import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'dateFormatter',
	standalone: true,
})
export class PersonalAccountDailyEntryPipe implements PipeTransform {
	transform(value: string | number, opration: 'monthName' | 'yearName'): string | null {
		const [year, month] = String(value).split('-');
		if (opration === 'monthName') {
			const randomDate = new Date(Number(year), Number(month));
			return randomDate.toLocaleString('en-US', { month: 'long' });
		}
		if (opration == 'yearName') {
			return year;
		}
		return null;
	}
}
