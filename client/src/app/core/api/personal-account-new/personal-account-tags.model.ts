export enum PersonalAccountTagTypEnumNew {
	INCOME = 'INCOME',
	EXPENSE = 'EXPENSE',
}
export type PersonalAccountTagTypeNew = keyof typeof PersonalAccountTagTypEnumNew;

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
	'pet',
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

const PERSONAL_ACCOUNT_INCOME_TAGS = [
	{
		name: 'Job',
		type: PersonalAccountTagTypEnumNew.INCOME,
		color: '#22c55d',
		image: 'job',
	},
] as const;

const PERSONAL_ACCOUNT_EXPENSE_TAGS = [
	{
		name: 'Shopping',
		type: PersonalAccountTagTypEnumNew.EXPENSE,
		color: '',
		image: 'shopping',
	},
	{
		name: 'Coffee',
		type: PersonalAccountTagTypEnumNew.EXPENSE,
		color: '',
		image: 'coffee',
	},
	{
		name: 'Transport',
		type: PersonalAccountTagTypEnumNew.EXPENSE,
		color: '',
		image: 'transport',
	},
	{
		name: 'House',
		type: PersonalAccountTagTypEnumNew.EXPENSE,
		color: '',
		image: 'house',
	},
	{
		name: 'Entertainment',
		type: PersonalAccountTagTypEnumNew.EXPENSE,
		color: '',
		image: 'entertainment',
	},
	{
		name: 'Restaurant',
		type: PersonalAccountTagTypEnumNew.EXPENSE,
		color: '',
		image: 'restaurant',
	},
	{
		name: 'Health',
		type: PersonalAccountTagTypEnumNew.EXPENSE,
		color: '',
		image: 'health',
	},
	{
		name: 'Education',
		type: PersonalAccountTagTypEnumNew.EXPENSE,
		color: '',
		image: 'education',
	},
	{
		name: 'Clothes',
		type: PersonalAccountTagTypEnumNew.EXPENSE,
		color: '',
		image: 'clothes',
	},
	{
		name: 'Self care',
		type: PersonalAccountTagTypEnumNew.EXPENSE,
		color: '',
		image: 'self_care',
	},
	{
		name: 'Food',
		type: PersonalAccountTagTypEnumNew.EXPENSE,
		color: '',
		image: 'food',
	},
	{
		name: 'Charity',
		type: PersonalAccountTagTypEnumNew.EXPENSE,
		color: '',
		image: 'charity',
	},
	{
		name: 'Gift',
		type: PersonalAccountTagTypEnumNew.EXPENSE,
		color: '',
		image: 'gift',
	},
	{
		name: 'Sport',
		type: PersonalAccountTagTypEnumNew.EXPENSE,
		color: '',
		image: 'sport',
	},
	{
		name: 'Pets',
		type: PersonalAccountTagTypEnumNew.EXPENSE,
		color: '',
		image: 'pets',
	},
	{
		name: 'Child Care',
		type: PersonalAccountTagTypEnumNew.EXPENSE,
		color: '',
		image: 'child',
	},
	{
		name: 'Electronics',
		type: PersonalAccountTagTypEnumNew.EXPENSE,
		color: '',
		image: 'electronics',
	},
	{
		name: 'Insurance',
		type: PersonalAccountTagTypEnumNew.EXPENSE,
		color: '',
		image: 'insurance',
	},
	{
		name: 'Fitness',
		type: PersonalAccountTagTypEnumNew.EXPENSE,
		color: '',
		image: 'fitness',
	},
	{
		name: 'Travel',
		type: PersonalAccountTagTypEnumNew.EXPENSE,
		color: '',
		image: 'travel',
	},
	{
		name: 'Car',
		type: PersonalAccountTagTypEnumNew.EXPENSE,
		color: '',
		image: 'car',
	},
	{
		name: 'Rent',
		type: PersonalAccountTagTypEnumNew.EXPENSE,
		color: '',
		image: 'rent',
	},
	{
		name: 'Bills',
		type: PersonalAccountTagTypEnumNew.EXPENSE,
		color: '',
		image: 'bills',
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

export type PersonalAccountDefaultTag = (typeof PERSONAL_ACCOUNT_DEFAULT_TAGS)[number];
export type PersonalAccountTagImageName = (typeof personalAccountTagImageName)[number];

export type PersonalAccountTag = {
	id: string;
	name: string;
	type: PersonalAccountTagTypeNew;
	color: string;
	image: string;
	budgetMonthly: number;
};

export const PERSONAL_ACCOUNT_DEFAULT_TAG_DATA = {
	name: 'Unknown',
	type: PersonalAccountTagTypEnumNew.EXPENSE,
	color: '#fe12cc',
	image: 'shopping',
};
