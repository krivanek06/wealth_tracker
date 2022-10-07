import { Test, TestingModule } from '@nestjs/testing';
import { PersonalAccountTagResolver } from './personal-account-tag.resolver';

describe('PersonalAccountTagResolver', () => {
	let resolver: PersonalAccountTagResolver;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [PersonalAccountTagResolver],
		}).compile();

		resolver = module.get<PersonalAccountTagResolver>(PersonalAccountTagResolver);
	});

	it('should be defined', () => {
		expect(resolver).toBeDefined();
	});
});
