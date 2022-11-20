import { v4 as uuid } from 'uuid';

export class SharedServiceUtil {
	static getUUID(): string {
		return uuid();
	}

	static roundDec(value: number, decimal = 2): number {
		const decimalRounder = 10 * decimal;
		return Math.round(value * decimalRounder) / decimalRounder;
	}
}
