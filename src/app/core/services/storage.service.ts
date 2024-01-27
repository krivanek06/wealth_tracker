import { inject } from '@angular/core';
import {
	EMPTY_STORAGE_SERVICE_STRUCTURE,
	STORAGE_MAIN_KEY,
	StorageServiceStructure,
	StorageServiceStructureKeys,
} from '../models';
import { PlatformService } from './platform.service';

export class StorageService<T> {
	private storageKey: StorageServiceStructureKeys;

	platform = inject(PlatformService);

	constructor(key: StorageServiceStructureKeys) {
		this.storageKey = key;
	}

	saveData(data: T): void {
		if (this.platform.isServer) {
			return;
		}

		const savedData = this.getDataFromLocalStorage();
		const newData = { [this.storageKey]: data };
		const mergedData = JSON.stringify({ ...savedData, ...newData });

		localStorage.setItem(STORAGE_MAIN_KEY, mergedData);
	}

	getData(): T | null {
		const data = this.getDataFromLocalStorage();
		return data[this.storageKey] || null;
	}

	removeData() {
		if (this.platform.isServer) {
			return;
		}

		const data = this.getDataFromLocalStorage();
		const newData = { ...data, [this.storageKey]: null };
		localStorage.setItem(STORAGE_MAIN_KEY, JSON.stringify(newData));
	}

	clearLocalStorage() {
		localStorage.removeItem(STORAGE_MAIN_KEY);
	}

	private getDataFromLocalStorage(): StorageServiceStructure {
		if (this.platform.isServer) {
			return EMPTY_STORAGE_SERVICE_STRUCTURE;
		}

		const data = localStorage.getItem(STORAGE_MAIN_KEY) || '{}';
		return JSON.parse(data);
	}
}
