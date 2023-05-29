import { ApplicationRef, ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { Observable, concat, filter, first, interval } from 'rxjs';
import { AccountManagerApiService } from '../../core/api';
import { AccountManagerRoutes } from '../../core/models';
import { DialogServiceUtil } from '../../shared/dialogs';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
	availableAccounts$!: Observable<AccountManagerRoutes[]>;

	constructor(
		private managerAccountApiService: AccountManagerApiService,
		private swUpdate: SwUpdate,
		private appRef: ApplicationRef
	) {}

	ngOnInit(): void {
		this.availableAccounts$ = this.managerAccountApiService.getAvailableAccountRoutes();

		if (this.swUpdate.isEnabled) {
			this.updateWatcher();
			this.checkServiceWorkerUpdate();
		}
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
