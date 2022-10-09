import { ExecutionContext, InternalServerErrorException } from '@nestjs/common';
import { REQ_USER_PROPERTY } from './authorization.constants';
import { RequestUser } from './request-user.dto';

export class AuthorizationUtil {
	static getRequestUserFromContext(executionContext: ExecutionContext): RequestUser {
		const destination = executionContext.getArgByIndex(2);
		const reqUser = destination[REQ_USER_PROPERTY];

		if (!(reqUser instanceof RequestUser)) {
			throw new InternalServerErrorException(
				'Unexpected, reqUser should be instance of RequestUser in executionContext'
			);
		}

		return reqUser;
	}
}
