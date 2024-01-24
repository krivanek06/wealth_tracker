import { CommonModule, DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { STORAGE_MAIN_KEY } from '../../core/models';
import { PlatformService } from '../../core/services/platform.service';
import { WelcomeHeroComponent } from './welcome-hero.component';

@Component({
	selector: 'app-welcome',
	template: ` <app-welcome-hero></app-welcome-hero> `,
	styles: [
		`
			:host {
				display: block;
				background-color: black;
				overflow: hidden;
			}
		`,
	],
	standalone: true,
	imports: [CommonModule, WelcomeHeroComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WelcomeComponent implements OnInit {
	constructor(
		private platform: PlatformService,
		@Inject(DOCUMENT) private document: Document
	) {}

	ngOnInit(): void {
		if (!this.platform.isServer) {
			console.log('reset local storage');

			// clear local storage
			localStorage.removeItem(STORAGE_MAIN_KEY);

			// remove light theme
			this.document.body.classList.remove('light-theme');
		}

		// init google auth
		// GoogleAuth.initialize();
	}
}
