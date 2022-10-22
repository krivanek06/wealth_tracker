import { Injectable } from '@angular/core';
import { first } from 'rxjs';
import { PersonalAccountApiService } from '../api';

@Injectable({
	providedIn: 'root',
})
export class PreloadDataService {
	constructor(private personalAccountApiService: PersonalAccountApiService) {
		// TODO: preload only when user is authenticated
		this.personalAccountApiService.getDefaultTags().pipe(first()).subscribe(console.log);
		this.personalAccountApiService.getPersonalAccounts().pipe(first()).subscribe(console.log);
	}
}
