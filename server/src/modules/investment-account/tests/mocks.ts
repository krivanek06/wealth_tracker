import { InvestmentAccount, InvestmentAccountHolding } from '../entities';
export const USER_ID_MOCK = 'USER_1234';
export const INVESTMENT_ACCOUNT_ID = '634c267f000a7f0c6434b2ba';
export const holdingMSFTMock: InvestmentAccountHolding = {
	id: 'MSFT',
	type: 'STOCK',
	investmentAccountId: INVESTMENT_ACCOUNT_ID,
	units: 123,
	investedAlready: 30000,
	// breakEvenPrice: 243.9,
};

export const holdingAAPLMock: InvestmentAccountHolding = {
	id: 'AAPL',
	type: 'STOCK',
	investmentAccountId: INVESTMENT_ACCOUNT_ID,
	units: 123,
	investedAlready: 10000,
	//breakEvenPrice: 81.3,
};

export const holdingNVDAMock: InvestmentAccountHolding = {
	id: 'NVDA',
	type: 'STOCK',
	investmentAccountId: '224c267f000a7f0c6434b211',
	units: 22,
	investedAlready: 20000,
};

export const investmentAccountMock: InvestmentAccount = {
	id: INVESTMENT_ACCOUNT_ID,
	name: 'Second One',
	cashCurrent: 20000,
	//investedAlreadyTotal: 40000,
	//portfolioBalanceTotal: 60000,
	holdings: [holdingMSFTMock, holdingAAPLMock],
	lastPortfolioSnapshot: null,
	userId: USER_ID_MOCK,
	// accountHistory: {
	// 	id: '634c267f000a7f0c6434b2bb',
	// 	investmentAccountId: '634c267f000a7f0c6434b2ba',
	// 	portfolioSnapshotTotal: 0,
	// 	portfolioSnapshots: [],
	// },
	assetStocks: [],
};
