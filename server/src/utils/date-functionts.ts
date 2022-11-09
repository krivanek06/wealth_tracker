import {
	addDays,
	differenceInDays,
	format,
	getDay,
	getMonth,
	getWeek,
	getYear,
	isBefore,
	isWeekend,
	startOfDay,
	subDays,
} from 'date-fns';
export type DateServiceUtilDateInformations = {
	year: number;
	month: number;
	week: number;
	day: number;
};

export class MomentServiceUtil {
	static getDetailsInformationFromDate(input: string | Date): DateServiceUtilDateInformations {
		const date = new Date(input);

		return {
			year: getYear(date),
			month: getMonth(date),
			week: getWeek(date),
			day: getDay(date),
		};
	}

	static format(date: string | Date | number, formateStr = 'yyyy-MM-dd'): string {
		return format(new Date(date), formateStr);
	}

	static subDays(date: string | Date | number, amount: number): Date {
		return subDays(new Date(date), amount);
	}

	static startOfDay(date: string | Date | number): Date {
		return startOfDay(new Date(date));
	}

	static isBefore(date: Date | number | string, dateToCompare: Date | number | string): boolean {
		const firstDate = new Date(date);
		const secondate = new Date(dateToCompare);
		return isBefore(firstDate, secondate);
	}

	static isWeekend(date: Date | string | number): boolean {
		return isWeekend(new Date(date));
	}

	/**
	 * Gets an array of Dates where the values increment by one day
	 * and the first value is the first value of the `DateRange`,
	 * and the last value is the last value of `DateRange`
	 */
	static getDates(start?: Date | string, end?: Date | string, skipWeekends = true): Date[] {
		if (!start || !end) {
			return [];
		}
		const startDate = startOfDay(new Date(start));
		const endDate = startOfDay(new Date(end));
		const diff = differenceInDays(endDate, startDate);

		const days = Array.from({ length: diff }, (_, i) => i + 1);

		const dates = [startDate, ...days.map((additionalDays) => startOfDay(addDays(startDate, additionalDays)))];
		const filteredDates = !!skipWeekends ? dates.filter((d) => !isWeekend(d)) : dates;

		return filteredDates;
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
	static getDayDifference(first: string | Date | number, second: string | Date | number): number {
		const firstDate = new Date(first);
		const secondDate = new Date(second);
		return Math.abs(differenceInDays(firstDate, secondDate));
	}
}
