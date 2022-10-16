import { Test, TestingModule } from '@nestjs/testing';
import { InvestmentAccountHistoryService } from '../services/investment-account-history.service';

describe('InvestmentAccountHistoryService', () => {
	let service: InvestmentAccountHistoryService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [InvestmentAccountHistoryService],
		}).compile();

		service = module.get<InvestmentAccountHistoryService>(InvestmentAccountHistoryService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
