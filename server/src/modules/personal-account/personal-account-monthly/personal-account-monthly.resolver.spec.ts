import { Test, TestingModule } from '@nestjs/testing';
import { PersonalAccountMonthlyResolver } from './personal-account-monthly.resolver';

describe('PersonalAccountMonthlyResolver', () => {
	let resolver: PersonalAccountMonthlyResolver;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [PersonalAccountMonthlyResolver],
		}).compile();

		resolver = module.get<PersonalAccountMonthlyResolver>(PersonalAccountMonthlyResolver);
	});

	it('should be defined', () => {
		expect(resolver).toBeDefined();
	});
});
