import { UseGuards } from '@nestjs/common';
import { Mutation, Query, Resolver } from '@nestjs/graphql';
import { ReqUser, RequestUser } from '../../../auth';
import { AuthorizationGuard, isAdminGuard } from '../../../auth/guards';
import { Input } from '../../../graphql/args';
import { AccountIdentification } from '../entities';
import { AccountManager, AccountManagerPopulationService } from '../services';

@UseGuards(AuthorizationGuard)
@Resolver(() => AccountIdentification)
export class AccountManagerResolver {
	constructor(
		private accountManager: AccountManager,
		private accountManagerPopulationService: AccountManagerPopulationService
	) {}

	@Query(() => [AccountIdentification], {
		description: 'Returns available accounts for authenticated user',
		defaultValue: [],
	})
	getAvailableAccounts(@ReqUser() authUser: RequestUser): Promise<AccountIdentification[]> {
		return this.accountManager.getAvailableAccounts(authUser.id);
	}

	@UseGuards(isAdminGuard)
	@Mutation(() => Boolean, {
		description: 'Init user account with dummy data for a specific user',
	})
	async initUserAccountWithDummyData(@ReqUser() authUser: RequestUser, @Input() input: string): Promise<boolean> {
		try {
			console.log(`User ${authUser.email} is resetting data for user: ${input}`);

			await this.accountManagerPopulationService.initPersonalAccount(input);
			await this.accountManagerPopulationService.initInvestmentAccount(input);

			console.log('Done');
		} catch (error) {
			console.log(error);
			return false;
		}
		return true;
	}
}
