import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { UserAccountType } from '@prisma/client';
import { REQ_USER_PROPERTY, RequestUser } from '../authentication.dto';

/**
 * Use as @UseGuards(RolesGuard)
 * Reference: https://docs.nestjs.com/guards
 */
@Injectable()
export class isAdminGuard implements CanActivate {
	canActivate(context: ExecutionContext): boolean | Promise<boolean> {
		const ctx = GqlExecutionContext.create(context).getContext();
		const user = ctx[REQ_USER_PROPERTY] as RequestUser;

		return user.role === UserAccountType.ADMIN;
	}
}
