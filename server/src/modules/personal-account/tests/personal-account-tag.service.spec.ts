import { createMock } from '@golevelup/ts-jest';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../../prisma';
import { PERSONAL_ACCOUNT_DEFAULT_TAGS, PERSONAL_ACCOUNT_TAG_ERROR } from '../dto';
import { PersonalAccountTag } from '../entities';
import { PersonalAccountTagService } from '../services';

describe('PersonalAccountTagService', () => {
	let service: PersonalAccountTagService;
	const mockTags: PersonalAccountTag[] = [
		{
			id: 'AAA',
			createdAt: new Date('1665816040794'),
			modifiedAt: new Date('1665816040794'),
			name: 'Shoping',
			type: 'EXPENSE',
			color: 'red',
			personalAccountId: 'EEEEEE',
			userId: null,
			isDefault: true,
		},
		{
			id: 'BBB',
			createdAt: new Date('1665816040794'),
			modifiedAt: new Date('1665816040794'),
			name: 'Pets',
			type: 'INCOME',
			color: 'red',
			personalAccountId: 'EEEEEE',
			userId: null,
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
			expect(prismaServiceMock.personalAccountTag.findFirst).toHaveBeenCalledTimes(
				PERSONAL_ACCOUNT_DEFAULT_TAGS.length
			);
			PERSONAL_ACCOUNT_DEFAULT_TAGS.forEach((tag) => {
				// test loading tag
				expect(prismaServiceMock.personalAccountTag.findFirst).toHaveBeenCalledWith({
					where: {
						name: tag.name,
						isDefault: true,
					},
				});
				// test creating tag
				expect(prismaServiceMock.personalAccountTag.create).toHaveBeenCalledWith({
					data: {
						name: tag.name,
						type: tag.type,
						color: tag.color,
						isDefault: true,
					},
				});
			});
		});
	});

	describe('Test: getDefaultTags()', () => {
		it('should load data by prisma', async () => {
			// test initial values
			expect(prismaServiceMock.personalAccountTag.findMany).toHaveBeenCalled();
			expect(service['defaultTags']).not.toEqual([]);

			service.getDefaultTags();

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
			service.getDefaultTags();
			service.getDefaultTags();
			service.getDefaultTags();
			expect(prismaServiceMock.personalAccountTag.findMany).toHaveBeenCalledTimes(1);
		});
	});

	describe('Test: getDefaultTagById()', () => {
		it('should find tag by tagId', () => {
			const tag = service.getPersonalAccountTagById(mockTags[0].id);
			const expectedResult = mockTags[0];

			expect(tag).toStrictEqual(expectedResult);
		});

		it('should thrown an error if tag not found by tagId', () => {
			expect(service.getPersonalAccountTagById('NOT_EXISTS')).toThrowError(
				new HttpException(PERSONAL_ACCOUNT_TAG_ERROR.NOT_FOUND_BY_ID, HttpStatus.NOT_FOUND)
			);
		});
	});
});
