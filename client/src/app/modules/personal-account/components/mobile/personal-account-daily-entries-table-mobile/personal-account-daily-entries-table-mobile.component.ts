import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { PersonalAccountDailyDataAggregation } from '../../../models';
import { TagDataType } from './../../../../../core/graphql';
import { DefaultImgDirective } from './../../../../../shared/directives';

@Component({
	selector: 'app-personal-account-daily-entries-table-mobile',
	standalone: true,
	imports: [CommonModule, ScrollingModule, MatListModule, MatDividerModule, DefaultImgDirective],
	templateUrl: './personal-account-daily-entries-table-mobile.component.html',
	styleUrls: ['./personal-account-daily-entries-table-mobile.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonalAccountDailyEntriesTableMobileComponent {
	@Input() personalAccountDailyData?: PersonalAccountDailyDataAggregation[] | null;

	TagDataType = TagDataType;
}
