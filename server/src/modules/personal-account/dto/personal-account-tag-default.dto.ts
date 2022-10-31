import { PersonalAccountTagDataType } from '@prisma/client';

const PERSONAL_ACCOUNT_INCOME_TAGS = [
	{ name: 'Job', type: PersonalAccountTagDataType.INCOME, color: '#22c55d' },
] as const;

const PERSONAL_ACCOUNT_EXPENSE_TAGS = [
	{ name: 'Shoping', type: PersonalAccountTagDataType.EXPENSE, color: '#E8501E' },
	{ name: 'Coffee', type: PersonalAccountTagDataType.EXPENSE, color: '#DB355E' },
	{ name: 'Transport', type: PersonalAccountTagDataType.EXPENSE, color: '#AD4185' },
	{ name: 'House', type: PersonalAccountTagDataType.EXPENSE, color: '#AE4ABE' },
	{ name: 'Entertainment', type: PersonalAccountTagDataType.EXPENSE, color: '#704F8F' },
	{ name: 'Restaurant', type: PersonalAccountTagDataType.EXPENSE, color: '#FFE6D6' },
	{ name: 'Health', type: PersonalAccountTagDataType.EXPENSE, color: '#EBAA93' },
	{ name: 'Education', type: PersonalAccountTagDataType.EXPENSE, color: '#85AEE1' },
	{ name: 'Self care', type: PersonalAccountTagDataType.EXPENSE, color: '#5564D9' },
	{ name: 'Food', type: PersonalAccountTagDataType.EXPENSE, color: '#E8501E' },
	{ name: 'Charity', type: PersonalAccountTagDataType.EXPENSE, color: '#DB355E' },
] as const;

export const PERSONAL_ACCOUNT_DEFAULT_TAGS = [
	...PERSONAL_ACCOUNT_INCOME_TAGS,
	...PERSONAL_ACCOUNT_EXPENSE_TAGS,
] as const;
