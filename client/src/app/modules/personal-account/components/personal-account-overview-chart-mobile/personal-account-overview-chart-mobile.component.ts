import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ValuePresentationCardComponent } from '../../../../shared/components';
import { GenericChartSeriesPie } from '../../../../shared/models';
import { PersonalAccountExpensePieChartComponent } from '../charts';
import { AccountState } from './../../../../core/api';

@Component({
	selector: 'app-personal-account-overview-chart-mobile',
	standalone: true,
	imports: [CommonModule, PersonalAccountExpensePieChartComponent, ValuePresentationCardComponent],
	template: `
		<div class="relative">
			<!-- expense -->
			<div class="absolute top-[0] left-[-5%]">
				<app-value-presentation-card title="Expense" [showDataInCard]="false">
					<div class="text-xl text-center text-white">{{ accountState?.expenseTotal | currency }}</div>
				</app-value-presentation-card>
			</div>

			<!-- income -->
			<div class="absolute top-[0] right-[-5%]">
				<app-value-presentation-card title="Income" [showDataInCard]="false">
					<div class="text-xl text-center text-white">{{ accountState?.incomeTotal | currency }}</div>
				</app-value-presentation-card>
			</div>

			<!-- expense chart -->
			<div class="p-8">
				<app-personal-account-expense-pie-chart
					*ngIf="chartData"
					chartTitlePosition="center"
					[series]="chartData"
				></app-personal-account-expense-pie-chart>
			</div>

			<!-- balance -->
			<div class="absolute top-[37%] left-[30%]">
				<app-value-presentation-card title="Balance" [showDataInCard]="false">
					<div class="text-xl text-center text-white">{{ accountState?.total | currency }}</div>
				</app-value-presentation-card>
			</div>

			<!-- entries -->
			<div class="absolute bottom-[4%] left-[-2%]">
				<app-value-presentation-card title="Entries" [showDataInCard]="false">
					<div class="text-xl text-center text-white">{{ accountState?.entriesTotal }}</div>
				</app-value-presentation-card>
			</div>
		</div>
	`,
	styles: [
		`
			:host {
				display: block;
			}
		`,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonalAccountOverviewChartMobileComponent {
	@Input() accountState!: AccountState | null;
	@Input() chartData!: GenericChartSeriesPie | null;
}
