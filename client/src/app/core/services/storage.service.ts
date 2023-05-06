import { inject } from '@angular/core';
import { PlatformService } from './platform.service';

export abstract class StorageService<T> {
	private storageKey: string;

	platform = inject(PlatformService);

	constructor(key: string) {
		this.storageKey = key;
	}

	saveData(data: T): void {
		if (this.platform.isServer) {
			return;
		}

		localStorage.setItem(this.storageKey, JSON.stringify(data));
	}

	getData(): T | null {
		if (this.platform.isServer) {
			return null;
		}

		const data = localStorage.getItem(this.storageKey);

		if (!data) {
			return null;
		}

		const result = JSON.parse(data);

		return result;
	}

	removeData() {
		if (this.platform.isServer) {
			return;
		}

		localStorage.removeItem(this.storageKey);
	}
}
