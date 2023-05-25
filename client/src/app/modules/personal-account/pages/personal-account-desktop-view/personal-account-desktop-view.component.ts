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
	PersonalAccountExpensesByTagComponent,
	PersonalAccountTagSpendingChartComponent,
} from '../../components';
import { PersonalAccountDailyDataEntryModule, PersonalAccountTagManagerModalModule } from '../../modals';
import { DateFormatterPipe } from '../../pipes';
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
		PersonalAccountTagSpendingChartComponent,
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
		DateFormatterPipe,
		ExpanderComponent,
		RangeDirective,
	],
	templateUrl: './personal-account-desktop-view.component.html',
	styleUrls: ['./personal-account-desktop-view.component.scss'],
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
