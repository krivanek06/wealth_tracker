import {
	Component,
	ElementRef,
	EventEmitter,
	Input,
	OnChanges,
	OnInit,
	Output,
	SimpleChanges,
	ViewChild,
} from '@angular/core';
import { ControlContainer, FormControl } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { first } from 'rxjs/operators';
import { InputSource, InputType, InputTypeDateTimePickerConfig, InputTypeEnum } from '../../models';

@Component({
	selector: 'app-form-mat-input-wrapper',
	templateUrl: './form-mat-input-wrapper.component.html',
	styleUrls: ['./form-mat-input-wrapper.component.scss'],
})
export class FormMatInputWrapperComponent implements OnInit, OnChanges {
	/* emits only if showCloseIcon === true &&  inputType === 'TEXT' */
	@Output() resetInputValueEmitter: EventEmitter<void> = new EventEmitter<void>();

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
	@Input() inputSource?: InputSource[] | null = []; //s
	@Input() fieldsetAdditionalClasses = '';

	/*
		use only if inputType === 'TEXT'
	  */
	@Input() showCloseIcon = false;

	/*
		used when inputType === DATEPICKER
	*/
	@Input() inputTypeDateTimePickerConfig?: InputTypeDateTimePickerConfig;

	@ViewChild('matSearchSelectInput') matSearchSelectInput?: ElementRef<HTMLInputElement>;

	selectedInputSource?: InputSource; // ONLY USED FOR inputType === SELECT

	formInputControl!: FormControl;

	InputType = InputTypeEnum;

	private copyInputSource: InputSource[] = []; // storing original inputSource when filtering in inputType === MULTISELECT

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

	resetValue(): void {
		this.resetInputValueEmitter.emit();
	}

	toggleButton(): void {
		this.formInputControl.patchValue(!this.formInputControl.value);
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

	/*
	 * clear input when multi select is closed
	 **/
	closedSearchSelect(): void {
		this.inputSource = [...this.copyInputSource];
		if (this.matSearchSelectInput) {
			this.matSearchSelectInput.nativeElement.value = '';
		}
	}

	selectOption(event: MatSelectChange): void {
		if (!this.inputSource) {
			return;
		}

		this.selectedInputSource = this.inputSource.find((s) => s.value === event.source.value);
	}

	private findSelectedInputSource(): void {
		this.selectedInputSource = this.inputSource?.find((s) => s.value === this.formInputControl.value);

		/*
		  even if we find selectedInputSource, still listen on change
		  used to be a bug when edited an entity, we patched a 'null' value into form as a default value,
		  but after we patched a value from the entity it did not show the correct value
		*/
		this.formInputControl.valueChanges.pipe(first((res) => !!res)).subscribe((res) => {
			this.selectedInputSource = this.inputSource?.find((s) => s.value === res);
		});
	}
}
