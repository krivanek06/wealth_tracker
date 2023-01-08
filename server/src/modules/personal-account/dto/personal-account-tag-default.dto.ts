import { PersonalAccountTagDataType } from '@prisma/client';

const PERSONAL_ACCOUNT_INCOME_TAGS = [
	{
		name: 'Job',
		type: PersonalAccountTagDataType.INCOME,
		color: '#22c55d',
		url: 'https://storage.googleapis.com/frequently_accessible_assets/personal-account-tags/job.svg',
	},
] as const;

const PERSONAL_ACCOUNT_EXPENSE_TAGS = [
	{
		name: 'Shopping',
		type: PersonalAccountTagDataType.EXPENSE,
		color: '#E8501E',
		url: 'https://storage.googleapis.com/frequently_accessible_assets/personal-account-tags/shopping.svg',
	},
	{
		name: 'Coffee',
		type: PersonalAccountTagDataType.EXPENSE,
		color: '#DB355E',
		url: 'https://storage.googleapis.com/frequently_accessible_assets/personal-account-tags/coffee.svg',
	},
	{
		name: 'Transport',
		type: PersonalAccountTagDataType.EXPENSE,
		color: '#AD4185',
		url: 'https://storage.googleapis.com/frequently_accessible_assets/personal-account-tags/transport.svg',
	},
	{
		name: 'House',
		type: PersonalAccountTagDataType.EXPENSE,
		color: '#AE4ABE',
		url: 'https://storage.googleapis.com/frequently_accessible_assets/personal-account-tags/house.svg',
	},
	{
		name: 'Entertainment',
		type: PersonalAccountTagDataType.EXPENSE,
		color: '#704F8F',
		url: 'https://storage.googleapis.com/frequently_accessible_assets/personal-account-tags/entertainment.svg',
	},
	{
		name: 'Restaurant',
		type: PersonalAccountTagDataType.EXPENSE,
		color: '#FFE6D6',
		url: 'https://storage.googleapis.com/frequently_accessible_assets/personal-account-tags/restaurant.svg',
	},
	{
		name: 'Health',
		type: PersonalAccountTagDataType.EXPENSE,
		color: '#EBAA93',
		url: 'https://storage.googleapis.com/frequently_accessible_assets/personal-account-tags/health.svg',
	},
	{
		name: 'Education',
		type: PersonalAccountTagDataType.EXPENSE,
		color: '#85AEE1',
		url: 'https://storage.googleapis.com/frequently_accessible_assets/personal-account-tags/education.svg',
	},
	{
		name: 'Clothes',
		type: PersonalAccountTagDataType.EXPENSE,
		color: '#DB388E',
		url: 'https://storage.googleapis.com/frequently_accessible_assets/personal-account-tags/clothes.svg',
	},
	{
		name: 'Self care',
		type: PersonalAccountTagDataType.EXPENSE,
		color: '#5564D9',
		url: 'https://storage.googleapis.com/frequently_accessible_assets/personal-account-tags/self_care.svg',
	},
	{
		name: 'Food',
		type: PersonalAccountTagDataType.EXPENSE,
		color: '#E8501E',
		url: 'https://storage.googleapis.com/frequently_accessible_assets/personal-account-tags/food.svg',
	},
	{
		name: 'Charity',
		type: PersonalAccountTagDataType.EXPENSE,
		color: '#DB355E',
		url: 'https://storage.googleapis.com/frequently_accessible_assets/personal-account-tags/charity.svg',
	},
	{
		name: 'Gift',
		type: PersonalAccountTagDataType.EXPENSE,
		color: '#DB388E',
		url: 'https://storage.googleapis.com/frequently_accessible_assets/personal-account-tags/gift.svg',
	},
	{
		name: 'Sport',
		type: PersonalAccountTagDataType.EXPENSE,
		color: '#DB388E',
		url: 'https://storage.googleapis.com/frequently_accessible_assets/personal-account-tags/sport.svg',
	},
	{
		name: 'Pets',
		type: PersonalAccountTagDataType.EXPENSE,
		color: '#DB388E',
		url: 'https://storage.googleapis.com/frequently_accessible_assets/personal-account-tags/pets.svg',
	},
] as const;

export const PERSONAL_ACCOUNT_DEFAULT_TAGS = [
	...PERSONAL_ACCOUNT_INCOME_TAGS,
	...PERSONAL_ACCOUNT_EXPENSE_TAGS,
] as const;
