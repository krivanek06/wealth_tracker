import { InvestmentAccount, InvestmentAccountHolding } from '../entities';
export const USER_ID_MOCK = 'USER_1234';
export const INVESTMENT_ACCOUNT_ID = '634c267f000a7f0c6434b2ba';
export const holdingMSFTMock: InvestmentAccountHolding = {
	id: 'MSFT',
	type: 'STOCK',
	investmentAccountId: INVESTMENT_ACCOUNT_ID,
	assetId: 'MSFT',
	sector: 'Technology',
	holdingHistory: [],
	// breakEvenPrice: 243.9,
};

export const holdingAAPLMock: InvestmentAccountHolding = {
	id: 'AAPL',
	type: 'STOCK',
	investmentAccountId: INVESTMENT_ACCOUNT_ID,
	assetId: 'AAPL',
	sector: 'Technology',
	holdingHistory: [],
	//breakEvenPrice: 81.3,
};

export const holdingNVDAMock: InvestmentAccountHolding = {
	id: 'NVDA',
	type: 'STOCK',
	investmentAccountId: '224c267f000a7f0c6434b211',
	assetId: 'NVDA',
	sector: 'Health',
	holdingHistory: [],
};

export const investmentAccountMock: InvestmentAccount = {
	id: INVESTMENT_ACCOUNT_ID,
	name: 'Second One',
	//investedAlreadyTotal: 40000,
	//portfolioBalanceTotal: 60000,
	userId: USER_ID_MOCK,
	cashChange: [],
	holdings: [holdingAAPLMock, holdingMSFTMock, holdingNVDAMock],
	createdAt: new Date('2022-04-05'),
	// accountHistory: {
	// 	id: '634c267f000a7f0c6434b2bb',
	// 	investmentAccountId: '634c267f000a7f0c6434b2ba',
	// 	portfolioSnapshotTotal: 0,
	// 	portfolioSnapshots: [],
	// },
};
