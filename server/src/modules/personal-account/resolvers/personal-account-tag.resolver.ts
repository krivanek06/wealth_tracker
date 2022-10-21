import { UseGuards } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';
import { AuthorizationGuard } from '../../../auth';
import { PersonalAccountTag } from '../entities/';
import { PersonalAccountTagService } from '../services';

@UseGuards(AuthorizationGuard)
@Resolver(() => PersonalAccountTag)
export class PersonalAccountTagResolver {
	constructor(private readonly personalAccountTagService: PersonalAccountTagService) {}

	@Query(() => [PersonalAccountTag], {
		description: 'Returns default tags that are shared cross every user',
		defaultValue: [],
	})
	getDefaultTags(): PersonalAccountTag[] {
		return this.personalAccountTagService.getDefaultTags();
	}
}
