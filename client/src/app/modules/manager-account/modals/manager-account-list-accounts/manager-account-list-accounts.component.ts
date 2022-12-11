import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { firstValueFrom, Observable } from 'rxjs';
import { InvestmentAccountFacadeApiService, PersonalAccountFacadeService } from '../../../../core/api';
import { InvestmentAccountOverviewFragment, PersonalAccountOverviewBasicFragment } from '../../../../core/graphql';
import { requiredValidator } from '../../../../shared/models';
import {
	GeneralAccounts,
	GeneralAccountType,
	GeneralAccountTypeInputSource,
	getGeneralAccountType,
} from '../../models';
import { DialogServiceUtil } from './../../../../shared/dialogs/dialog-service.util';

@Component({
	selector: 'app-manager-account-list-accounts',
	templateUrl: './manager-account-list-accounts.component.html',
	styleUrls: ['./manager-account-list-accounts.component.scss'],
	//changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManagerAccountListAccountsComponent implements OnInit {
	personalAccounts$!: Observable<PersonalAccountOverviewBasicFragment[]>;
	investmentAccounts$!: Observable<InvestmentAccountOverviewFragment[]>;

	// control to select from existing account
	selectedAccountControl = new FormControl<GeneralAccounts | null>(null);

	// form to edit account or create new
	accountForm = new FormGroup({
		accountName: new FormControl<string | null>(null, { validators: requiredValidator }),
		accountType: new FormControl<GeneralAccountType | null>(null, { validators: requiredValidator }),
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
				accountType: getGeneralAccountType(value),
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
		if (!isEditing && accountType === GeneralAccountType.PERSONAL_ACCOUNT) {
			await firstValueFrom(this.personalAccountFacadeService.createPersonalAccount(accountName));
			DialogServiceUtil.showNotificationBar(`Personal account ${accountName} has been created`, 'success');
		}

		// edit personal account
		else if (isEditing && accountType === GeneralAccountType.PERSONAL_ACCOUNT) {
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
		else if (!isEditing && accountType === GeneralAccountType.INVESTMENT_ACCOUNT) {
			await firstValueFrom(this.investmentAccountFacadeApiService.createInvestmentAccount(accountName));
			DialogServiceUtil.showNotificationBar(`Investment account ${accountName} has been created`, 'success');
		}

		// edit investment account
		else if (isEditing && accountType === GeneralAccountType.INVESTMENT_ACCOUNT) {
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

	async onDeleteAccountClick(account: GeneralAccounts): Promise<void> {
		if (account.__typename === 'PersonalAccount') {
			await firstValueFrom(this.personalAccountFacadeService.deletePersonalAccount(account.id));
		} else if (account.__typename === 'InvestmentAccount') {
			await firstValueFrom(this.investmentAccountFacadeApiService.deleteInvestmentAccount(account.id));
		}

		this.onCancelClick();
		DialogServiceUtil.showNotificationBar(`Account ${account.name} has been removed`, 'success');
	}
}
