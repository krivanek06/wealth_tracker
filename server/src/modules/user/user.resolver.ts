import { UseGuards } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';
import { ReqUser } from '../../auth/decorators';
import { AuthorizationGuard } from '../../auth/guards';
import { RequestUser } from './../../auth/authentication.dto';
import { User } from './user.entity';
import { UserService } from './user.service';

@UseGuards(AuthorizationGuard)
@Resolver(() => User)
export class UserResolver {
	constructor(private userService: UserService) {}

	@Query(() => User, {
		description: 'Return authenticated user based on header information',
	})
	getAuthenticatedUser(@ReqUser() authUser: RequestUser): Promise<User> {
		return this.userService.getUserById(authUser.id);
	}
}
