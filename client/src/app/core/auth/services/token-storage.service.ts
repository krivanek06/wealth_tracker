import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class TokenStorageService {
	private accessToken = new BehaviorSubject<string | null>(null);

	constructor() {}

	setAccessToken(token: string): void {
		this.accessToken.next(token);
	}
}
