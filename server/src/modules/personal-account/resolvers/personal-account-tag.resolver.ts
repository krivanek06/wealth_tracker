import { UseGuards } from '@nestjs/common';
import { Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthorizationGuard, ReqUser, RequestUser } from '../../../auth';
import { Input } from '../../../graphql/args';
import { PersonalAccountTag } from '../entities/';
import { PersonalAccountTagDataCreate, PersonalAccountTagDataDelete, PersonalAccountTagDataEdit } from '../inputs';
import { PersonalAccountTagService } from '../services';

@UseGuards(AuthorizationGuard)
@Resolver(() => PersonalAccountTag)
export class PersonalAccountTagResolver {
	constructor(private readonly personalAccountTagService: PersonalAccountTagService) {}

	@Query(() => [String], {
		description: 'Returns all available tag images',
		defaultValue: [],
	})
	getAllAvailableTagImages(): Promise<string[]> {
		return this.personalAccountTagService.getAllAvailableTagImages();
	}

	@Mutation(() => PersonalAccountTag)
	createPersonalAccountTag(
		@ReqUser() authUser: RequestUser,
		@Input() input: PersonalAccountTagDataCreate
	): Promise<PersonalAccountTag> {
		return this.personalAccountTagService.createPersonalAccountTag(input, authUser.id);
	}

	@Mutation(() => PersonalAccountTag)
	editPersonalAccountTag(
		@ReqUser() authUser: RequestUser,
		@Input() input: PersonalAccountTagDataEdit
	): Promise<PersonalAccountTag> {
		return this.personalAccountTagService.editPersonalAccountTag(input, authUser.id);
	}

	@Mutation(() => PersonalAccountTag)
	deletePersonalAccountTag(
		@ReqUser() authUser: RequestUser,
		@Input() input: PersonalAccountTagDataDelete
	): Promise<PersonalAccountTag> {
		return this.personalAccountTagService.deletePersonalAccountTag(input, authUser.id, authUser.role);
	}
}
