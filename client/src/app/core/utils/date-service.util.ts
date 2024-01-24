import { format, getMonth, getWeek, getYear } from 'date-fns';
export type DateServiceUtilDateInformation = {
	year: number;
	month: number;
	week: number;
	// format is yyyy-MM
	currentDateMonth: string;
	// format is yyyy-MM-ww
	currentDateMonthWeek: string;
};

type DateInput = string | number | Date;

export const getCurrentDateDefaultFormat = (config?: {
	addTime?: boolean;
	onlyMonth?: boolean;
	someDate?: string;
}): string => {
	const workingDate = config?.someDate ? new Date(config.someDate) : new Date();

	if (config?.addTime) {
		return dateFormatDate(workingDate, 'yyyy-MM-dd HH:mm:ss');
	}
	if (config?.onlyMonth) {
		return dateFormatDate(workingDate, 'yyyy-MM');
	}

	return dateFormatDate(workingDate, 'yyyy-MM-dd ');
};

export const dateFormatDate = (inputDate: DateInput, formateStr: string = 'yyyy-MM-dd'): string => {
	const date = new Date(inputDate);
	return format(date, formateStr);
};

export const formatDate = (inputDate: DateInput, formateStr: string = 'yyyy-MM-dd'): string => {
	const date = new Date(inputDate);
	return format(date, formateStr);
};

export const getDetailsInformationFromDate = (
	input: string | Date | number = new Date()
): DateServiceUtilDateInformation => {
	const date = new Date(input);

	const year = getYear(date);
	const month = getMonth(date) + 1;
	const week = getWeek(date) + 1;

	const currentDateMonth = `${year}-${month}`;
	const currentDateMonthWeek = `${year}-${currentDateMonth}-${week}`;

	return {
		year,
		month,
		week,
		currentDateMonth,
		currentDateMonthWeek,
	};
};

export const dateSplitter = (dateFormat: string): [number, number, number | undefined] => {
	const [year, month, week] = dateFormat.split('-').map((d) => Number(d));
	return [year, month, week] as [number, number, number | undefined];
};
