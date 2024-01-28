import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
	selector: 'app-dashboard',
	template: `
		<div class="c-screen-size">
			<!-- header -->
			<app-header-container class="hidden sm:block" />

			<div class="hidden sm:block max-sm:py-4">
				<mat-divider class="sm:hidden"></mat-divider>
			</div>

			<!-- routing -->
			<mat-tab-nav-panel #tabPanel>
				<router-outlet></router-outlet>
			</mat-tab-nav-panel>

			<!-- empty footer -->
			<footer></footer>
		</div>
	`,
	styles: [
		`
			:host {
				@apply block min-h-full;

				//background: linear-gradient(168.19deg, #02171b 1.34%, #011717 1.35%, #011a1a 33.36%, #021919 52.32%, #041a1a 98.93%);
				background: var(--background-dashboard);
				color: var(--gray-light);
				padding: 24px;
				background-attachment: fixed;
				min-height: 100vh;
			}

			.c-screen-size {
				max-width: 1980px;

				@screen lg {
					margin: auto;
					width: 95%;
				}

				@screen 2xl {
					margin: auto;
					width: 90%;
				}

				@screen 2xl {
					margin: auto;
					width: 85%;
				}
			}

			footer {
				height: 15px;

				@screen sm {
					height: 30px;
				}
			}
		`,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {}
