import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { combineLatest, map, Observable } from 'rxjs';
import { FormMatInputWrapperModule } from '../../../../shared/components';
import { PersonalAccountParent } from '../../classes';
import {
	PersonalAccountDailyEntriesTableModule,
	PersonalAccountExpensesByTagComponent,
	PersonalAccountOverviewChartMobileComponent,
} from '../../components';
import { AccountState, NO_DATE_SELECTED } from '../../models';
import { GetTagByIdPipe } from '../../pipes';
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
		PersonalAccountDailyEntriesTableModule,
		MatCheckboxModule,
		MatDividerModule,
		PersonalAccountExpensesByTagComponent,
		MatButtonModule,
		MatIconModule,
		GetTagByIdPipe,
	],
})
export class PersonalAccountMobileViewComponent extends PersonalAccountParent implements OnInit {
	/**
	 * Current state based on whether the user wants to see total aggregated info or filtered by month/week
	 */
	accountDisplayedState$!: Observable<AccountState>;
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
