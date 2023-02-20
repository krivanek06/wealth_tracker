import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ControlContainer, FormControl } from '@angular/forms';
import { MatOptionSelectionChange } from '@angular/material/core';
import { DateFilterFn } from '@angular/material/datepicker';
import { InputSource, InputSourceWrapper, InputType, InputTypeDateTimePickerConfig, InputTypeEnum } from '../../models';
@Component({
	selector: 'app-form-mat-input-wrapper',
	templateUrl: './form-mat-input-wrapper.component.html',
	styleUrls: ['./form-mat-input-wrapper.component.scss'],
})
export class FormMatInputWrapperComponent implements OnInit, OnChanges {
	@Input() controlName!: string;
	@Input() inputCaption!: string;
	@Input() prefixIcon?: string;
	@Input() inputType: InputTypeEnum | InputType = 'TEXT';
	@Input() inputAutoComplete = true;

	/*
		disable input source
	  */
	@Input() disabled = false;

	/*
		display hint text for input
	  */
	@Input() hintText?: string;

	/*
		 data which are displayed in Select.option
		 use only if inputType === 'SELECT' | 'MULTISELECT' | 'SELECTSEARCH'
	  */
	@Input() inputSource?: InputSource[] | null = [];

	/*
    user only when inputType ==== 'SELECT_SOURCE_WRAPPER
  */
	@Input() inputSourceWrapper?: InputSourceWrapper[] | null = [];

	/*
		used when inputType === DATEPICKER
	*/
	@Input() inputTypeDateTimePickerConfig?: InputTypeDateTimePickerConfig;
	// only used if InputTypeDateTimePickerConfig.dateFilter is not present
	defaultDateFilter: DateFilterFn<any> = (d: Date) => true;

	formInputControl!: FormControl;

	InputType = InputTypeEnum;

	selectedInputSource?: InputSource; // ONLY USED FOR inputType === SELECT

	constructor(private controlContainer: ControlContainer) {}

	get usedFormControl(): FormControl {
		return this.formInputControl;
	}

	get shouldBeErrorsShowed(): boolean | null {
		if (!this.usedFormControl) {
			return false;
		}

		return this.usedFormControl.errors && (this.usedFormControl.touched || this.usedFormControl.dirty);
	}

	ngOnInit(): void {}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes?.['controlName']?.currentValue) {
			this.formInputControl = this.controlContainer.control?.get(this.controlName) as FormControl;
		}

		if (changes?.['inputSourceWrapper']?.currentValue) {
			this.selectedInputSource = this.inputSourceWrapper
				?.flatMap((d) => d.items)
				.find((d) => d.value === this.formInputControl.value);
		}

		// when in editing we patch value into selectedInputSource m we want to find a value
		// form inputSource to display image (flag, etc.)
		if (
			(this.inputType === InputTypeEnum.SELECT || this.inputType === InputTypeEnum.SELECTSEARCH) &&
			!!this.formInputControl &&
			!!this.inputSource
		) {
			this.selectedInputSource = this.inputSource.find((d) => d.value === this.formInputControl.value);
		}
	}

	onSelectChange(inputSource: InputSource, e: MatOptionSelectionChange) {
		// prevent double execution
		if (e.isUserInput) {
			this.selectedInputSource = inputSource;
		}
	}
}
