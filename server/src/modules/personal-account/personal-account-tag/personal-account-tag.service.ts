import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { PersonalAccountTag } from './personal-account-tag.entity';

@Injectable()
export class PersonalAccountTagService {
	constructor(private readonly prisma: PrismaService) {}

	async getDefaultTags(): Promise<PersonalAccountTag[]> {
		return this.prisma.personalAccountTag.findMany({
			where: {
				isDefault: true,
			},
		});
	}
}
