import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { InvestmentAccount } from '../entities';
import { InvestmentAccountResolver } from '../resolvers';
import { InvestmentAccountHistoryService, InvestmentAccountService } from '../services';
import { investmentAccountMock } from './mocks';

describe('InvestmentAccountResolver', () => {
	let resolver: InvestmentAccountResolver;

	const investmentAccountServiceMock = createMock<InvestmentAccountService>({});
	const investmentAccountHistoryServiceMock = createMock<InvestmentAccountHistoryService>({});

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				InvestmentAccountResolver,
				{ provide: InvestmentAccountService, useValue: investmentAccountServiceMock },
				{ provide: InvestmentAccountHistoryService, useValue: investmentAccountHistoryServiceMock },
			],
		}).compile();

		resolver = module.get<InvestmentAccountResolver>(InvestmentAccountResolver);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should be defined', () => {
		expect(resolver).toBeDefined();
	});

	describe('Test: resolvers', () => {
		describe('Test: getInvestmentAccountHistory()', () => {
			it('should call another service get account history ', async () => {
				const input: InvestmentAccount = {} as InvestmentAccount;
				await resolver.getInvestmentAccountHistory(input);
				expect(investmentAccountHistoryServiceMock.getInvestmentAccountHistoryInvestmentAccount).toHaveBeenCalled();
			});
		});

		describe('Test: getInvestedAlreadyTotal()', () => {
			it('should return total invested amount into assets', () => {
				const expectedResult = investmentAccountMock.holdings.reduce((acc, cur) => acc + cur.investedAlready, 0);
				const result = resolver.getInvestedAlreadyTotal(investmentAccountMock);
				expect(result).toEqual(expectedResult);
			});
		});

		describe('Test: getPortfolioTotal()', () => {
			it('should return total invested amount + cash', () => {
				const investedAlready = investmentAccountMock.holdings.reduce((acc, cur) => acc + cur.investedAlready, 0);
				const expectedResult = investedAlready + investmentAccountMock.cashCurrent;
				const result = resolver.getPortfolioTotal(investmentAccountMock);
				expect(result).toEqual(expectedResult);
			});
		});
	});
});
