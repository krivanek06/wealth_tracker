import { UseGuards } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';
import { AuthorizationGuard } from './../../../auth';
import { PersonalAccountTag } from './personal-account-tag.entity';
import { PersonalAccountTagService } from './personal-account-tag.service';

@UseGuards(AuthorizationGuard)
@Resolver(() => PersonalAccountTag)
export class PersonalAccountTagResolver {
	constructor(private readonly personalAccountTagService: PersonalAccountTagService) {}

	@Query(() => [PersonalAccountTag], {
		description: 'Returns default tags that are shared cross every user',
		defaultValue: [],
	})
	async getDefaultTags(): Promise<PersonalAccountTag[]> {
		return this.personalAccountTagService.getDefaultTags();
	}
}
