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
		color: '',
		url: 'https://storage.googleapis.com/frequently_accessible_assets/personal-account-tags/shopping.svg',
	},
	{
		name: 'Coffee',
		type: PersonalAccountTagDataType.EXPENSE,
		color: '',
		url: 'https://storage.googleapis.com/frequently_accessible_assets/personal-account-tags/coffee.svg',
	},
	{
		name: 'Transport',
		type: PersonalAccountTagDataType.EXPENSE,
		color: '',
		url: 'https://storage.googleapis.com/frequently_accessible_assets/personal-account-tags/transport.svg',
	},
	{
		name: 'House',
		type: PersonalAccountTagDataType.EXPENSE,
		color: '',
		url: 'https://storage.googleapis.com/frequently_accessible_assets/personal-account-tags/house.svg',
	},
	{
		name: 'Entertainment',
		type: PersonalAccountTagDataType.EXPENSE,
		color: '',
		url: 'https://storage.googleapis.com/frequently_accessible_assets/personal-account-tags/entertainment.svg',
	},
	{
		name: 'Restaurant',
		type: PersonalAccountTagDataType.EXPENSE,
		color: '',
		url: 'https://storage.googleapis.com/frequently_accessible_assets/personal-account-tags/restaurant.svg',
	},
	{
		name: 'Health',
		type: PersonalAccountTagDataType.EXPENSE,
		color: '',
		url: 'https://storage.googleapis.com/frequently_accessible_assets/personal-account-tags/health.svg',
	},
	{
		name: 'Education',
		type: PersonalAccountTagDataType.EXPENSE,
		color: '',
		url: 'https://storage.googleapis.com/frequently_accessible_assets/personal-account-tags/education.svg',
	},
	{
		name: 'Clothes',
		type: PersonalAccountTagDataType.EXPENSE,
		color: '',
		url: 'https://storage.googleapis.com/frequently_accessible_assets/personal-account-tags/clothes.svg',
	},
	{
		name: 'Self care',
		type: PersonalAccountTagDataType.EXPENSE,
		color: '',
		url: 'https://storage.googleapis.com/frequently_accessible_assets/personal-account-tags/self_care.svg',
	},
	{
		name: 'Food',
		type: PersonalAccountTagDataType.EXPENSE,
		color: '',
		url: 'https://storage.googleapis.com/frequently_accessible_assets/personal-account-tags/food.svg',
	},
	{
		name: 'Charity',
		type: PersonalAccountTagDataType.EXPENSE,
		color: '',
		url: 'https://storage.googleapis.com/frequently_accessible_assets/personal-account-tags/charity.svg',
	},
	{
		name: 'Gift',
		type: PersonalAccountTagDataType.EXPENSE,
		color: '',
		url: 'https://storage.googleapis.com/frequently_accessible_assets/personal-account-tags/gift.svg',
	},
	{
		name: 'Sport',
		type: PersonalAccountTagDataType.EXPENSE,
		color: '',
		url: 'https://storage.googleapis.com/frequently_accessible_assets/personal-account-tags/sport.svg',
	},
	{
		name: 'Pets',
		type: PersonalAccountTagDataType.EXPENSE,
		color: '',
		url: 'https://storage.googleapis.com/frequently_accessible_assets/personal-account-tags/pets.svg',
	},
	{
		name: 'Child Care',
		type: PersonalAccountTagDataType.EXPENSE,
		color: '',
		url: 'https://storage.googleapis.com/frequently_accessible_assets/personal-account-tags/child.svg',
	},
	{
		name: 'Electronics',
		type: PersonalAccountTagDataType.EXPENSE,
		color: '',
		url: 'https://storage.googleapis.com/frequently_accessible_assets/personal-account-tags/electronics.svg',
	},
	{
		name: 'Insurance',
		type: PersonalAccountTagDataType.EXPENSE,
		color: '',
		url: 'https://storage.googleapis.com/frequently_accessible_assets/personal-account-tags/insurance.svg',
	},
	{
		name: 'Fitness',
		type: PersonalAccountTagDataType.EXPENSE,
		color: '',
		url: 'https://storage.googleapis.com/frequently_accessible_assets/personal-account-tags/fitness.svg',
	},
	{
		name: 'Travel',
		type: PersonalAccountTagDataType.EXPENSE,
		color: '',
		url: 'https://storage.googleapis.com/frequently_accessible_assets/personal-account-tags/travel.svg',
	},
	{
		name: 'Car',
		type: PersonalAccountTagDataType.EXPENSE,
		color: '',
		url: 'https://storage.googleapis.com/frequently_accessible_assets/personal-account-tags/car.svg',
	},
	{
		name: 'Rent',
		type: PersonalAccountTagDataType.EXPENSE,
		color: '',
		url: 'https://storage.googleapis.com/frequently_accessible_assets/personal-account-tags/rent.svg',
	},
	{
		name: 'Bills',
		type: PersonalAccountTagDataType.EXPENSE,
		color: '',
		url: 'https://storage.googleapis.com/frequently_accessible_assets/personal-account-tags/bills.svg',
	},
] as const;

const randomColorGenerator = () => '#' + (((1 << 24) * Math.random()) | 0).toString(16).padStart(6, '0');

const PERSONAL_ACCOUNT_EXPENSE_TAGS_WITH_COLORS = PERSONAL_ACCOUNT_EXPENSE_TAGS.map((tag) => {
	return {
		...tag,
		color: randomColorGenerator(),
	};
});

export const PERSONAL_ACCOUNT_DEFAULT_TAGS = [
	...PERSONAL_ACCOUNT_INCOME_TAGS,
	...PERSONAL_ACCOUNT_EXPENSE_TAGS_WITH_COLORS,
] as const;
