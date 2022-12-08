import { ChangeDetectionStrategy, Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { GeneralAccounts } from '../../../models';

@Component({
	selector: 'app-list-accounts',
	templateUrl: './list-accounts.component.html',
	styleUrls: ['./list-accounts.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => ListAccountsComponent),
			multi: true,
		},
	],
})
export class ListAccountsComponent implements OnInit, ControlValueAccessor {
	@Input() personalAccounts!: GeneralAccounts[] | null;
	@Input() investmentAccounts!: GeneralAccounts[] | null;

	selectedAccountControl = new FormControl<GeneralAccounts[]>([], { nonNullable: true });

	onChange: (data: GeneralAccounts) => void = () => {};
	onTouched = () => {};

	constructor() {}

	ngOnInit(): void {
		this.selectedAccountControl.valueChanges.subscribe((accounts) => this.onChange(accounts[0]));
	}

	writeValue(obj: any): void {}

	/**
	 * Register Component's ControlValueAccessor onChange callback
	 */
	registerOnChange(fn: ListAccountsComponent['onChange']): void {
		this.onChange = fn;
	}

	/**
	 * Register Component's ControlValueAccessor onTouched callback
	 */
	registerOnTouched(fn: ListAccountsComponent['onTouched']): void {
		this.onTouched = fn;
	}

	setDisabledState?(isDisabled: boolean): void {
		throw new Error('Method not implemented.');
	}
}
