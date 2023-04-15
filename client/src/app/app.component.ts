import { Component, OnInit } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { DialogServiceUtil } from './shared/dialogs';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
	constructor(dialogServiceUtil: DialogServiceUtil, private swUpdate: SwUpdate) {}

	ngOnInit(): void {
		// this.checkServiceWorkerUpdate();
	}

	private checkServiceWorkerUpdate() {
		if (this.swUpdate.isEnabled) {
			this.swUpdate.versionUpdates.subscribe(() => {
				if (confirm('New version available. Load New Version?')) {
					window.location.reload();
				}
			});
		}
	}
}
