import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { firstValueFrom, Observable } from 'rxjs';
import { InvestmentAccountFacadeApiService, PersonalAccountFacadeService } from '../../../../core/api';
import {
	AccountIdentification,
	AccountType,
	InvestmentAccountOverviewFragment,
	PersonalAccountOverviewFragment,
} from '../../../../core/graphql';
import { requiredValidator } from '../../../../shared/models';
import { GeneralAccountTypeInputSource } from '../../models';
import { DialogServiceUtil } from './../../../../shared/dialogs';

@Component({
	selector: 'app-manager-account-list-accounts',
	templateUrl: './manager-account-list-accounts.component.html',
	styleUrls: ['./manager-account-list-accounts.component.scss'],
})
export class ManagerAccountListAccountsComponent implements OnInit {
	personalAccounts$!: Observable<PersonalAccountOverviewFragment[]>;
	investmentAccounts$!: Observable<InvestmentAccountOverviewFragment[]>;

	// control to select from existing account
	selectedAccountControl = new FormControl<AccountIdentification | null>(null);

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
		private personalAccountFacadeService: PersonalAccountFacadeService,
		private investmentAccountFacadeApiService: InvestmentAccountFacadeApiService
	) {}

	ngOnInit(): void {
		this.personalAccounts$ = this.personalAccountFacadeService.getPersonalAccounts();
		this.investmentAccounts$ = this.investmentAccountFacadeApiService.getInvestmentAccounts();

		this.selectedAccountControl.valueChanges.subscribe((value) => {
			this.showSelectAccount = !value;
			this.accountForm.setValue({
				accountName: value?.name || null,
				accountType: value?.accountType || null,
			});
		});

		this.accountForm.valueChanges.subscribe(console.log);
	}

	onCancelClick(): void {
		this.showSelectAccount = true;
		this.selectedAccountControl.patchValue(null);
	}

	async onSubmit(): Promise<void> {
		this.accountForm.markAllAsTouched();
		const accountName = this.accountForm.controls.accountName.value;
		const accountType = this.accountForm.controls.accountType.value;
		const selectedAccountControl = this.selectedAccountControl.value;
		const isEditing = !!selectedAccountControl;

		if (this.accountForm.invalid || !accountName || !accountType) {
			return;
		}

		this.showLoader = true;

		// create new personal account
		if (!isEditing && accountType === AccountType.PersonalAccount) {
			await firstValueFrom(this.personalAccountFacadeService.createPersonalAccount(accountName));
			DialogServiceUtil.showNotificationBar(`Personal account ${accountName} has been created`, 'success');
		}

		// edit personal account
		else if (isEditing && accountType === AccountType.PersonalAccount) {
			console.log('personal account edit');
			await firstValueFrom(
				this.personalAccountFacadeService.editPersonalAccount({
					id: selectedAccountControl.id,
					name: accountName,
				})
			);
			DialogServiceUtil.showNotificationBar(`PErsonal account ${accountName} has been edited`, 'success');
		}

		// create new investment account
		else if (!isEditing && accountType === AccountType.InvestmentAccount) {
			await firstValueFrom(this.investmentAccountFacadeApiService.createInvestmentAccount(accountName));
			DialogServiceUtil.showNotificationBar(`Investment account ${accountName} has been created`, 'success');
		}

		// edit investment account
		else if (isEditing && accountType === AccountType.InvestmentAccount) {
			await firstValueFrom(
				this.investmentAccountFacadeApiService.editInvestmentAccount({
					name: accountName,
					investmentAccountId: selectedAccountControl.id,
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

	async onDeleteAccountClick(account: AccountIdentification): Promise<void> {
		if (account.accountType === AccountType.PersonalAccount) {
			await firstValueFrom(this.personalAccountFacadeService.deletePersonalAccount(account.id));
		} else if (account.accountType === AccountType.InvestmentAccount) {
			await firstValueFrom(this.investmentAccountFacadeApiService.deleteInvestmentAccount(account.id));
		}

		this.onCancelClick();
		DialogServiceUtil.showNotificationBar(`Account ${account.name} has been removed`, 'success');
	}
}
