import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, computed } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import {
	FormMatInputWrapperModule,
	PieChartComponent,
	ValuePresentationCardComponent,
} from '../../../../shared/components';
import { RangeDirective } from '../../../../shared/directives';
import { PersonalAccountParent } from '../../classes';
import {
	PersonalAccountAccountStateComponent,
	PersonalAccountActionButtonsComponent,
	PersonalAccountDailyEntriesFilterComponent,
	PersonalAccountDailyEntriesTableComponent,
	PersonalAccountDailyEntriesTableMobileComponent,
	PersonalAccountDisplayToggleComponent,
	PersonalAccountExpensesByTagComponent,
	PersonalAccountOverviewChartMobileComponent,
} from '../../components';
import { NO_DATE_SELECTED } from '../../models';
import { GetTagByIdPipe } from '../../pipes';
import { PersonalAccountMobileViewSkeletonComponent } from './personal-account-mobile-view-skeleton/personal-account-mobile-view-skeleton.component';
@Component({
	selector: 'app-personal-account-mobile-view',
	template: `
		<ng-container *ngIf="personalAccountSignal() as personalAccountDetails; else showSkeleton">
			<!-- account info -->
			<div class="mb-6">
				<app-personal-account-account-state
					[accountState]="accountDisplayedState()"
				></app-personal-account-account-state>
			</div>

			<!-- expense chart -->
			<div class="-mt-12">
				<app-pie-chart
					class="scale-110"
					[series]="personalAccountExpensePieChart()"
					[displayValue]="accountDisplayedState().total"
				></app-pie-chart>
			</div>

			<!-- settings -->
			<div class="relative z-10 flex justify-start mb-4 -mt-4">
				<app-personal-account-action-buttons
					displayType="menu"
					(buttonClickEmitter)="onActionButtonClick($event)"
				></app-personal-account-action-buttons>
			</div>

			<div class="my-4">
				<mat-divider></mat-divider>
			</div>

			<!-- date filter control -->
			<app-personal-account-daily-entries-filter
				(addDailyEntryClickEmitter)="onDailyEntryClick(null)"
				[formControl]="filterDailyDataGroup.controls.dateFilter"
				[weeklyAggregations]="weeklyAggregations()"
			></app-personal-account-daily-entries-filter>

			<!-- title & show history checkbox -->
			<div class="flex justify-end mt-2 mb-6">
				<app-personal-account-display-toggle
					*ngIf="!isDateSourceNoDate"
					[formControl]="showHistoryFormControl"
					[selectedTag]="filterDailyDataGroup.controls.selectedTagIds.value[0] | getTagById"
				></app-personal-account-display-toggle>
			</div>

			<!-- tag aggregation -->
			<app-personal-account-expenses-by-tag
				*ngIf="!showHistoryFormControl.value"
				[formControl]="filterDailyDataGroup.controls.selectedTagIds"
				[expenses]="accountTagAggregationForTimePeriod().expenses"
				[incomes]="accountTagAggregationForTimePeriod().incomes"
				[multiple]="false"
				[disabledClick]="isDateSourceNoDate()"
				[hideBudgeting]="isDateSourceNoDate()"
			></app-personal-account-expenses-by-tag>

			<!-- historical data -->
			<app-personal-account-daily-entries-table-mobile
				*ngIf="showHistoryFormControl.value"
				[personalAccountDailyData]="dailyDataAggregation()"
				(editDailyEntryClickEmitter)="onDailyEntryClick($event)"
			></app-personal-account-daily-entries-table-mobile>
		</ng-container>

		<!-- page skeleton -->
		<ng-template #showSkeleton>
			<app-personal-account-mobile-view-skeleton></app-personal-account-mobile-view-skeleton>
		</ng-template>
	`,
	styles: [
		`
			:host {
				display: block;
			}
		`,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [
		CommonModule,
		FormMatInputWrapperModule,
		ReactiveFormsModule,
		PersonalAccountOverviewChartMobileComponent,
		PersonalAccountDailyEntriesTableComponent,
		MatCheckboxModule,
		MatDividerModule,
		PersonalAccountExpensesByTagComponent,
		MatButtonModule,
		MatIconModule,
		GetTagByIdPipe,
		PieChartComponent,
		ValuePresentationCardComponent,
		PersonalAccountAccountStateComponent,
		PersonalAccountDisplayToggleComponent,
		PersonalAccountDailyEntriesTableMobileComponent,
		PersonalAccountActionButtonsComponent,
		PersonalAccountDailyEntriesFilterComponent,
		PersonalAccountMobileViewSkeletonComponent,
		RangeDirective,
	],
})
export class PersonalAccountMobileViewComponent extends PersonalAccountParent implements OnInit {
	/**
	 * Current state based on whether the user wants to see total aggregated info or filtered by month/week
	 */
	accountDisplayedState = computed(() =>
		this.dateSource() === NO_DATE_SELECTED ? this.accountTotalState() : this.accountFilteredState()
	);

	/**
	 * daily data divided by dates: PersonalAccountDailyDataAggregation
	 */
	dailyDataAggregation = computed(() =>
		this.personalAccountDataService.aggregateDailyDataOutputByDays(this.filteredDailyData())
	);

	showHistoryFormControl = new FormControl<boolean>(false, { nonNullable: true });

	ngOnInit(): void {
		// this.accountDisplayedState$ = combineLatest([
		// 	this.dateSource$,
		// 	this.accountTotalState$,
		// 	this.accountFilteredState$,
		// ]).pipe(
		// 	map(([dateFilter, accountTotal, accountFiltered]) =>
		// 		dateFilter === NO_DATE_SELECTED ? accountTotal : accountFiltered
		// 	)
		// );

		// this.dailyDataAggregation$ = this.filteredDailyData$.pipe(
		// 	map((res) => this.personalAccountDataService.aggregateDailyDataOutputByDays(res))
		// );

		// on every change of the date filter, reset show history
		// this.accountTagAggregationForTimePeriod$
		// 	.pipe(takeUntil(this.destroy$))
		// 	.subscribe(() => this.showHistoryFormControl.setValue(false));

		// check show history when selecting a tagId
		this.filterDailyDataGroup.controls.selectedTagIds.valueChanges.subscribe((value) => {
			if (value.length !== 0) {
				this.showHistoryFormControl.patchValue(true);
			}
		});

		// on history click reset selected tagIds
		this.showHistoryFormControl.valueChanges.subscribe((checked) => {
			if (!checked) {
				this.filterDailyDataGroup.controls.selectedTagIds.patchValue([]);
			}
		});
	}
}
