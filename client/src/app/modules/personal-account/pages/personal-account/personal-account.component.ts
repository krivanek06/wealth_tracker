import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
	selector: 'app-personal-account',
	template: `
		<!-- mobile view -->
		<div class="sm:hidden">
			<app-personal-account-mobile-view></app-personal-account-mobile-view>
		</div>

		<!-- desktop view -->
		<div class="hidden sm:block">
			<app-personal-account-desktop-view></app-personal-account-desktop-view>
		</div>
	`,
	styles: [
		`
			:host {
				display: block;
				overflow-x: hidden;
			}
		`,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonalAccountComponent {}
