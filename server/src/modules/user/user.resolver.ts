import { UseGuards } from '@nestjs/common';
import { Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
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
		return this.userService.updateUserLastLogin(authUser.id);
	}

	@Mutation(() => User, {
		nullable: true,
	})
	removeAccount(@ReqUser() authUser: RequestUser): Promise<User> {
		return this.userService.removeAccount(authUser.id);
	}

	/* Resolvers */

	@ResolveField('isAuthBasic', () => Boolean)
	isAuthBasic(@Parent() user: User): boolean {
		return user.authentication.authenticationType === 'BASIC_AUTH';
	}

	@ResolveField('isAccountTest', () => Boolean)
	isAccountTest(@Parent() user: User): boolean {
		return user.accountType === 'TEST';
	}

	@ResolveField('isAccountAdmin', () => Boolean)
	isAccountAdmin(@Parent() user: User): boolean {
		return user.accountType === 'ADMIN';
	}
}
