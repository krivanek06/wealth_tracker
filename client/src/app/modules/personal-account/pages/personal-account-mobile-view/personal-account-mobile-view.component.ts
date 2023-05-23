import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { Observable, combineLatest, map } from 'rxjs';
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
import { AccountState, NO_DATE_SELECTED, PersonalAccountDailyDataAggregation } from '../../models';
import { GetTagByIdPipe } from '../../pipes';
import { PersonalAccountMobileViewSkeletonComponent } from './personal-account-mobile-view-skeleton/personal-account-mobile-view-skeleton.component';
@Component({
	selector: 'app-personal-account-mobile-view',
	templateUrl: './personal-account-mobile-view.component.html',
	styleUrls: ['./personal-account-mobile-view.component.scss'],
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
	accountDisplayedState$!: Observable<AccountState>;

	/**
	 * daily data divided by dates
	 */
	dailyDataAggregation$!: Observable<PersonalAccountDailyDataAggregation[]>;

	showHistoryFormControl = new FormControl<boolean>(false, { nonNullable: true });

	constructor() {
		super();
	}

	ngOnInit(): void {
		this.accountDisplayedState$ = combineLatest([
			this.dateSource$,
			this.accountTotalState$,
			this.accountFilteredState$,
		]).pipe(
			map(([dateFilter, accountTotal, accountFiltered]) =>
				dateFilter === NO_DATE_SELECTED ? accountTotal : accountFiltered
			)
		);

		this.dailyDataAggregation$ = this.filteredDailyData$.pipe(
			map((res) => this.personalAccountDataService.aggregateDailyDataOutputByDays(res))
		);

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
