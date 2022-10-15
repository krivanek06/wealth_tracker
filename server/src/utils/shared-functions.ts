import { v4 as uuid } from 'uuid';

export class SharedServiceUtil {
	static getUUID(): string {
		return uuid();
	}
}
