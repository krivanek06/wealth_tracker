import { GqlExecutionContext } from '@nestjs/graphql';

import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AuthenticationGoogleGuard extends AuthGuard('google') {
	getRequest(context: GqlExecutionContext) {
		const ctx = GqlExecutionContext.create(context);
		const req = ctx.getContext().req;

		const { input } = ctx.getArgs();

		req.body = {
			...req.body,
			access_token: input.accessToken,
			provider: input.provider,
		};
		return req;
	}
}
