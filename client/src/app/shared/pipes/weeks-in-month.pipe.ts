import { Pipe, PipeTransform } from '@angular/core';
import { DateServiceUtil } from '../utils';

/**
 * For a selected month (0-11) returns available week numbers
 */
@Pipe({
	name: 'weeksInMonth',
	standalone: true,
})
export class WeeksInMonthPipe implements PipeTransform {
	/**
	 *
	 * @param yearAndMonth 2022-8 format
	 * @returns
	 */
	transform(yearAndMonth: string): number[] {
		const [year, month] = yearAndMonth.split('-').map((d) => Number(d));
		return DateServiceUtil.getWeeksInMonth(year, month);
	}
}
