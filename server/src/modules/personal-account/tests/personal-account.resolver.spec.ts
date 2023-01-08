import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { PersonalAccountResolver } from '../resolvers/personal-account.resolver';
import {
	PersonalAccountDataAggregatorService,
	PersonalAccountMonthlyService,
	PersonalAccountService,
} from '../services';

describe('PersonalAccountResolver', () => {
	let resolver: PersonalAccountResolver;

	const personalAccountServiceMock = createMock<PersonalAccountService>();
	const personalAccountMonthlyServiceMock = createMock<PersonalAccountMonthlyService>();
	const personalAccountWeeklyServiceMock = createMock<PersonalAccountDataAggregatorService>();

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				PersonalAccountResolver,
				{ provide: PersonalAccountService, useValue: personalAccountServiceMock },
				{ provide: PersonalAccountMonthlyService, useValue: personalAccountMonthlyServiceMock },
				{ provide: PersonalAccountDataAggregatorService, useValue: personalAccountWeeklyServiceMock },
			],
		}).compile();

		resolver = module.get<PersonalAccountResolver>(PersonalAccountResolver);
	});

	it('should be defined', () => {
		expect(resolver).toBeDefined();
	});
});
