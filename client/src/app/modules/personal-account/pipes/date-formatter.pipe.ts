import { Pipe, PipeTransform } from '@angular/core';
import { DateServiceUtil } from '../../../core/utils';

@Pipe({
	name: 'dateFormatter',
	standalone: true,
})
export class DateFormatterPipe implements PipeTransform {
	/**
	 *
	 * @param value date format in (year-month-week) or (year-month)
	 * @returns formatted date, example: January 2023, Week 13.
	 */
	transform(value: string): string {
		const [year, month, week] = DateServiceUtil.dateSplitter(value);

		const dateFormat = 'LLLL'; // get month name
		const dateString = DateServiceUtil.formatDate(new Date(year, month), dateFormat);
		if (!week) {
			return `${dateString}, ${year}`;
		}
		return `${dateString}, ${year}, Week ${week}`;
	}
}
