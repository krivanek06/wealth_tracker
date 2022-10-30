import { PersonalAccountTagDataType } from '@prisma/client';

const PERSONAL_ACCOUNT_ICOME_TAGS = [{ name: 'Job', type: PersonalAccountTagDataType.INCOME }] as const;

const PERSONAL_ACCOUNT_EXPENSE_TAGS = [
	{ name: 'Shoping', type: PersonalAccountTagDataType.EXPENSE },
	{ name: 'Coffee', type: PersonalAccountTagDataType.EXPENSE },
	{ name: 'Transport', type: PersonalAccountTagDataType.EXPENSE },
	{ name: 'House', type: PersonalAccountTagDataType.EXPENSE },
	{ name: 'Entertainment', type: PersonalAccountTagDataType.EXPENSE },
	{ name: 'Restaurant', type: PersonalAccountTagDataType.EXPENSE },
	{ name: 'Health', type: PersonalAccountTagDataType.EXPENSE },
	{ name: 'Education', type: PersonalAccountTagDataType.EXPENSE },
	{ name: 'Self care', type: PersonalAccountTagDataType.EXPENSE },
	{ name: 'Food', type: PersonalAccountTagDataType.EXPENSE },
	{ name: 'Charity', type: PersonalAccountTagDataType.EXPENSE },
] as const;

export const PERSONAL_ACCOUNT_DEFAULT_TAGS = [
	...PERSONAL_ACCOUNT_ICOME_TAGS,
	...PERSONAL_ACCOUNT_EXPENSE_TAGS,
] as const;
