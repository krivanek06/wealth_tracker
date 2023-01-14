import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { filter } from 'rxjs';
import { AccountIdentification } from '../../../core/graphql';

@Component({
	selector: 'app-dashboard-navigation',
	standalone: true,
	imports: [CommonModule, MatSelectModule, MatFormFieldModule, ReactiveFormsModule, MatTabsModule],
	templateUrl: './dashboard-navigation.component.html',
	styleUrls: ['./dashboard-navigation.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => DashboardNavigationComponent),
			multi: true,
		},
	],
})
export class DashboardNavigationComponent implements OnInit, ControlValueAccessor {
	@Input() availableAccounts!: AccountIdentification[];

	accountFormControl = new FormControl<AccountIdentification | null>(null, { nonNullable: true });

	onChange: (data: AccountIdentification) => void = () => {};
	onTouched = () => {};

	constructor() {}

	ngOnInit(): void {
		// notify parent on account change
		this.accountFormControl.valueChanges
			.pipe(filter((res): res is AccountIdentification => !!res))
			.subscribe((res) => this.onChange(res));
	}

	onSelectChange(change: MatTabChangeEvent) {
		const selectedAccount = this.availableAccounts.find((account, index) => index === change.index);
		if (selectedAccount) {
			this.accountFormControl.patchValue(selectedAccount);
		}
	}

	writeValue(obj: AccountIdentification): void {
		this.accountFormControl.patchValue(obj, { emitEvent: false });
	}

	/**
	 * Register Component's ControlValueAccessor onChange callback
	 */
	registerOnChange(fn: DashboardNavigationComponent['onChange']): void {
		this.onChange = fn;
	}

	/**
	 * Register Component's ControlValueAccessor onTouched callback
	 */
	registerOnTouched(fn: DashboardNavigationComponent['onTouched']): void {
		this.onTouched = fn;
	}
}
