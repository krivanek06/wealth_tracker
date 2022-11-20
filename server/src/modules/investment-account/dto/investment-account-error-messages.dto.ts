export enum INVESTMENT_ACCOUNT_ERROR {
	NOT_FOUND = 'Investment account not found',
	NOT_ALLOWED_TO_CTEATE = 'You reacted you limit of creating investment accounts, no additional investment account is allowed',
}

export enum INVESTMENT_ACCOUNT_HOLDING_ERROR {
	MAXIMUM_REACHED = 'Maximum amount of holdings in one investment account is 100, you have reached your limit',
	NOT_FOUND = 'Removing symbol not found in the investment account',
	ALREADY_CONTAIN = 'Investment account holdings already contain this symbol',
	UNSUPPORTRED_DATE_RANGE = 'Provided input date is too old or in the future',
	IS_WEEKEND = 'Please choose do not choose a weekend as date to add your asset',
	MIN_UNIT_VALUE = 'Minimal unit amount for holdings is 0, can not be negative',
	SELL_ERROR_NO_HOLDING = 'Unable to make SELL type operation not enough units',
	UNABLE_TO_DELETE_HISTORY = 'Holding history is unable to be removed, you will have negative total units',
}

export enum INVESTMENT_ACCOUNT_CASH_CHANGE_ERROR {
	NOT_FOUND = 'Editing cash change not found, opration incomplete',
}
