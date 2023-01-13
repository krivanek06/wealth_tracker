import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { PersonalAccountParent } from '../../classes';
import { PersonalAccountOverviewChartModule } from '../../components';
import { PersonalAccountDailyDataContainerComponent } from '../../containers';
import { GenericChartModule, ScrollWrapperModule, ValuePresentationItemModule } from './../../../../shared/components';
import { ChartType } from './../../../../shared/models';

@Component({
	selector: 'app-personal-account-desktop-view',
	standalone: true,
	imports: [
		CommonModule,
		PersonalAccountDailyDataContainerComponent,
		GenericChartModule,
		ValuePresentationItemModule,
		ScrollWrapperModule,
		PersonalAccountOverviewChartModule,
		ReactiveFormsModule,
	],
	templateUrl: './personal-account-desktop-view.component.html',
	styleUrls: ['./personal-account-desktop-view.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonalAccountDesktopViewComponent extends PersonalAccountParent implements OnInit {
	ChartType = ChartType;

	constructor() {
		super();
	}

	ngOnInit(): void {
		console.log('ON INIT');

		this.accountOverviewChartData$.subscribe((x) => console.log('accountOverviewChartData$', x));
	}
}
