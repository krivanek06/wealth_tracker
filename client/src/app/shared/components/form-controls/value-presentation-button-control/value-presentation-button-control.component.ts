import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { DefaultImgDirective } from '../../../directives';
import { ValuePresentItem } from '../../../models';
import { InArrayPipe } from '../../../pipes';

@Component({
	selector: 'app-value-presentation-button-control',
	templateUrl: './value-presentation-button-control.component.html',
	styleUrls: ['./value-presentation-button-control.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [CommonModule, MatButtonModule, DefaultImgDirective, InArrayPipe],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => ValuePresentationButtonControlComponent),
			multi: true,
		},
	],
})
export class ValuePresentationButtonControlComponent<T> implements OnInit, ControlValueAccessor {
	@Input() items: ValuePresentItem<T>[] | null = [];
	@Input() itemKey!: keyof T;
	@Input() multiSelect = true;
	@Input() isFlexRow = true;

	/**
	 * put to false if you want to notify the parent only by <keyof T> or false for <T>
	 */
	@Input() selectWholeItem = true;

	activeItems: T[] = [];

	/**
	 * parent can be notified by the whole object <T[]> or by its key <T[keyof T][]>
	 */
	onChange: (data?: T[] | T[keyof T][]) => void = () => {};
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
		if (this.selectWholeItem) {
			this.onChange(this.activeItems);
		} else {
			const keyValue = this.activeItems.map((d) => d[this.itemKey]);
			this.onChange(keyValue);
		}
	}

	writeValue(items: T[]): void {
		this.activeItems = [...items];
	}

	/**
	 * Register Component's ControlValueAccessor onChange callback
	 */
	registerOnChange(fn: ValuePresentationButtonControlComponent<T>['onChange']): void {
		this.onChange = fn;
	}

	/**
	 * Register Component's ControlValueAccessor onTouched callback
	 */
	registerOnTouched(fn: ValuePresentationButtonControlComponent<T>['onTouched']): void {
		this.onTouched = fn;
	}
}
