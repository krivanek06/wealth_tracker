import { Test, TestingModule } from '@nestjs/testing';
import { PersonalAccountService } from '../services/personal-account.service';

describe('PersonalAccountService', () => {
	let service: PersonalAccountService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [PersonalAccountService],
		}).compile();

		service = module.get<PersonalAccountService>(PersonalAccountService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
