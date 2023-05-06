import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class PlatformService {
	private platformId: Object;
	constructor(@Inject(PLATFORM_ID) platformId: Object) {
		this.platformId = platformId;
	}

	get isBrowser(): boolean {
		return isPlatformBrowser(this.platformId);
	}

	get isServer(): boolean {
		return isPlatformServer(this.platformId);
	}
}
