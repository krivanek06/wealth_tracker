import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, forwardRef, Input, OnInit, Output } from '@angular/core';
import { ControlValueAccessor, FormControl, FormGroup, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormMatInputWrapperModule } from '../../../../shared/components';
import { InputSource } from '../../../../shared/models';

@Component({
	selector: 'app-investment-account-action-buttons',
	standalone: true,
	imports: [CommonModule, MatButtonModule, MatIconModule, FormMatInputWrapperModule, ReactiveFormsModule],
	templateUrl: './investment-account-action-buttons.component.html',
	styleUrls: ['./investment-account-action-buttons.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => InvestmentAccountActionButtonsComponent),
			multi: true,
		},
	],
})
export class InvestmentAccountActionButtonsComponent implements OnInit, ControlValueAccessor {
	@Output() addEmitter = new EventEmitter<void>();
	@Output() showHistoryEmitter = new EventEmitter<void>();

	@Input() sectorAllocationInputSource?: InputSource[] | null;

	formGroup = new FormGroup({
		selectedSector: new FormControl<string | null>(null),
	});

	onChange: (data: InputSource) => void = () => {};
	onTouched = () => {};

	ngOnInit() {
		this.formGroup.controls.selectedSector.valueChanges.subscribe((sectorName) => {
			const value = this.sectorAllocationInputSource?.find((d) => d.value === sectorName);
			if (value) {
				this.onChange(value);
			}
		});
	}

	onAddClick(): void {
		this.addEmitter.emit();
	}

	onShowHistoryClick(): void {
		this.showHistoryEmitter.emit();
	}

	writeValue(items: any): void {
		// maybe create later
	}

	/**
	 * Register Component's ControlValueAccessor onChange callback
	 */
	registerOnChange(fn: InvestmentAccountActionButtonsComponent['onChange']): void {
		this.onChange = fn;
	}

	/**
	 * Register Component's ControlValueAccessor onTouched callback
	 */
	registerOnTouched(fn: InvestmentAccountActionButtonsComponent['onTouched']): void {
		this.onTouched = fn;
	}
}
