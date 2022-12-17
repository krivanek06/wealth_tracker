import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class TokenStorageService {
	private accessToken = new BehaviorSubject<string | null>(null);

	constructor() {}

	getAccessToken(): string | null {
		return this.accessToken.value;
	}

	setAccessToken(token: string): void {
		this.accessToken.next(token);
	}
}
