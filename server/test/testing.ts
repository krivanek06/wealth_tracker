import { differenceInDays } from 'date-fns';

const getDayDifference = (first: string | Date | number, second: string | Date | number): number => {
	const firstDate = new Date(first);
	const secondDate = new Date(second);
	return differenceInDays(firstDate, secondDate);
};

const one = new Date(2022, 10, 20);
const second = new Date(2022, 10, 22);
console.log(Math.abs(getDayDifference(one, second)));
