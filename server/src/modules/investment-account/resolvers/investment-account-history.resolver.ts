import { UseGuards } from '@nestjs/common';
import { Resolver } from '@nestjs/graphql';
import { InvestmentAccountHistory } from '../entities';
import { AuthorizationGuard } from './../../../auth';

@UseGuards(AuthorizationGuard)
@Resolver(() => InvestmentAccountHistory)
export class InvestmentAccountHistoryResolver {
	constructor() {}
}
