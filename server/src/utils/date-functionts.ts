import { differenceInDays, getDay, getMonth, getWeek, getYear, isBefore } from 'date-fns';
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

	static isBefore(date: Date | number | string, dateToCompare: Date | number | string): boolean {
		const firstDate = new Date(date);
		const secondate = new Date(dateToCompare);
		return isBefore(firstDate, secondate);
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
