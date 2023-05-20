import { ApplicationRef, Component, OnInit } from '@angular/core';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { concat, filter, first, interval } from 'rxjs';
import { DialogServiceUtil } from './shared/dialogs';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
	constructor(dialogServiceUtil: DialogServiceUtil, private swUpdate: SwUpdate, private appRef: ApplicationRef) {}

	ngOnInit() {
		this.updateWatcher();
		this.checkServiceWorkerUpdate();
	}

	private checkServiceWorkerUpdate() {
		this.swUpdate.versionUpdates
			.pipe(filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY'))
			.subscribe(async () => {
				if (await DialogServiceUtil.showConfirmDialog('New version is available. Load New Version?')) {
					console.log('reloading');
					window.location.reload();
				}
			});
	}

	private updateWatcher() {
		// Allow the app to stabilize first, before starting
		// polling for updates with `interval()`.
		const appIsStable$ = this.appRef.isStable.pipe(first((isStable) => isStable === true));
		const everySixHours$ = interval(6 * 60 * 60 * 1000);
		const everySixHoursOnceAppIsStable$ = concat(appIsStable$, everySixHours$);

		everySixHoursOnceAppIsStable$.subscribe(async () => {
			try {
				const updateFound = await this.swUpdate.checkForUpdate();
				console.log(updateFound ? 'A new version is available.' : 'Already on the latest version.');
			} catch (err) {
				console.error('Failed to check for updates:', err);
			}
		});
	}
}
