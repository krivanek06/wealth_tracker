import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class NotificationProgressService {
	private currectValue$: Subject<number> = new Subject();

	constructor() {}

	getCurrentValue(): Observable<number> {
		return this.currectValue$.asObservable();
	}

	setCurrentValue(value: number): void {
		this.currectValue$.next(value);
	}
}
