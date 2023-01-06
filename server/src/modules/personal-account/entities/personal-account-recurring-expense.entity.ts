import { ArgsType, Field, Float, ID, InputType } from '@nestjs/graphql';
import { PersonalAccountRecurringExpense as PersonalAccountRecurringExpenseClient } from '@prisma/client';
import { MaxLength } from 'class-validator';
import { PersonalAccountRecurringExpenseItem } from './personal-account-recurring-expense-item.entity';

@InputType()
@ArgsType()
export class PersonalAccountRecurringExpense implements PersonalAccountRecurringExpenseClient {
	@Field(() => ID)
	id: string;

	@Field(() => String)
	@MaxLength(30)
	name: string;

	@Field(() => String)
	@MaxLength(50)
	tagId: string;

	@Field(() => String)
	@MaxLength(50)
	personalAccountId: string;

	@Field(() => String)
	@MaxLength(50)
	userId: string;

	@Field(() => String)
	createdAt: Date;

	@Field(() => String)
	executedAt: Date;

	@Field(() => String)
	executionNextTime: Date;

	@Field(() => Float)
	value: number;

	@Field(() => String)
	executionFrequency: number;

	@Field(() => [PersonalAccountRecurringExpenseItem], {
		defaultValue: [],
	})
	items: PersonalAccountRecurringExpenseItem[];
}
