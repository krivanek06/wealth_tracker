import { Field, ObjectType } from '@nestjs/graphql';
import { InvestmentAccountHolding } from '../entities';
import { AssetGeneral } from './../../asset-manager';

@ObjectType()
export class InvestmentAccountActiveHoldingOutput extends InvestmentAccountHolding {
	@Field(() => AssetGeneral)
	assetGeneral: AssetGeneral;
}
