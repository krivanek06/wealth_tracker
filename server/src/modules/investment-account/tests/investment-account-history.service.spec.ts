import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { InvestmentAccountHistoryService } from '../services/investment-account-history.service';
import { PrismaService } from './../../../prisma';

describe('InvestmentAccountHistoryService', () => {
	let service: InvestmentAccountHistoryService;

	const prismaServiceMock: PrismaService = createMock<PrismaService>({});

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [InvestmentAccountHistoryService, { provide: PrismaService, useValue: prismaServiceMock }],
		}).compile();

		service = module.get<InvestmentAccountHistoryService>(InvestmentAccountHistoryService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
