import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { PersonalAccountTagFragment, TagDataType } from './../../../../../core/graphql';

@Component({
	selector: 'app-daily-data-entry-display-elements',
	templateUrl: './daily-data-entry-display-elements.component.html',
	styleUrls: ['./daily-data-entry-display-elements.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DailyDataEntryDisplayElementsComponent implements OnInit {
	@Input() tagType: TagDataType | null = null;
	@Input() tag: PersonalAccountTagFragment[] | null = null;
	@Input() value: number | null = null;
	@Input() time: Date | null = null;
	@Input() date: Date | null = null;

	TagDataType = TagDataType;

	constructor() {}

	ngOnInit(): void {}
}
