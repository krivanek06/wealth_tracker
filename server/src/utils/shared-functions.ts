import { v4 as uuid } from 'uuid';

export class SharedServiceUtil {
	static getUUID(): string {
		return uuid();
	}

	static round2Dec(value: number): number {
		return Math.round(value * 100) / 100;
	}
}
