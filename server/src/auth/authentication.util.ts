import { ExecutionContext, InternalServerErrorException } from '@nestjs/common';
import { User as UserClient } from '@prisma/client';
import { RequestUser, REQ_USER_PROPERTY } from './authentication.dto';

export class AuthenticationUtil {
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

	static convertUserClientToRequestUser(userClient: UserClient): RequestUser {
		return {
			id: userClient.id,
			email: userClient.email,
			username: userClient.username,
		};
	}
}
