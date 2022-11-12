import { ChangeDetectionStrategy, Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {
	PersonalAccountAggregationDataOutput,
	PersonalAccountTagFragment,
	TagDataType,
} from './../../../../core/graphql';

@Component({
	selector: 'app-value-presentation-item',
	templateUrl: './value-presentation-item.component.html',
	styleUrls: ['./value-presentation-item.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => ValuePresentationItemComponent),
			multi: true,
		},
	],
})
export class ValuePresentationItemComponent implements OnInit, ControlValueAccessor {
	@Input() yearlyExpenseTags: PersonalAccountAggregationDataOutput[] | null = null;
	@Input() yearlyExpenseTotal: number | null = null;

	activeTags: PersonalAccountTagFragment[] = [];

	TagDataType = TagDataType;

	onChange: (data?: PersonalAccountTagFragment[]) => void = () => {};
	onTouched = () => {};

	constructor() {}

	ngOnInit(): void {}

	onClick(tag: PersonalAccountTagFragment): void {
		const inArray = this.activeTags.find((d) => d.id === tag.id);
		if (inArray) {
			this.activeTags = this.activeTags.filter((d) => d.id !== tag.id);
		} else {
			this.activeTags = [...this.activeTags, tag];
		}

		// notify parent
		this.onChange(this.activeTags);
	}

	writeValue(tags: PersonalAccountTagFragment[]): void {
		this.activeTags = [...tags];
	}

	/**
	 * Register Component's ControlValueAccessor onChange callback
	 */
	registerOnChange(fn: ValuePresentationItemComponent['onChange']): void {
		this.onChange = fn;
	}

	/**
	 * Register Component's ControlValueAccessor onTouched callback
	 */
	registerOnTouched(fn: ValuePresentationItemComponent['onTouched']): void {
		this.onTouched = fn;
	}
}
