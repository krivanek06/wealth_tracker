import { Test, TestingModule } from '@nestjs/testing';
import { PersonalAccountResolver } from '../resolvers/personal-account.resolver';

describe('PersonalAccountResolver', () => {
	let resolver: PersonalAccountResolver;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [PersonalAccountResolver],
		}).compile();

		resolver = module.get<PersonalAccountResolver>(PersonalAccountResolver);
	});

	it('should be defined', () => {
		expect(resolver).toBeDefined();
	});
});
