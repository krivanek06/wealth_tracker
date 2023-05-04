import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { PieChartComponent, ValuePresentationCardComponent } from '../../../../shared/components';
import { ChartType, GenericChartSeriesPie } from '../../../../shared/models';
import { AccountState } from '../../models';

@Component({
	selector: 'app-personal-account-overview-chart-mobile',
	standalone: true,
	imports: [CommonModule, PieChartComponent, ValuePresentationCardComponent],
	templateUrl: './personal-account-overview-chart-mobile.component.html',
	styleUrls: ['./personal-account-overview-chart-mobile.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonalAccountOverviewChartMobileComponent {
	@Input() accountState!: AccountState | null;
	@Input() chartData!: GenericChartSeriesPie | null;

	ChartType = ChartType;
}
