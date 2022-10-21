import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { PersonalAccountMonthlyService, PersonalAccountTagService } from '../services';
import { PrismaService } from './../../../prisma';

describe('PersonalAccountMonthlyService', () => {
	let service: PersonalAccountMonthlyService;
	const prismaServiceMock: PrismaService = createMock<PrismaService>({});
	const personalAccountTagServiceMock: PersonalAccountTagService = createMock<PersonalAccountTagService>({});

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				PersonalAccountMonthlyService,
				{ provide: PrismaService, useValue: prismaServiceMock },
				{ provide: PersonalAccountTagService, useValue: personalAccountTagServiceMock },
			],
		}).compile();

		service = module.get<PersonalAccountMonthlyService>(PersonalAccountMonthlyService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
