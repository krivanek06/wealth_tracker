import { UseGuards } from '@nestjs/common';
import { Resolver } from '@nestjs/graphql';
import { AuthorizationGuard } from '../../../auth';
import { InvestmentAccountHistory } from '../entities';

@UseGuards(AuthorizationGuard)
@Resolver(() => InvestmentAccountHistory)
export class InvestmentAccountHistoryResolver {
	constructor() {}
}
