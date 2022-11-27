import { Field, ObjectType } from '@nestjs/graphql';
import { PubSubDataModification, PubSubDataModificationI } from '../../../shared/dto';
import { InvestmentAccountCashChange } from '../entities';

@ObjectType()
export class InvestmentAccountCashChangeSubscription
	extends PubSubDataModification
	implements PubSubDataModificationI<InvestmentAccountCashChange>
{
	@Field(() => InvestmentAccountCashChange)
	data: InvestmentAccountCashChange;
}
