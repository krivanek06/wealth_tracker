import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PersonalAccountTagDataType } from '@prisma/client';
import { PrismaService } from '../../../prisma';
import { SharedServiceUtil } from '../../../utils';
import { PERSONAL_ACCOUNT_DEFAULT_TAGS, PERSONAL_ACCOUNT_TAG_ERROR } from '../dto';
import { PersonalAccountTag } from '../entities';
import { PersonalAccountTagDataCreate, PersonalAccountTagDataDelete, PersonalAccountTagDataEdit } from '../inputs';

@Injectable()
export class PersonalAccountTagService {
	constructor(private readonly prisma: PrismaService) {}

	async getTagsForPersonalAccount(personalAccountId: string): Promise<PersonalAccountTag[]> {
		const personalAccount = await this.prisma.personalAccount.findFirst({
			where: {
				id: personalAccountId,
			},
		});

		return personalAccount.personalAccountTag;
	}

	async createPersonalAccountTag(
		tagDataCreate: PersonalAccountTagDataCreate,
		userId: string
	): Promise<PersonalAccountTag> {
		const data: PersonalAccountTag = {
			id: SharedServiceUtil.getUUID(),
			imageUrl: tagDataCreate.imageUrl,
			userId: userId,
			createdAt: new Date(),
			personalAccountId: tagDataCreate.personalAccountId,
			name: tagDataCreate.name,
			type: tagDataCreate.type,
			color: tagDataCreate.color,
		};

		// save new tag
		await this.saveTags(tagDataCreate.personalAccountId, [data]);

		return data;
	}

	async editPersonalAccountTag(tagDataEdit: PersonalAccountTagDataEdit, userId: string): Promise<PersonalAccountTag> {
		const tags = await this.getTagsForPersonalAccount(tagDataEdit.personalAccountId);
		const searchedTag = tags.find((d) => d.id === tagDataEdit.id);

		// not found
		if (!searchedTag) {
			throw new HttpException(PERSONAL_ACCOUNT_TAG_ERROR.NOT_FOUND_BY_ID, HttpStatus.NOT_FOUND);
		}

		// create a modified one
		const modifiedTag: PersonalAccountTag = {
			...searchedTag,
			name: tagDataEdit.name,
			color: tagDataEdit.color,
			imageUrl: tagDataEdit.imageUrl,
		};

		// update all
		const allSavingTags = tags.map((d) => (d.id === tagDataEdit.id ? modifiedTag : d));

		// save new tag
		await this.saveTags(tagDataEdit.personalAccountId, allSavingTags);

		return modifiedTag;
	}

	async deletePersonalAccount(
		tagDataDelete: PersonalAccountTagDataDelete,
		userId: string
	): Promise<PersonalAccountTag> {
		const tags = await this.getTagsForPersonalAccount(tagDataDelete.personalAccountId);
		const searchedTag = tags.find((d) => d.id === tagDataDelete.id);

		// not found
		if (!searchedTag) {
			throw new HttpException(PERSONAL_ACCOUNT_TAG_ERROR.NOT_FOUND_BY_ID, HttpStatus.NOT_FOUND);
		}

		// update all
		const allSavingTags = tags.filter((d) => d.id !== tagDataDelete.id);

		// save new tag
		await this.saveTags(tagDataDelete.personalAccountId, allSavingTags);

		return searchedTag;
	}

	async getPersonalAccountTagsByTypes(
		personalAccountId: string,
		tagType: PersonalAccountTagDataType
	): Promise<PersonalAccountTag[]> {
		const allTags = await this.getTagsForPersonalAccount(personalAccountId);
		return allTags.filter((t) => t.type === tagType);
	}

	async registerDefaultTagsForPersonalAccountId(personalAccountId: string, userId: string): Promise<void> {
		const defaultTags = PERSONAL_ACCOUNT_DEFAULT_TAGS.map((tag) => {
			const data: PersonalAccountTag = {
				id: SharedServiceUtil.getUUID(),
				imageUrl: tag.url,
				userId: userId,
				createdAt: new Date(),
				personalAccountId: personalAccountId,
				name: tag.name,
				type: tag.type,
				color: tag.color,
			};

			return data;
		});

		// save new tag
		await this.saveTags(personalAccountId, defaultTags);
	}

	private async saveTags(personalAccountId: string, tags: PersonalAccountTag[]): Promise<void> {
		await this.prisma.personalAccount.update({
			data: {
				personalAccountTag: {
					push: [...tags],
				},
			},
			where: {
				id: personalAccountId,
			},
		});
	}
}
