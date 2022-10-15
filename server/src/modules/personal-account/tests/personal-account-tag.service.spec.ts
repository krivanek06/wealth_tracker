import { Test, TestingModule } from '@nestjs/testing';
import { PersonalAccountTagService } from '../personal-account/services/personal-account-tag.service';

describe('PersonalAccountTagService', () => {
	let service: PersonalAccountTagService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [PersonalAccountTagService],
		}).compile();

		service = module.get<PersonalAccountTagService>(PersonalAccountTagService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
