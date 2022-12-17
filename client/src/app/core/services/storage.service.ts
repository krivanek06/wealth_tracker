export abstract class StorageService<T> {
	private storageKey: string;

	constructor(key: string) {
		this.storageKey = key;
	}

	saveData(data: T): void {
		localStorage.setItem(this.storageKey, JSON.stringify(data));
	}

	getData(): T | null {
		const data = localStorage.getItem(this.storageKey);

		if (!data) {
			return null;
		}

		const result = JSON.parse(data);

		return result;
	}

	removeData() {
		localStorage.removeItem(this.storageKey);
	}
}
