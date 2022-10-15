import { getDay, getMonth, getWeek, getYear } from 'date-fns';
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
}
