import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ValuePresentationCardComponent } from '../../../../shared/components';
import { AccountState } from './../../../../core/api';

@Component({
	selector: 'app-personal-account-account-state',
	standalone: true,
	imports: [CommonModule, ValuePresentationCardComponent],
	template: `
		<!-- balance -->
		<app-value-presentation-card title="Balance" [showDataInCard]="true">
			<div *ngIf="accountState && !loading; else loadingState" class="c-text">{{ accountState.total | currency }}</div>
		</app-value-presentation-card>

		<!-- income -->
		<app-value-presentation-card title="Income" [showDataInCard]="true">
			<div *ngIf="accountState && !loading; else loadingState" class="c-text">
				{{ accountState.incomeTotal | currency }}
			</div>
		</app-value-presentation-card>

		<!-- expenses -->
		<app-value-presentation-card title="Expenses" [showDataInCard]="true">
			<div *ngIf="accountState && !loading; else loadingState" class="c-text">
				{{ accountState.expenseTotal | currency }}
			</div>
		</app-value-presentation-card>

		<!-- entries -->
		<app-value-presentation-card title="Entries" [showDataInCard]="true">
			<div *ngIf="accountState && !loading; else loadingState" class="c-text">{{ accountState.entriesTotal }}</div>
		</app-value-presentation-card>

		<ng-template #loadingState>
			<div class="h-6 mt-2 g-skeleton"></div>
		</ng-template>
	`,
	styles: [
		`
			:host {
				@apply grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 lg:gap-8;

				.c-text {
					@apply text-xl xl:text-2xl text-center text-white mt-2;
				}

				app-value-presentation-card {
					@apply flex-1;
				}
			}
		`,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonalAccountAccountStateComponent {
	@Input() accountState?: AccountState | null;
	@Input() loading = false;
}
