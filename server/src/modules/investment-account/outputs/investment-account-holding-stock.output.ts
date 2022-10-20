import { ObjectType } from '@nestjs/graphql';
import { InvestmentAccountHolding } from '../entities';

@ObjectType()
export class InvestmentAccountHoldingStock extends InvestmentAccountHolding {}
