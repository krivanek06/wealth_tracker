export enum INVESTMENT_ACCOUNT_ERROR {
	NOT_FOUND = 'Investment account not found',
	NOT_ALLOWED_TO_CTEATE = 'You reacted you limit of creating investment accounts, no additional investment account is allowed',
}

export enum INVESTMENT_ACCOUNT_HOLDING_ERROR {
	MAXIMUM_REACHED = 'Maximum amount of holdings in one investment account is 100, you have reached your limit',
	NOT_FOUND = 'Holding not found in the investment account',
	ALREADY_CONTAIN = 'Investment account holdings already contain this symbol',
}
