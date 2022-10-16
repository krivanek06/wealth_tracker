import { Test, TestingModule } from '@nestjs/testing';
import { PersonalAccountMonthlyService } from '../services';

describe('PersonalAccountMonthlyService', () => {
	let service: PersonalAccountMonthlyService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [PersonalAccountMonthlyService],
		}).compile();

		service = module.get<PersonalAccountMonthlyService>(PersonalAccountMonthlyService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
