import { ArgsType, Field, Float, InputType } from '@nestjs/graphql';
import { PersonalAccountRecurringExpenseItem as PersonalAccountRecurringExpenseItemClient } from '@prisma/client';

@InputType()
@ArgsType()
export class PersonalAccountRecurringExpenseItem implements PersonalAccountRecurringExpenseItemClient {
	@Field(() => String)
	id: string;

	@Field(() => String)
	executedAt: Date;

	@Field(() => Float)
	value: number;
}
