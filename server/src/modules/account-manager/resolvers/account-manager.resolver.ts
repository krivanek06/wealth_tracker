import { UseGuards } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';
import { RequestUser, ReqUser } from '../../../auth';
import { AuthorizationGuard } from '../../../auth/guards';
import { AccountIdentification } from '../entities';
import { AccountManager } from '../services';

@UseGuards(AuthorizationGuard)
@Resolver(() => AccountIdentification)
export class AccountManagerResolver {
	constructor(private accountManager: AccountManager) {}

	@Query(() => [AccountIdentification], {
		description: 'Returns available accounts for authenticated user',
		defaultValue: [],
	})
	getAvailableAccounts(@ReqUser() authUser: RequestUser): Promise<AccountIdentification[]> {
		return this.accountManager.getAvailableAccounts(authUser.id);
	}
}
