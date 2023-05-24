import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { LoggedUserOutputFragment } from '../../graphql';
import { STORAGE_AUTH_ACCESS_TOKEN } from '../../models';
import { StorageService } from '../../services/storage.service';

@Injectable({
	providedIn: 'root',
})
export class TokenStorageService extends StorageService<LoggedUserOutputFragment> {
	private accessToken = new BehaviorSubject<LoggedUserOutputFragment | null>(null);

	constructor() {
		super(STORAGE_AUTH_ACCESS_TOKEN);
	}

	getAccessToken(): Observable<LoggedUserOutputFragment | null> {
		return this.accessToken.asObservable();
	}

	getTokenFromLocalStorage(): LoggedUserOutputFragment | null {
		return this.getData();
	}

	setAccessToken(token: LoggedUserOutputFragment | null): void {
		this.accessToken.next(token);

		if (token) {
			this.saveData(token);
		} else {
			this.removeData();
		}
	}
}
