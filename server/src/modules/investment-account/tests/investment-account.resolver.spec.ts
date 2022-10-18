import { Test, TestingModule } from '@nestjs/testing';
import { InvestmentAccountResolver } from './investment-account.resolver';

describe('InvestmentAccountResolver', () => {
	let resolver: InvestmentAccountResolver;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [InvestmentAccountResolver],
		}).compile();

		resolver = module.get<InvestmentAccountResolver>(InvestmentAccountResolver);
	});

	it('should be defined', () => {
		expect(resolver).toBeDefined();
	});
});
