import { createMock } from '@golevelup/ts-jest';
import { CanActivate } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PersonalAccountTag } from '../entities';

import { PersonalAccountTagResolver } from '../resolvers/personal-account-tag.resolver';
import { PersonalAccountTagService } from '../services';
import { AuthorizationGuard } from './../../../auth/guards/authorization.guard';

describe('PersonalAccountTagResolver', () => {
	let resolver: PersonalAccountTagResolver;
	let personalAccountTagServiceMock: PersonalAccountTagService;
	const TEST_TAGS: PersonalAccountTag[] = [
		{ id: '23423', name: 'Test' } as PersonalAccountTag,
		{ id: '333', name: 'Test2' } as PersonalAccountTag,
	];

	beforeEach(async () => {
		personalAccountTagServiceMock = createMock<PersonalAccountTagService>({
			getDefaultTags: () => TEST_TAGS,
		});
		const mockAuthorizationGuard: CanActivate = { canActivate: jest.fn(() => true) };

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				PersonalAccountTagResolver,
				{ provide: PersonalAccountTagService, useValue: personalAccountTagServiceMock },
			],
		})
			.overrideGuard(AuthorizationGuard)
			.useValue(mockAuthorizationGuard)
			.compile();

		resolver = module.get<PersonalAccountTagResolver>(PersonalAccountTagResolver);
	});

	it('should be defined', () => {
		expect(resolver).toBeDefined();
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('Test: getDefaultTags()', () => {
		it('should return tags from the service', async () => {
			const returnData = await resolver.getDefaultTags();
			expect(returnData[0]).toEqual(TEST_TAGS[0]);
			expect(returnData[1]).toEqual(TEST_TAGS[1]);
		});
	});
});
