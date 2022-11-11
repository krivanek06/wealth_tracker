import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PersonalAccountTagDataType } from '@prisma/client';
import { PrismaService } from '../../../prisma';
import { PERSONAL_ACCOUNT_DEFAULT_TAGS, PERSONAL_ACCOUNT_TAG_ERROR } from '../dto';
import { PersonalAccountTag } from '../entities/personal-account-tag.entity';

@Injectable()
export class PersonalAccountTagService {
	// caching default tags from DB to prevent multiple loading
	private defaultTags: PersonalAccountTag[] = [];
	constructor(private readonly prisma: PrismaService) {
		this.registerDefaultTags();
		this.loadDefaultTags();
	}

	getDefaultTags(): PersonalAccountTag[] {
		if (this.defaultTags.length === 0) {
			throw new HttpException(PERSONAL_ACCOUNT_TAG_ERROR.NOT_FOUND, HttpStatus.NOT_FOUND);
		}
		return this.defaultTags;
	}

	getDefaultTagById(tagId: string): PersonalAccountTag | null {
		const allTags = this.getDefaultTags();
		return allTags.find((t) => t.id === tagId) ?? null;
	}

	getDefaultTagsByTypes(tagType: PersonalAccountTagDataType): PersonalAccountTag[] {
		const allTags = this.getDefaultTags();
		return allTags.filter((t) => t.type === tagType);
	}

	private async loadDefaultTags(): Promise<void> {
		this.defaultTags = await this.prisma.personalAccountTag.findMany({
			where: {
				isDefault: true,
			},
		});
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
					color: defaultTag.color,
					isDefault: true,
				},
			});

			// console.log(`PersonalAccountTagService: created default tag, name: ${defaultTag.name}, type: ${defaultTag.type}`);
		}
	}
}
