import { format, getMonth, getWeek, getYear } from 'date-fns';

type DateInput = string | number | Date;

export const getCurrentDateDefaultFormat = (config?: {
	addTime?: boolean; // i.e: YYYY-MM-DD HH:mm:ss
	onlyMonth?: boolean; // i.e: YYYY-MM or YYYY-MM-dd
	someDate?: string | Date; // i.e: YYYY-MM-DD - use this date instead of current date
}): string => {
	const workingDate = config?.someDate ? new Date(config.someDate) : new Date();

	if (config?.addTime) {
		return format(workingDate, 'yyyy-MM-dd HH:mm:ss');
	}
	if (config?.onlyMonth) {
		return format(workingDate, 'yyyy-MM');
	}

	return format(workingDate, 'yyyy-MM-dd ');
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
): {
	year: number;
	month: number;
	week: number;
	// format is yyyy-MM: 2024-1
	currentDateMonth: string;
	// format is yyyy-MM-ww: 2024-1-1
	currentDateMonthWeek: string;
	// format is yyyy-MM-dd: 2024-01
	currentDateMonthCorrect: string;
} => {
	const date = new Date(input);

	const year = getYear(date);
	const month = getMonth(date) + 1;
	const week = getWeek(date, {
		weekStartsOn: 0,
	});

	const currentDateMonth = `${year}-${month}`;
	const currentDateMonthCorrect = `${year}-${month < 10 ? '0' + month : month}`;
	const currentDateMonthWeek = `${year}-${month}-${week}`;

	return {
		year,
		month,
		week,
		currentDateMonth,
		currentDateMonthWeek,
		currentDateMonthCorrect,
	};
};

export const dateSplitter = (dateFormat: string): [number, number, number | undefined] => {
	const [year, month, week] = dateFormat.split('-').map((d) => Number(d));
	return [year, month, week] as [number, number, number | undefined];
};
