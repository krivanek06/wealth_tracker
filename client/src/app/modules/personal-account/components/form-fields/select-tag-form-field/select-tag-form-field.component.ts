import { ChangeDetectionStrategy, Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DisplayTagFormField } from '../../../models';
import { PersonalAccountTagFragment } from './../../../../../core/graphql';

@Component({
	selector: 'app-select-tag-form-field',
	templateUrl: './select-tag-form-field.component.html',
	styleUrls: ['./select-tag-form-field.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => SelectTagFormFieldComponent),
			multi: true,
		},
	],
})
export class SelectTagFormFieldComponent implements OnInit, ControlValueAccessor {
	@Input() displayTags?: DisplayTagFormField[] | null;
	@Input() multiSelect = false;

	selectedTagsControl = new FormControl<PersonalAccountTagFragment[]>([], {
		nonNullable: true,
	});
	selectedTagControl = new FormControl<PersonalAccountTagFragment | null>(null, {
		nonNullable: true,
	});

	onChange: (data?: PersonalAccountTagFragment[]) => void = () => {
		/** empty */
	};
	// onTouched callback that will be overridden using `registerOnTouched`
	onTouched = () => {
		/** empty */
	};

	constructor() {}

	ngOnInit(): void {
		// multi select
		this.selectedTagsControl.valueChanges.subscribe((values) => {
			this.onChange(values);
		});

		// single select
		this.selectedTagControl.valueChanges.subscribe((value) => {
			const emitingValue = !!value ? [value] : [];
			this.onChange(emitingValue);
		});
	}

	writeValue(obj: any): void {
		this.selectedTagsControl.patchValue([], { emitEvent: false, onlySelf: true });
		this.selectedTagControl.patchValue(null, { emitEvent: false, onlySelf: true });
	}
	/**
	 * Register Component's ControlValueAccessor onChange callback
	 */
	registerOnChange(fn: SelectTagFormFieldComponent['onChange']): void {
		this.onChange = fn;
	}

	/**
	 * Register Component's ControlValueAccessor onTouched callback
	 */
	registerOnTouched(fn: SelectTagFormFieldComponent['onTouched']): void {
		this.onTouched = fn;
	}
}
