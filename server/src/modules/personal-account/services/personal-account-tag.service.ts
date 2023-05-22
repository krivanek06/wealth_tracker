import { HttpStatus, Injectable } from '@nestjs/common';
import { UserAccountType } from '@prisma/client';
import { GOOGLE_BUCKET_TAG_IMAGES } from '../../../environments';
import { StorageFilesService } from '../../../providers';
import { SharedServiceUtil } from '../../../utils';
import { PERSONAL_ACCOUNT_TAG_ERROR } from '../dto';
import { PersonalAccountTag } from '../entities';
import { PersonalAccountTagDataCreate, PersonalAccountTagDataDelete, PersonalAccountTagDataEdit } from '../inputs';
import { PersonalAccountMonthlyDataRepositoryService, PersonalAccountRepositoryService } from '../repository';
import { CustomGraphQlError } from './../../../graphql/graphql.error';

@Injectable()
export class PersonalAccountTagService {
	constructor(
		private readonly personalAccountRepositoryService: PersonalAccountRepositoryService,
		private readonly personalAccountMonthlyDataRepositoryService: PersonalAccountMonthlyDataRepositoryService,
		private storageFilesService: StorageFilesService
	) {}

	async getAllAvailableTagImages(): Promise<string[]> {
		const data = await this.storageFilesService.getFilesFromFolder(GOOGLE_BUCKET_TAG_IMAGES);
		return data;
	}

	async getTagsForPersonalAccount(personalAccountId: string): Promise<PersonalAccountTag[]> {
		const personalAccount = await this.personalAccountRepositoryService.getPersonalAccountByIdStrict(personalAccountId);

		return personalAccount.personalAccountTag;
	}

	async createPersonalAccountTag(
		tagDataCreate: PersonalAccountTagDataCreate,
		userId: string
	): Promise<PersonalAccountTag> {
		// if no account - error is thrown
		const personalAccount = await this.personalAccountRepositoryService.getPersonalAccountByUserIdStrict(userId);

		const tags = await this.getTagsForPersonalAccount(personalAccount.id);
		const newTag: PersonalAccountTag = {
			id: SharedServiceUtil.getUUID(),
			imageUrl: tagDataCreate.imageUrl,
			userId: userId,
			createdAt: new Date(),
			name: tagDataCreate.name,
			type: tagDataCreate.type,
			color: tagDataCreate.color,
			budgetMonthly: tagDataCreate.budgetMonthly,
		};

		// save new tag
		await this.personalAccountRepositoryService.updatePersonalAccount(userId, {
			personalAccountTag: [...tags, newTag],
		});

		return newTag;
	}

	async editPersonalAccountTag(tagDataEdit: PersonalAccountTagDataEdit, userId: string): Promise<PersonalAccountTag> {
		// if no account - error is thrown
		const personalAccount = await this.personalAccountRepositoryService.getPersonalAccountByUserIdStrict(userId);

		const tags = await this.getTagsForPersonalAccount(personalAccount.id);
		const searchedTag = tags.find((d) => d.id === tagDataEdit.id);

		// not found
		if (!searchedTag) {
			throw new CustomGraphQlError(PERSONAL_ACCOUNT_TAG_ERROR.NOT_FOUND_BY_ID, HttpStatus.NOT_FOUND);
		}

		// create a modified one
		const modifiedTag: PersonalAccountTag = {
			...searchedTag,
			name: tagDataEdit.name,
			color: tagDataEdit.color,
			imageUrl: tagDataEdit.imageUrl,
			budgetMonthly: tagDataEdit.budgetMonthly ?? searchedTag.budgetMonthly,
		};

		// update all
		const allSavingTags = tags.map((d) => (d.id === tagDataEdit.id ? modifiedTag : d));

		// save new tag
		await this.personalAccountRepositoryService.updatePersonalAccount(userId, {
			personalAccountTag: allSavingTags,
		});

		return modifiedTag;
	}

	async deletePersonalAccountTag(
		tagDataDelete: PersonalAccountTagDataDelete,
		userId: string,
		userRole: UserAccountType
	): Promise<PersonalAccountTag> {
		// if no account - error is thrown
		const personalAccount = await this.personalAccountRepositoryService.getPersonalAccountByUserIdStrict(userId);

		// if test account - error is thrown
		if (userRole === UserAccountType.TEST) {
			throw new CustomGraphQlError(PERSONAL_ACCOUNT_TAG_ERROR.NOT_ALLOWED_TO_DELETE, HttpStatus.FORBIDDEN);
		}

		const tags = await this.getTagsForPersonalAccount(personalAccount.id);
		const searchedTag = tags.find((d) => d.id === tagDataDelete.id);

		// not found
		if (!searchedTag) {
			throw new CustomGraphQlError(PERSONAL_ACCOUNT_TAG_ERROR.NOT_FOUND_BY_ID, HttpStatus.NOT_FOUND);
		}

		// remove deleted
		const allSavingTags = tags.filter((d) => d.id !== tagDataDelete.id);

		// update remaining
		await this.personalAccountRepositoryService.updatePersonalAccount(userId, {
			personalAccountTag: allSavingTags,
		});

		// load all monthly data
		const allMonthlyData = await this.personalAccountMonthlyDataRepositoryService.getMonthlyDataByAccountId(
			personalAccount.id
		);

		// remove daily data that has the removed tagId
		for await (const monthlyData of allMonthlyData) {
			await this.personalAccountMonthlyDataRepositoryService.updateMonthlyData(monthlyData.id, {
				dailyData: monthlyData.dailyData.filter((d) => d.tagId !== tagDataDelete.id),
			});
		}

		return searchedTag;
	}
}
