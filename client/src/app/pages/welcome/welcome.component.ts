import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { STORAGE_MAIN_KEY } from '../../core/models';
import { PlatformService } from '../../core/services/platform.service';
import { environment } from './../../../environments/environment';

@Component({
	selector: 'app-welcome',
	templateUrl: './welcome.component.html',
	styleUrls: ['./welcome.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WelcomeComponent implements OnInit {
	constructor(
		private apollo: Apollo,
		private http: HttpClient,
		private platform: PlatformService,
		@Inject(DOCUMENT) private document: Document
	) {}

	ngOnInit(): void {
		if (!this.platform.isServer) {
			console.log('reset local storage');
			// clear graphql cache
			this.apollo.client.resetStore();

			// clear local storage
			localStorage.removeItem(STORAGE_MAIN_KEY);

			// remove light theme
			this.document.body.classList.remove('light-theme');
		}

		// start backend
		this.http.get(`${environment.backend_url}/public/start`).subscribe((data) => {
			console.log(`Application starting: ${data}`);
		});
	}
}
