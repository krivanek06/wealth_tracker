import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from './../../prisma';
import { UserService } from './user.service';

describe('UserService', () => {
	let service: UserService;

	const prismaServiceMock: PrismaService = createMock<PrismaService>({});

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [UserService, { provide: PrismaService, useValue: prismaServiceMock }],
		}).compile();

		service = module.get<UserService>(UserService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
