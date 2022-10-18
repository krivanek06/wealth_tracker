import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { PersonalAccountMonthlyService } from '../services';
import { PersonalAccountService } from '../services/personal-account.service';
import { PrismaService } from './../../../prisma';

describe('PersonalAccountService', () => {
	let service: PersonalAccountService;

	const personalAccountMonthlyServiceMock = createMock<PersonalAccountMonthlyService>();
	const prismaServiceMock: PrismaService = createMock<PrismaService>({});

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				PersonalAccountService,
				{ provide: PersonalAccountMonthlyService, useValue: personalAccountMonthlyServiceMock },
				{ provide: PrismaService, useValue: prismaServiceMock },
			],
		}).compile();

		service = module.get<PersonalAccountService>(PersonalAccountService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
