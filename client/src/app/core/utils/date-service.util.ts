import {
	differenceInBusinessDays,
	differenceInDays,
	format,
	getDay,
	getMonth,
	getWeek,
	getWeeksInMonth,
	getYear,
	isSameDay,
	isWeekend,
} from 'date-fns';
export type DateServiceUtilDateInformation = {
	year: number;
	month: number;
	week: number;
	day: number;
};

type DateInput = string | number | Date;

export class DateServiceUtil {
	static getDetailsInformationFromDate(input: string | Date | number): DateServiceUtilDateInformation {
		const date = new Date(input);

		return {
			year: getYear(date),
			month: getMonth(date),
			week: getWeek(date),
			day: getDay(date),
		};
	}

	/**
	 * const one = new Date(2022, 10, 20);
	 * const second = new Date(2022, 10, 22);
	 * result will be 2
	 *
	 * @param first
	 * @param second
	 * @returns the day difference in two dates
	 */
	static getDayDifference(first: DateInput, second: DateInput): number {
		const firstDate = new Date(first);
		const secondDate = new Date(second);
		return Math.abs(differenceInDays(firstDate, secondDate));
	}

	/**
	 * Docs: https://date-fns.org/v2.14.0/docs/format
	 *
	 * @param inputDate
	 * @param formatOptions
	 * @returns
	 */
	static formatDate(inputDate: DateInput, formateStr: string = 'yyyy-MM-dd'): string {
		const date = new Date(inputDate);
		return format(date, formateStr);
	}

	static isNotWeekend(date: DateInput): boolean {
		return !isWeekend(new Date(date));
	}

	static differenceInBusinessDays(date1: DateInput, date2: DateInput): number {
		return Math.abs(differenceInBusinessDays(new Date(date1), new Date(date2)));
	}

	static getWeeksInMonth(inputDate: DateInput): number {
		return getWeeksInMonth(new Date(inputDate));
	}

	static dateSplitter(dateFormat: string): [number, number, number | undefined] {
		const [year, month, week] = dateFormat.split('-').map((d) => Number(d));
		return [year, month, week] as [number, number, number | undefined];
	}

	static isSameDay(date1: DateInput, date2: DateInput): boolean {
		return isSameDay(new Date(Number(date1)), new Date(Number(date2)));
	}
}
