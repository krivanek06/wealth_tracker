import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../../prisma';
import { PERSONAL_ACCOUNT_DEFAULT_TAGS } from '../dto';
import { PersonalAccountTagService } from '../services';

describe('PersonalAccountTagService', () => {
	let service: PersonalAccountTagService;
	const mockTags = [
		{
			_id: 'AAA',
			createdAt: '1665816040794',
			modifiedAt: '1665816040794',
			name: 'Shoping',
			type: 'EXPENSE',
			isDefault: true,
		},
		{
			_id: 'BBB',
			createdAt: '1665816040794',
			modifiedAt: '1665816040794',
			name: 'Pets',
			type: 'EXPENSE',
			isDefault: true,
		},
	];
	const prismaServiceMock: PrismaService = createMock<PrismaService>({
		personalAccountTag: {
			findFirst: jest.fn(),
			create: jest.fn(),
			findMany: jest.fn().mockReturnValue(mockTags),
		},
	});

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [PersonalAccountTagService, { provide: PrismaService, useValue: prismaServiceMock }],
		}).compile();

		service = module.get<PersonalAccountTagService>(PersonalAccountTagService);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	describe('Test: registerDefaultTags()', () => {
		it('should register tags on application start', () => {
			PERSONAL_ACCOUNT_DEFAULT_TAGS.forEach((tag) => {
				// test loading tag
				expect(prismaServiceMock.personalAccountTag.findFirst).toBeCalledWith({
					where: {
						name: tag.name,
						isDefault: true,
					},
				});

				// test creating tag
				expect(prismaServiceMock.personalAccountTag.create).toBeCalledWith({
					data: {
						name: tag.name,
						type: tag.type,
						isDefault: true,
					},
				});
			});
		});
	});

	describe('Test: getDefaultTags()', () => {
		it('should load data by prisma', async () => {
			// test initial values
			expect(prismaServiceMock.personalAccountTag.findMany).not.toHaveBeenCalled();
			expect(service['defaultTags']).toEqual([]);

			await service.getDefaultTags();

			// test after calling method
			expect(prismaServiceMock.personalAccountTag.findMany).toHaveBeenCalledTimes(1);
			expect(prismaServiceMock.personalAccountTag.findMany).toHaveBeenCalledWith({
				where: {
					isDefault: true,
				},
			});
			expect(service['defaultTags'][0]).toEqual(mockTags[0]);
			expect(service['defaultTags'][1]).toEqual(mockTags[1]);
		});

		it('should execute loading data from server only once', async () => {
			await service.getDefaultTags();
			await service.getDefaultTags();
			await service.getDefaultTags();
			expect(prismaServiceMock.personalAccountTag.findMany).toHaveBeenCalledTimes(1);
		});
	});
});
