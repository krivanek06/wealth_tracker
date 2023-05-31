import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Capacitor } from '@capacitor/core';

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

	get isPlatformWeb(): boolean {
		return Capacitor.getPlatform() === 'web';
	}
}
