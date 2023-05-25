import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, firstValueFrom, map } from 'rxjs';
import { TOP_LEVEL_NAV } from 'src/app/core/models';
import { Confirmable } from 'src/app/shared/decorators';
import {
	AccountManagerApiService,
	InvestmentAccountFacadeApiService,
	PersonalAccountFacadeService,
} from '../../../../core/api';
import { AccountIdentificationFragment, AccountType, UserAccountType, UserFragment } from '../../../../core/graphql';
import { DASHBOARD_ROUTES_BY_TYPE } from '../../../../core/models';
import { DialogServiceUtil } from '../../../../shared/dialogs';
import { ACCOUNT_NAMES, ACCOUNT_NAME_OPTIONS, AccountManagerEdit } from '../../models';
import { AuthenticationFacadeService } from './../../../../core/services';

@Component({
	selector: 'app-account-manager',
	templateUrl: './account-manager.component.html',
	styleUrls: ['./account-manager.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountManagerComponent {
	authenticatedUser$!: Observable<UserFragment>;

	availableAccounts$!: Observable<AccountIdentificationFragment[]>;
	creatingAccounts$!: Observable<AccountType[]>;

	ACCOUNT_NAMES = ACCOUNT_NAMES;
	UserAccountType = UserAccountType;

	constructor(
		private managerAccountApiService: AccountManagerApiService,
		private personalAccountFacadeService: PersonalAccountFacadeService,
		private investmentAccountFacadeApiService: InvestmentAccountFacadeApiService,
		private authenticationFacadeService: AuthenticationFacadeService,
		private router: Router
	) {}

	ngOnInit(): void {
		this.authenticatedUser$ = this.authenticationFacadeService.getAuthenticatedUser();
		this.availableAccounts$ = this.managerAccountApiService.getAvailableAccounts();

		this.creatingAccounts$ = this.availableAccounts$.pipe(
			map((accounts) => accounts.map((d) => d.accountType)),
			map((accounts) => ACCOUNT_NAME_OPTIONS.filter((d) => !accounts.includes(d)))
		);
	}

	onClick(type: AccountType): void {
		this.router.navigate([TOP_LEVEL_NAV.dashboard, DASHBOARD_ROUTES_BY_TYPE[type]]);
	}

	async onEdit(formData: AccountManagerEdit, type: AccountType): Promise<void> {
		const accountName = formData.name;
		DialogServiceUtil.showNotificationBar(`${ACCOUNT_NAMES[type]}: editing account`, 'notification');

		if (type === AccountType.Personal) {
			await firstValueFrom(
				this.personalAccountFacadeService.editPersonalAccount({
					name: accountName,
				})
			);
		} else if (type === AccountType.Investment) {
			await firstValueFrom(
				this.investmentAccountFacadeApiService.editInvestmentAccount({
					name: accountName,
				})
			);
		}

		DialogServiceUtil.showNotificationBar(`${ACCOUNT_NAMES[type]}: has been edited`, 'success');
	}

	async onCreate(type: AccountType): Promise<void> {
		DialogServiceUtil.showNotificationBar(`Request is sending for creating an account`, 'notification');

		// create new personal account
		if (type === AccountType.Personal) {
			await firstValueFrom(this.personalAccountFacadeService.createPersonalAccount());
			DialogServiceUtil.showNotificationBar(`Personal account has been created`, 'success');
		}

		// create new investment account
		else if (type === AccountType.Investment) {
			await firstValueFrom(this.investmentAccountFacadeApiService.createInvestmentAccount());
		}

		DialogServiceUtil.showNotificationBar(`${ACCOUNT_NAMES[type]} has been created`, 'success');
	}

	@Confirmable('Please confirm before removing account type')
	async onDelete(accountType: AccountType): Promise<void> {
		if (this.authenticationFacadeService.isAuthenticatedUserTestAccount()) {
			DialogServiceUtil.showNotificationBar('Test User Authenticated - disabled removing account', 'error');
			return;
		}

		DialogServiceUtil.showNotificationBar(`Init Deleting ${ACCOUNT_NAMES[accountType]}`, 'notification');

		if (accountType === AccountType.Personal) {
			await firstValueFrom(this.personalAccountFacadeService.deletePersonalAccount());
		} else if (accountType === AccountType.Investment) {
			await firstValueFrom(this.investmentAccountFacadeApiService.deleteInvestmentAccount());
		}

		DialogServiceUtil.showNotificationBar(`Account ${ACCOUNT_NAMES[accountType]} has been removed`, 'success');
	}
}
