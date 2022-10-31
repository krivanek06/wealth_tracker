import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PersonalAccountAggregationDataOutput } from './../../../../core/graphql';

@Component({
	selector: 'app-value-presentation-item',
	templateUrl: './value-presentation-item.component.html',
	styleUrls: ['./value-presentation-item.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ValuePresentationItemComponent implements OnInit {
	@Output() onClickEmitter: EventEmitter<void> = new EventEmitter<void>();

	@Input() yearlyAggregation!: PersonalAccountAggregationDataOutput;
	@Input() yearlyExpenseTotal!: number;
	@Input() isActive = false;

	color!: string;
	colorActive!: string;

	constructor() {}

	ngOnInit(): void {
		this.color = this.yearlyAggregation.tagColor ?? 'grey';
		this.colorActive = `${this.color}33`;
	}

	onActivate(): void {
		this.onClickEmitter.emit();
	}
}
