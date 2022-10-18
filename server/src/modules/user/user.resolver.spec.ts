import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

describe('UserResolver', () => {
	let resolver: UserResolver;

	const userServiceMock = createMock<UserService>();

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [UserResolver, { provide: UserService, useValue: userServiceMock }],
		}).compile();

		resolver = module.get<UserResolver>(UserResolver);
	});

	it('should be defined', () => {
		expect(resolver).toBeDefined();
	});
});
