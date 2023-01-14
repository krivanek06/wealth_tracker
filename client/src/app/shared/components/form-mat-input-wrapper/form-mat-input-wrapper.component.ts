import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ControlContainer, FormControl } from '@angular/forms';
import { DateFilterFn } from '@angular/material/datepicker';
import { map, Observable } from 'rxjs';
import { startWith } from 'rxjs/operators';
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

	@ViewChild('matSearchSelectInput') matSearchSelectInput?: ElementRef<HTMLInputElement>;

	selectedInputSource$?: Observable<InputSource | undefined>; // ONLY USED FOR inputType === SELECT

	formInputControl!: FormControl;

	InputType = InputTypeEnum;

	private copyInputSource: InputSource[] = []; // storing original inputSource when filtering in inputType === MULTISELECT
	private copyInputSourceWrapper: InputSourceWrapper[] = [];

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

		if (changes?.['inputSource']?.currentValue) {
			this.copyInputSource = [...(changes?.['inputSource']?.currentValue as InputSource[])];
		}

		if (changes?.['inputSourceWrapper']?.currentValue) {
			this.copyInputSourceWrapper = [...(changes?.['inputSourceWrapper']?.currentValue as InputSourceWrapper[])];
		}

		// when in editing we patch value into selectedInputSource m we want to find a value
		// form inputSource to display image (flag, etc.)
		if (
			(this.inputType === InputTypeEnum.SELECT || this.inputType === InputTypeEnum.SELECTSEARCH) &&
			!!this.formInputControl &&
			!!this.inputSource
		) {
			this.findSelectedInputSource();
		}
	}

	/*
	 * used when inputType === MULTISELECT to filter data
	 * */
	multiSelectKeyPress(event: any): void {
		const value = event.target?.value;
		this.inputSource = this.copyInputSource.filter((inputSource) =>
			inputSource.caption.toString().toLowerCase().startsWith(value.toLowerCase())
		);
	}

	multiSelectKeyPressWrapper(event: any): void {
		const value = event.target?.value;
		this.inputSourceWrapper = this.copyInputSourceWrapper.filter((inputSource) =>
			inputSource.name.toString().toLowerCase().startsWith(value.toLowerCase())
		);
	}

	/*
	 * clear input when multi select is closed
	 **/
	closedSearchSelect(): void {
		this.inputSource = [...this.copyInputSource];
		if (this.matSearchSelectInput) {
			this.matSearchSelectInput.nativeElement.value = '';
		}
	}

	private findSelectedInputSource(): void {
		this.selectedInputSource$ = this.formInputControl.valueChanges.pipe(
			startWith(this.formInputControl.value),
			map((value) => this.inputSource?.find((s) => s.value === value))
		);
	}
}
