import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, QueryList, ViewChildren } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
	ExpanderComponent,
	ScrollWrapperModule,
	ValuePresentationButtonControlComponent,
} from '../../../../shared/components';
import { RangeDirective } from '../../../../shared/directives';
import { ArrayReversePipe } from '../../../../shared/pipes';
import { PersonalAccountParent } from '../../classes';
import {
	PersonalAccountAccountGrowthChartComponent,
	PersonalAccountAccountStateComponent,
	PersonalAccountActionButtonsComponent,
	PersonalAccountDailyEntriesFilterComponent,
	PersonalAccountDailyEntriesTableComponent,
	PersonalAccountExpenseChartComponent,
	PersonalAccountExpensePieChartComponent,
	PersonalAccountExpensesByTagComponent,
} from '../../components';
import { PersonalAccountDailyDataEntryModule, PersonalAccountTagManagerModalModule } from '../../modals';
import { PersonalAccountDesktopViewSkeletonComponent } from './personal-account-desktop-view-skeleton/personal-account-desktop-view-skeleton.component';

enum ChartExpand {
	EXPENSE = 'expense',
	GROWTH = 'growth',
}
@Component({
	selector: 'app-personal-account-desktop-view',
	standalone: true,
	imports: [
		CommonModule,
		PersonalAccountDesktopViewSkeletonComponent,
		ValuePresentationButtonControlComponent,
		ScrollWrapperModule,
		PersonalAccountExpenseChartComponent,
		ReactiveFormsModule,
		PersonalAccountDailyEntriesTableComponent,
		MatButtonModule,
		MatIconModule,
		PersonalAccountDailyDataEntryModule,
		PersonalAccountDailyEntriesFilterComponent,
		PersonalAccountAccountStateComponent,
		PersonalAccountExpensePieChartComponent,
		PersonalAccountAccountGrowthChartComponent,
		PersonalAccountActionButtonsComponent,
		PersonalAccountTagManagerModalModule,
		PersonalAccountExpensesByTagComponent,
		ExpanderComponent,
		RangeDirective,
		ArrayReversePipe,
	],
	template: `
		<ng-container *ngIf="personalAccountSignal() as personalAccountDetails; else showSkeleton">
			<!-- account total state -->
			<div class="flex flex-col justify-between gap-x-8 gap-y-8 lg:flex-row">
				<app-personal-account-account-state
					class="md:basis-3/4"
					[accountState]="accountTotalState()"
				></app-personal-account-account-state>

				<app-personal-account-action-buttons
					(deselectTagsClickedEmitter)="onDeselectTags()"
					[showDeselectTags]="selectedTagIds().length > 0"
				/>
			</div>

			<!-- tag expense legend -->
			<app-scroll-wrapper>
				<app-value-presentation-button-control
					[formControl]="filterDailyDataGroup.controls.selectedTagIds"
					[items]="yearlyExpenseTags()"
					itemKey="id"
					[selectWholeItem]="false"
				></app-value-presentation-button-control>
			</app-scroll-wrapper>

			<div class="grid gap-4" [ngClass]="{ '2xl:grid-cols-2': !expandedChart, '2xl:grid-cols-1': !!expandedChart }">
				<!-- account overview chart -->
				<div *ngIf="!expandedChart || expandedChart === ChartExpand.EXPENSE">
					<app-expander
						class="hidden 2xl:block"
						(onExpendClickEmitter)="onExpandChartClick(ChartExpand.EXPENSE)"
						[isExpanded]="expandedChart === ChartExpand.EXPENSE"
					></app-expander>
					<app-personal-account-tag-spending-chart
						#dataChart
						[accountOverviewChartData]="accountOverviewChartData()"
						[expenseTagsChartData]="totalExpenseTagsChartData()"
						[categories]="categories()"
						[heightPx]="525"
					></app-personal-account-tag-spending-chart>
				</div>

				<!-- expense chart -->
				<div *ngIf="!expandedChart || expandedChart === ChartExpand.GROWTH">
					<app-expander
						class="hidden 2xl:block"
						(onExpendClickEmitter)="onExpandChartClick(ChartExpand.GROWTH)"
						[isExpanded]="expandedChart === ChartExpand.GROWTH"
						classes="-mb-8 pr-6"
					></app-expander>
					<app-personal-account-account-growth-chart
						#dataChart
						[accountOverviewChartData]="accountOverviewChartData()"
						[categories]="categories()"
						[heightPx]="525"
					></app-personal-account-account-growth-chart>
				</div>
			</div>

			<!-- date filter control -->
			<div class="md:px-8">
				<app-personal-account-daily-entries-filter
					(addDailyEntryClickEmitter)="onDailyEntryClick(null)"
					[formControl]="filterDailyDataGroup.controls.dateFilter"
					[weeklyAggregations]="weeklyAggregations()"
				></app-personal-account-daily-entries-filter>
			</div>

			<div *ngIf="!isDateSourceNoDate()" class="grid items-center grid-cols-1 gap-4 md:px-8 lg:grid-cols-4">
				<!-- table body -->
				<div class="relative z-10 h-full lg:col-span-2">
					<app-personal-account-daily-entries-table
						(editDailyEntryClickEmitter)="onDailyEntryClick($event)"
						[personalAccountDailyData]="filteredDailyData() | arrayReverse"
					></app-personal-account-daily-entries-table>
				</div>

				<!-- spending allocation by tags -->
				<div class="lg:col-span-2 lg:-mt-12">
					<app-personal-account-expense-pie-chart
						class="scale-150"
						[series]="personalAccountExpensePieChart()"
						[displayValue]="accountFilteredState().total"
					></app-personal-account-expense-pie-chart>
				</div>
			</div>

			<!-- displayed expense by tag -->
			<div class="mt-6">
				<h2 *ngIf="!isDateSourceNoDate()" class="space-x-2">
					<span>Date:</span>
					<span class="text-wt-gray-medium">{{
						filterDailyDataGroup.controls.dateFilter.value | date : 'MMMM d, y'
					}}</span>
				</h2>
				<app-personal-account-expenses-by-tag
					[expenses]="accountTagAggregationForTimePeriod().expenses"
					[disabledClick]="true"
					[hideBudgeting]="isDateSourceNoDate()"
				></app-personal-account-expenses-by-tag>
			</div>
		</ng-container>

		<!-- page skeleton -->
		<ng-template #showSkeleton>
			<app-personal-account-desktop-view-skeleton></app-personal-account-desktop-view-skeleton>
		</ng-template>
	`,
	styles: [
		`
			:host {
				@apply flex flex-col gap-y-8;
			}
		`,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonalAccountDesktopViewComponent extends PersonalAccountParent {
	@ViewChildren('dataChart') dataChart!: QueryList<any>;
	expandedChart: ChartExpand | null = null;
	ChartExpand = ChartExpand;

	onExpandChartClick(chart: ChartExpand): void {
		if (chart === ChartExpand.EXPENSE && this.expandedChart === ChartExpand.EXPENSE) {
			this.expandedChart = null;
		} else if (chart === ChartExpand.GROWTH && this.expandedChart === ChartExpand.GROWTH) {
			this.expandedChart = null;
		} else {
			this.expandedChart = chart;
		}

		// wrapping chart redrawing into setTimeout to resize it properly
		setTimeout(() => {
			this.dataChart.forEach((d) => {
				d.chart.reflow();
			});
		}, 0);
	}
}
