import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { firstValueFrom, Observable } from 'rxjs';
import {
	AccountManagerApiService,
	InvestmentAccountFacadeApiService,
	PersonalAccountFacadeService,
} from '../../../../core/api';
import { AccountIdentification, AccountIdentificationFragment, AccountType } from '../../../../core/graphql';
import { requiredValidator } from '../../../../shared/models';
import { ACCOUNT_NAMES, GeneralAccountTypeInputSource } from '../../models';
import { DialogServiceUtil } from './../../../../shared/dialogs';
@Component({
	selector: 'app-manager-account-list-accounts',
	templateUrl: './manager-account-list-accounts.component.html',
	styleUrls: ['./manager-account-list-accounts.component.scss'],
})
export class ManagerAccountListAccountsComponent implements OnInit {
	availableAccounts$!: Observable<AccountIdentificationFragment[]>;

	ACCOUNT_NAMES = ACCOUNT_NAMES;

	// control to select from existing account
	selectedAccountControl = new FormControl<[AccountIdentification] | null>(null);

	// form to edit account or create new
	accountForm = new FormGroup({
		accountName: new FormControl<string | null>(null, { validators: requiredValidator }),
		accountType: new FormControl<AccountType | null>(null, { validators: requiredValidator }),
	});

	// if true then shows mat-select for existing accounts
	showSelectAccount = true;

	// if true then on save a loader is spinning
	showLoader = false;

	GeneralAccountTypeInputSource = GeneralAccountTypeInputSource;

	constructor(
		private accountManagerApiService: AccountManagerApiService,
		private personalAccountFacadeService: PersonalAccountFacadeService,
		private investmentAccountFacadeApiService: InvestmentAccountFacadeApiService
	) {}

	ngOnInit(): void {
		this.availableAccounts$ = this.accountManagerApiService.getAvailableAccounts();

		this.selectedAccountControl.valueChanges.subscribe((value) => {
			const data = value && value[0];
			this.showSelectAccount = !value;
			this.accountForm.setValue({
				accountName: data?.name || null,
				accountType: data?.accountType || null,
			});
		});
	}

	onCancelClick(): void {
		this.showSelectAccount = true;
		this.selectedAccountControl.patchValue(null);
	}

	async onSubmit(): Promise<void> {
		this.accountForm.markAllAsTouched();
		const accountName = this.accountForm.controls.accountName.value;
		const accountType = this.accountForm.controls.accountType.value;
		const selectedAccountControl = this.selectedAccountControl.value && this.selectedAccountControl.value[0];
		const isEditing = !!selectedAccountControl;

		if (this.accountForm.invalid || !accountName || !accountType) {
			return;
		}

		this.showLoader = true;

		// create new personal account
		if (!isEditing && accountType === AccountType.Personal) {
			await firstValueFrom(this.personalAccountFacadeService.createPersonalAccount(accountName));
			DialogServiceUtil.showNotificationBar(`Personal account ${accountName} has been created`, 'success');
		}

		// edit personal account
		else if (isEditing && accountType === AccountType.Personal) {
			console.log('personal account edit');
			await firstValueFrom(
				this.personalAccountFacadeService.editPersonalAccount({
					name: accountName,
				})
			);
			DialogServiceUtil.showNotificationBar(`PErsonal account ${accountName} has been edited`, 'success');
		}

		// create new investment account
		else if (!isEditing && accountType === AccountType.Investment) {
			await firstValueFrom(this.investmentAccountFacadeApiService.createInvestmentAccount(accountName));
			DialogServiceUtil.showNotificationBar(`Investment account ${accountName} has been created`, 'success');
		}

		// edit investment account
		else if (isEditing && accountType === AccountType.Investment) {
			await firstValueFrom(
				this.investmentAccountFacadeApiService.editInvestmentAccount({
					name: accountName,
				})
			);
			DialogServiceUtil.showNotificationBar(`Investment account ${accountName} has been edited`, 'success');
		}

		this.showLoader = false;
		this.showSelectAccount = true;
	}

	onCreateNewAccountClick(): void {
		this.showSelectAccount = false;
	}

	async onDeleteAccountClick(): Promise<void> {
		const account = this.selectedAccountControl.value && this.selectedAccountControl.value[0];

		if (!account) {
			return;
		}

		if (account.accountType === AccountType.Personal) {
			await firstValueFrom(this.personalAccountFacadeService.deletePersonalAccount());
		} else if (account.accountType === AccountType.Investment) {
			await firstValueFrom(this.investmentAccountFacadeApiService.deleteInvestmentAccount());
		}

		this.onCancelClick();
		DialogServiceUtil.showNotificationBar(`Account ${account.name} has been removed`, 'success');
	}
}
