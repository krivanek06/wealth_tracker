import { ObjectType } from '@nestjs/graphql';
import { InvestmentAccountHolding } from '../entities';

@ObjectType()
export class InvestmentAccountHoldingCrypto extends InvestmentAccountHolding {}
