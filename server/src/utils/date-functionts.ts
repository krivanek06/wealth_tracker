import {
	addDays,
	differenceInDays,
	differenceInHours,
	format,
	getDay,
	getMonth,
	getTime,
	getWeek,
	getYear,
	isAfter,
	isBefore,
	isSameDay,
	isToday,
	isWeekend,
	startOfDay,
	subDays,
	subHours,
} from 'date-fns';
import { STOCK_MARKET_CLOSED_DATES } from '../shared/dto';
export type DateServiceUtilDateInformations = {
	year: number;
	month: number;
	week: number;
	day: number;
};

type DateInput = string | Date | number;

export class MomentServiceUtil {
	static getDetailsInformationFromDate(input: DateInput): DateServiceUtilDateInformations {
		const date = new Date(input);

		return {
			year: getYear(date),
			month: getMonth(date),
			week: getWeek(date),
			day: getDay(date),
		};
	}

	static format(date: DateInput, formateStr = 'yyyy-MM-dd'): string {
		return format(new Date(date), formateStr);
	}

	static subDays(date: DateInput, amount: number): Date {
		return subDays(new Date(date), amount);
	}

	static subHours(date: DateInput, amount: number): Date {
		return subHours(new Date(date), amount);
	}

	static addDays(date: DateInput, amount: number): Date {
		return addDays(new Date(date), amount);
	}

	static startOfDay(date: DateInput): Date {
		return startOfDay(new Date(date));
	}

	static isToday(date: DateInput): boolean {
		return isToday(new Date(date));
	}

	static isBefore(date: DateInput, dateToCompare: DateInput): boolean {
		const firstDate = new Date(date);
		const secondDate = new Date(dateToCompare);
		return isBefore(firstDate, secondDate);
	}

	static isAfter(date: DateInput, dateToCompare: DateInput): boolean {
		const firstDate = new Date(date);
		const secondDate = new Date(dateToCompare);
		return isAfter(firstDate, secondDate);
	}

	static isWeekend(date: DateInput): boolean {
		return isWeekend(new Date(date));
	}

	static getTime(date: DateInput): number {
		return getTime(new Date(date));
	}

	static isSameDay(first: DateInput, second: DateInput): boolean {
		const firstDate = new Date(first);
		const secondDate = new Date(second);
		return isSameDay(firstDate, secondDate);
	}

	static isHoliday(date: DateInput): boolean {
		const formattedDate = new Date(date);

		// check if it's a holiday when the market is closed
		for (let i = 0; i < STOCK_MARKET_CLOSED_DATES.length; i++) {
			const month = getMonth(formattedDate);
			const day = getDay(formattedDate);
			if (month === getMonth(STOCK_MARKET_CLOSED_DATES[i]) && day === getDay(STOCK_MARKET_CLOSED_DATES[i])) {
				return true;
			}
		}
		return false;
	}

	/**
	 *
	 * @param days
	 * @returns [startDate, endDate]
	 */
	static getDateRangeByDayDiff(days: number): [Date, Date] {
		const today = new Date();
		const startDate = startOfDay(subDays(today, days));
		const endDate = startOfDay(today);

		return [startDate, endDate];
	}

	static randomWorkingDayInPast(): Date {
		// pick a past day
		const randomDay = Math.floor(Math.random() * 165) + 300;
		const pastDay = subDays(new Date(), randomDay);

		// get random 30 days
		const days = Array.from({ length: 30 }, (_, i) => i + 1);
		const dates = days
			.map((additionalDays) => startOfDay(subDays(pastDay, additionalDays)))
			.filter((d) => !isWeekend(d) && !this.isHoliday(d));

		// if no working day found, try again
		if (dates.length === 0) {
			return this.randomWorkingDayInPast();
		}

		// return random working day
		return dates[0];
	}

	/**
	 * Gets an array of Dates where the values increment by one day
	 * and the first value is the first value of the `DateRange`,
	 * and the last value is the last value of `DateRange`
	 */
	static getDates(start?: DateInput, end?: DateInput, skipWeekends = true): Date[] {
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
	 *
	 * @param first
	 * @param second
	 * @returns the selected difference in two dates
	 */
	static getDifference(first: DateInput, second: DateInput, diff: 'days' | 'hours'): number {
		const firstDate = new Date(first);
		const secondDate = new Date(second);

		if (diff === 'days') {
			return Math.abs(differenceInDays(firstDate, secondDate));
		}
		if (diff === 'hours') {
			return Math.abs(differenceInHours(firstDate, secondDate));
		}
		return 0;
	}
}
