import { Test, TestingModule } from '@nestjs/testing';
import { InvestmentAccountHistoryResolver } from './investment-account-history.resolver';

describe('InvestmentAccountHistoryResolver', () => {
	let resolver: InvestmentAccountHistoryResolver;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [InvestmentAccountHistoryResolver],
		}).compile();

		resolver = module.get<InvestmentAccountHistoryResolver>(InvestmentAccountHistoryResolver);
	});

	it('should be defined', () => {
		expect(resolver).toBeDefined();
	});
});
