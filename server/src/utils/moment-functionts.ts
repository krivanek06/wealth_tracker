import moment, { Moment } from 'moment';

export type DateServiceUtilDateInformations = {
	year: number;
	month: number;
	week: number;
	day: number;
};

export class MomentServiceUtil {
	static getDetailsInformationFromDate(date: string | Date): DateServiceUtilDateInformations {
		const dateMomentFormat = MomentServiceUtil.createObject(date);

		return {
			year: dateMomentFormat.year(),
			month: dateMomentFormat.month(),
			week: dateMomentFormat.week() - 1,
			day: dateMomentFormat.day(),
		};
	}

	static createObject(date: string | Date): Moment {
		return moment(date);
	}
}
