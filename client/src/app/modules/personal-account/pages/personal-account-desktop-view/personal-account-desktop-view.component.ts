import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
	ExpanderComponent,
	FormMatInputWrapperModule,
	PieChartComponent,
	ScrollWrapperModule,
	ValuePresentationButtonControlComponent,
} from '../../../../shared/components';
import { RangeDirective } from '../../../../shared/directives';
import { PersonalAccountParent } from '../../classes';
import {
	PersonalAccountAccountGrowthChartComponent,
	PersonalAccountAccountStateComponent,
	PersonalAccountActionButtonsComponent,
	PersonalAccountDailyEntriesFilterComponent,
	PersonalAccountDailyEntriesTableComponent,
	PersonalAccountExpenseChartComponent,
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
		FormMatInputWrapperModule,
		PersonalAccountDailyEntriesFilterComponent,
		PersonalAccountAccountStateComponent,
		PieChartComponent,
		PersonalAccountAccountGrowthChartComponent,
		PersonalAccountActionButtonsComponent,
		PersonalAccountTagManagerModalModule,
		PersonalAccountExpensesByTagComponent,
		ExpanderComponent,
		RangeDirective,
	],
	template: `
		<ng-container *ngIf="personalAccountDetails$ | async as personalAccountDetails; else showSkeleton">
			<!-- account total state -->
			<div
				*ngIf="accountTotalState$ | async as accountTotalState"
				class="flex flex-col justify-between gap-x-8 gap-y-8 lg:flex-row"
			>
				<app-personal-account-account-state
					class="md:basis-3/4"
					[accountState]="accountTotalState"
				></app-personal-account-account-state>

				<app-personal-account-action-buttons
					(buttonClickEmitter)="onActionButtonClick($event)"
				></app-personal-account-action-buttons>
			</div>

			<!-- tag expense legend -->
			<app-scroll-wrapper>
				<app-value-presentation-button-control
					[formControl]="filterDailyDataGroup.controls.selectedTagIds"
					[items]="yearlyExpenseTags$ | async"
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
						[accountOverviewChartData]="accountOverviewChartData$ | async"
						[expenseTagsChartData]="totalExpenseTagsChartData$ | async"
						[categories]="categories$ | async"
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
						[accountOverviewChartData]="accountOverviewChartData$ | async"
						[categories]="categories$ | async"
						[heightPx]="525"
					></app-personal-account-account-growth-chart>
				</div>
			</div>

			<!-- date filter control -->
			<div class="md:px-8">
				<app-personal-account-daily-entries-filter
					(addDailyEntryClickEmitter)="onDailyEntryClick(null)"
					[formControl]="filterDailyDataGroup.controls.dateFilter"
					[personalAccountDetails]="personalAccountDetails"
				></app-personal-account-daily-entries-filter>
			</div>

			<ng-container
				*ngIf="{
					accountFilteredState: accountFilteredState$ | async,
					filteredDailyData: filteredDailyData$ | async,
					filteredDailyDataLoaded: filteredDailyDataLoaded$ | async,
					personalAccountExpensePieChart: personalAccountExpensePieChart$ | async,
					accountTagAggregationForTimePeriod: accountTagAggregationForTimePeriod$ | async
				} as obs"
			>
				<ng-container *ngIf="obs.filteredDailyDataLoaded; else filteredDataSkeleton">
					<div *ngIf="!isDateSourceNoDate" class="grid items-center grid-cols-1 gap-4 md:px-8 lg:grid-cols-4">
						<!-- table body -->
						<div class="relative z-10 h-full lg:col-span-2">
							<app-personal-account-daily-entries-table
								(editDailyEntryClickEmitter)="onDailyEntryClick($event)"
								[personalAccountDailyData]="obs.filteredDailyData"
							></app-personal-account-daily-entries-table>
						</div>

						<!-- spending allocation by tags -->
						<div class="lg:col-span-2 lg:-mt-12">
							<app-pie-chart
								class="scale-150"
								[series]="obs.personalAccountExpensePieChart"
								[displayValue]="obs.accountFilteredState?.total"
							></app-pie-chart>
						</div>
					</div>

					<!-- displayed expense by tag -->
					<div class="mt-6">
						<h2 *ngIf="!isDateSourceNoDate" class="space-x-2">
							<span>Date:</span>
							<span class="text-wt-gray-medium">{{
								filterDailyDataGroup.controls.dateFilter.value | date: 'MMMM d, y'
							}}</span>
						</h2>
						<app-personal-account-expenses-by-tag
							[expenses]="obs.accountTagAggregationForTimePeriod?.expenses ?? []"
							[disabledClick]="true"
							[hideBudgeting]="isDateSourceNoDate"
						></app-personal-account-expenses-by-tag>
					</div>
				</ng-container>
			</ng-container>
		</ng-container>

		<!-- page skeleton -->
		<ng-template #showSkeleton>
			<app-personal-account-desktop-view-skeleton></app-personal-account-desktop-view-skeleton>
		</ng-template>

		<!-- filter table skeleton -->
		<ng-template #filteredDataSkeleton>
			<div class="grid items-center grid-cols-1 gap-4 mb-8 lg:grid-cols-4 md:px-8">
				<!-- table body -->
				<div class="h-full lg:col-span-2">
					<div *ngRange="12" class="g-skeleton h-[52px] w-full mb-2"></div>
				</div>

				<!-- spending allocation by tags -->
				<div class="lg:col-span-2 h-[250px] w-full lg:w-10/12 g-skeleton lg:mx-auto">
					<div></div>
				</div>
			</div>

			<!-- displayed expense by tag -->
			<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				<div class="w-full g-skeleton h-[95px] md:h-[110px]" *ngRange="12"></div>
			</div>
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
export class PersonalAccountDesktopViewComponent extends PersonalAccountParent implements OnInit {
	@ViewChildren('dataChart') dataChart!: QueryList<any>;
	expandedChart: ChartExpand | null = null;
	ChartExpand = ChartExpand;

	constructor() {
		super();
	}

	ngOnInit(): void {}

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
				this.cd.detectChanges();
			});
		}, 0);
	}
}
