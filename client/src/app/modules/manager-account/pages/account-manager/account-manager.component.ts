import { ChangeDetectionStrategy, Component } from '@angular/core';
import { firstValueFrom, map, Observable } from 'rxjs';
import { Confirmable } from 'src/app/shared/decorators';
import {
	AccountManagerApiService,
	InvestmentAccountFacadeApiService,
	PersonalAccountFacadeService,
} from '../../../../core/api';
import { AccountIdentificationFragment, AccountType } from '../../../../core/graphql';
import { AccountManagerEdit, ACCOUNT_NAMES, ACCOUNT_NAME_OPTIONS } from '../../models';
import { DialogServiceUtil } from './../../../../shared/dialogs/dialog-service.util';

@Component({
	selector: 'app-account-manager',
	templateUrl: './account-manager.component.html',
	styleUrls: ['./account-manager.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountManagerComponent {
	availableAccounts$!: Observable<AccountIdentificationFragment[]>;

	creatingAccounts$!: Observable<AccountType[]>;

	ACCOUNT_NAMES = ACCOUNT_NAMES;

	constructor(
		private managerAccountApiService: AccountManagerApiService,
		private personalAccountFacadeService: PersonalAccountFacadeService,
		private investmentAccountFacadeApiService: InvestmentAccountFacadeApiService
	) {}

	ngOnInit(): void {
		this.availableAccounts$ = this.managerAccountApiService.getAvailableAccounts();

		this.creatingAccounts$ = this.availableAccounts$.pipe(
			map((accounts) => accounts.map((d) => d.accountType)),
			map((accounts) => ACCOUNT_NAME_OPTIONS.filter((d) => !accounts.includes(d)))
		);
	}

	async onSubmit(formData: AccountManagerEdit, type: AccountType): Promise<void> {
		const isEditing = !!formData.id;
		const accountName = formData.name;

		DialogServiceUtil.showNotificationBar(`Request is sending for ${accountName}`, 'notification');

		// create new personal account
		if (!isEditing && type === AccountType.Personal) {
			await firstValueFrom(this.personalAccountFacadeService.createPersonalAccount(accountName));
			DialogServiceUtil.showNotificationBar(`Personal account ${accountName} has been created`, 'success');
		}

		// edit personal account
		else if (isEditing && type === AccountType.Personal) {
			console.log('personal account edit');
			await firstValueFrom(
				this.personalAccountFacadeService.editPersonalAccount({
					name: accountName,
				})
			);
			DialogServiceUtil.showNotificationBar(`PErsonal account ${accountName} has been edited`, 'success');
		}

		// create new investment account
		else if (!isEditing && type === AccountType.Investment) {
			await firstValueFrom(this.investmentAccountFacadeApiService.createInvestmentAccount(accountName));
			DialogServiceUtil.showNotificationBar(`Investment account ${accountName} has been created`, 'success');
		}

		// edit investment account
		else if (isEditing && type === AccountType.Investment) {
			await firstValueFrom(
				this.investmentAccountFacadeApiService.editInvestmentAccount({
					name: accountName,
				})
			);
			DialogServiceUtil.showNotificationBar(`Investment account ${accountName} has been edited`, 'success');
		}
	}

	@Confirmable('Please confirm before removing account type')
	async onDelete(accountType: AccountType): Promise<void> {
		if (accountType === AccountType.Personal) {
			await firstValueFrom(this.personalAccountFacadeService.deletePersonalAccount());
		} else if (accountType === AccountType.Investment) {
			await firstValueFrom(this.investmentAccountFacadeApiService.deleteInvestmentAccount());
		}

		DialogServiceUtil.showNotificationBar(`Account ${ACCOUNT_NAMES[accountType]} has been removed`, 'success');
	}
}
