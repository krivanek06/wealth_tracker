import { v4 as uuid } from 'uuid';

export type PersonalAccountTagTypeNew = 'INCOME' | 'EXPENSE';

export const personalAccountTagImageName = [
	'airplane',
	'bills',
	'cake',
	'capitol',
	'car',
	'charity',
	'child',
	'clothes',
	'coffee',
	'education',
	'electronics',
	'entertainment',
	'fitness',
	'food',
	'gift',
	'health',
	'house',
	'insurance',
	'job',
	'payment',
	'pets',
	'rent',
	'restaurant',
	'retirement',
	'self_care',
	'shopping',
	'sport',
	'train',
	'transport',
	'travel',
] as const;

export type PersonalAccountDefaultTag = (typeof PERSONAL_ACCOUNT_DEFAULT_TAGS)[number];
export type PersonalAccountTagImageName = (typeof personalAccountTagImageName)[number];

export type PersonalAccountTag = {
	id: string;
	name: string;
	type: PersonalAccountTagTypeNew;
	color: string;
	image: PersonalAccountTagImageName;
	budgetMonthly: number;
};

const PERSONAL_ACCOUNT_INCOME_TAGS: PersonalAccountTag[] = [
	{
		name: 'Job',
		type: 'INCOME',
		color: '#22c55d',
		image: 'job',
		budgetMonthly: 0,
		id: uuid(),
	},
];

const PERSONAL_ACCOUNT_EXPENSE_TAGS: PersonalAccountTag[] = [
	{
		name: 'Shopping',
		type: 'EXPENSE',
		color: '',
		image: 'shopping',
		budgetMonthly: 0,
		id: uuid(),
	},
	{
		name: 'Coffee',
		type: 'EXPENSE',
		color: '',
		image: 'coffee',
		budgetMonthly: 0,
		id: uuid(),
	},
	{
		name: 'Transport',
		type: 'EXPENSE',
		color: '',
		image: 'transport',
		budgetMonthly: 0,
		id: uuid(),
	},
	{
		name: 'House',
		type: 'EXPENSE',
		color: '',
		image: 'house',
		budgetMonthly: 0,
		id: uuid(),
	},
	{
		name: 'Entertainment',
		type: 'EXPENSE',
		color: '',
		image: 'entertainment',
		budgetMonthly: 0,
		id: uuid(),
	},
	{
		name: 'Restaurant',
		type: 'EXPENSE',
		color: '',
		image: 'restaurant',
		budgetMonthly: 0,
		id: uuid(),
	},
	{
		name: 'Health',
		type: 'EXPENSE',
		color: '',
		image: 'health',
		budgetMonthly: 0,
		id: uuid(),
	},
	{
		name: 'Education',
		type: 'EXPENSE',
		color: '',
		image: 'education',
		budgetMonthly: 0,
		id: uuid(),
	},
	{
		name: 'Clothes',
		type: 'EXPENSE',
		color: '',
		image: 'clothes',
		budgetMonthly: 0,
		id: uuid(),
	},
	{
		name: 'Self care',
		type: 'EXPENSE',
		color: '',
		image: 'self_care',
		budgetMonthly: 0,
		id: uuid(),
	},
	{
		name: 'Food',
		type: 'EXPENSE',
		color: '',
		image: 'food',
		budgetMonthly: 0,
		id: uuid(),
	},
	{
		name: 'Charity',
		type: 'EXPENSE',
		color: '',
		image: 'charity',
		budgetMonthly: 0,
		id: uuid(),
	},
	{
		name: 'Gift',
		type: 'EXPENSE',
		color: '',
		image: 'gift',
		budgetMonthly: 0,
		id: uuid(),
	},
	{
		name: 'Sport',
		type: 'EXPENSE',
		color: '',
		image: 'sport',
		budgetMonthly: 0,
		id: uuid(),
	},
	{
		name: 'Pets',
		type: 'EXPENSE',
		color: '',
		image: 'pets',
		budgetMonthly: 0,
		id: uuid(),
	},
	{
		name: 'Child Care',
		type: 'EXPENSE',
		color: '',
		image: 'child',
		budgetMonthly: 0,
		id: uuid(),
	},
	{
		name: 'Electronics',
		type: 'EXPENSE',
		color: '',
		image: 'electronics',
		budgetMonthly: 0,
		id: uuid(),
	},
	{
		name: 'Insurance',
		type: 'EXPENSE',
		color: '',
		image: 'insurance',
		budgetMonthly: 0,
		id: uuid(),
	},
	{
		name: 'Fitness',
		type: 'EXPENSE',
		color: '',
		image: 'fitness',
		budgetMonthly: 0,
		id: uuid(),
	},
	{
		name: 'Travel',
		type: 'EXPENSE',
		color: '',
		image: 'travel',
		budgetMonthly: 0,
		id: uuid(),
	},
	{
		name: 'Car',
		type: 'EXPENSE',
		color: '',
		image: 'car',
		budgetMonthly: 0,
		id: uuid(),
	},
	{
		name: 'Rent',
		type: 'EXPENSE',
		color: '',
		image: 'rent',
		budgetMonthly: 0,
		id: uuid(),
	},
	{
		name: 'Bills',
		type: 'EXPENSE',
		color: '',
		image: 'bills',
		budgetMonthly: 0,
		id: uuid(),
	},
];

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

export type PersonalAccountTagCreate = Omit<PersonalAccountTag, 'id'>;

export const PERSONAL_ACCOUNT_DEFAULT_TAG_DATA: PersonalAccountTag = {
	id: 'DEFAULT_TAG',
	budgetMonthly: 0,
	name: 'Unknown',
	type: 'EXPENSE',
	color: '#fe12cc',
	image: 'shopping',
};
