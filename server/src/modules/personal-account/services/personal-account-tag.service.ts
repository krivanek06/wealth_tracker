import { Injectable } from '@nestjs/common';
import { PersonalAccountTagDataType } from '@prisma/client';
import { PrismaService } from '../../../prisma';
import { PERSONAL_ACCOUNT_DEFAULT_TAGS } from '../dto';
import { PersonalAccountTag } from '../entities/personal-account-tag.entity';

@Injectable()
export class PersonalAccountTagService {
	// caching default tags from DB to prevent multiple loading
	private defaultTags: PersonalAccountTag[] = [];
	constructor(private readonly prisma: PrismaService) {
		this.registerDefaultTags();
	}

	async getDefaultTags(): Promise<PersonalAccountTag[]> {
		if (this.defaultTags.length === 0) {
			this.defaultTags = await this.prisma.personalAccountTag.findMany({
				where: {
					isDefault: true,
				},
			});
			// console.log(`PersonalAccountTagService: loaded ${this.defaultTags.length} default tags`);
		}
		return this.defaultTags;
	}

	async getDefaultTagsByTypes(tagType: PersonalAccountTagDataType): Promise<PersonalAccountTag[]> {
		const allTags = await this.getDefaultTags();
		return allTags.filter((t) => t.type === tagType);
	}

	private async registerDefaultTags(): Promise<void> {
		for await (const defaultTag of PERSONAL_ACCOUNT_DEFAULT_TAGS) {
			// check if exists
			const defaultTagDB = await this.prisma.personalAccountTag.findFirst({
				where: {
					name: defaultTag.name,
					isDefault: true,
				},
			});

			// if exists, continue
			if (defaultTagDB) {
				continue;
			}

			// save new tag
			await this.prisma.personalAccountTag.create({
				data: {
					name: defaultTag.name,
					type: defaultTag.type,
					isDefault: true,
				},
			});

			// console.log(`PersonalAccountTagService: created default tag, name: ${defaultTag.name}, type: ${defaultTag.type}`);
		}
	}
}
