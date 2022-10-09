import { BadRequestException, createParamDecorator, ExecutionContext } from '@nestjs/common';
import { validate } from 'class-validator';
import { AuthorizationUtil } from './authorization.util';

export const ReqUser = createParamDecorator(async (_data: unknown, ctx: ExecutionContext) => {
	const reqUser = AuthorizationUtil.getRequestUserFromContext(ctx);

	const errors = await validate(reqUser);

	if (errors.length > 0) {
		throw new BadRequestException(
			errors.map((e) => e.constraints),
			'Bad Request. Invalid user data in provided token.'
		);
	}

	return reqUser;
});
