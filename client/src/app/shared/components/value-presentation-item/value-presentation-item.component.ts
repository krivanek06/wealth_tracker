import { ChangeDetectionStrategy, Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ValuePresentItem } from '../../models';

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
export class ValuePresentationItemComponent<T> implements OnInit, ControlValueAccessor {
	@Input() items: ValuePresentItem<T>[] | null = [];
	@Input() itemKey!: keyof T;
	@Input() multiSelect = true;
	@Input() isFlexRow = true;

	activeItems: T[] = [];

	onChange: (data?: T[]) => void = () => {};
	onTouched = () => {};

	constructor() {}

	ngOnInit(): void {}

	onClick(item: T): void {
		const inArray = this.activeItems.find((d) => d[this.itemKey] === item[this.itemKey]);
		if (inArray) {
			this.activeItems = this.activeItems.filter((d) => d[this.itemKey] !== item[this.itemKey]);
		} else {
			if (!this.multiSelect) {
				this.activeItems = [item];
			} else {
				this.activeItems = [...this.activeItems, item];
			}
		}

		// notify parent
		this.onChange(this.activeItems);
	}

	writeValue(tags: T[]): void {
		this.activeItems = [...tags];
	}

	/**
	 * Register Component's ControlValueAccessor onChange callback
	 */
	registerOnChange(fn: ValuePresentationItemComponent<T>['onChange']): void {
		this.onChange = fn;
	}

	/**
	 * Register Component's ControlValueAccessor onTouched callback
	 */
	registerOnTouched(fn: ValuePresentationItemComponent<T>['onTouched']): void {
		this.onTouched = fn;
	}
}
