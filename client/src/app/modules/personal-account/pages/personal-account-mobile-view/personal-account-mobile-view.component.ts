import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { FormMatInputWrapperModule } from '../../../../shared/components';
import { PersonalAccountParent } from '../../classes';
import { PersonalAccountDailyEntriesTableModule, PersonalAccountOverviewChartMobileComponent } from '../../components';
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
	],
})
export class PersonalAccountMobileViewComponent extends PersonalAccountParent implements OnInit {
	showHistoryFormControl = new FormControl<boolean>(true, { nonNullable: true });

	constructor() {
		super();
	}

	ngOnInit(): void {}
}
