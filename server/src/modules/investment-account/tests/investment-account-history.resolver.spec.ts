import { Test, TestingModule } from '@nestjs/testing';
import { InvestmentAccountHoldingHistoryResolver } from '../resolvers/investment-account-holding-history.resolver';

describe('InvestmentAccountHistoryResolver', () => {
	let resolver: InvestmentAccountHoldingHistoryResolver;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [InvestmentAccountHoldingHistoryResolver],
		}).compile();

		resolver = module.get<InvestmentAccountHoldingHistoryResolver>(InvestmentAccountHoldingHistoryResolver);
	});

	it('should be defined', () => {
		expect(resolver).toBeDefined();
	});
});
