import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { PersonalAccountMonthlyService } from '../services';
import { PrismaService } from './../../../prisma';

describe('PersonalAccountMonthlyService', () => {
	let service: PersonalAccountMonthlyService;
	const prismaServiceMock: PrismaService = createMock<PrismaService>({});

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [PersonalAccountMonthlyService, { provide: PrismaService, useValue: prismaServiceMock }],
		}).compile();

		service = module.get<PersonalAccountMonthlyService>(PersonalAccountMonthlyService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
