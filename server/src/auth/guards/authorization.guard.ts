import { ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import * as jwt from 'jsonwebtoken';
import { RequestUser, RequestUserInt, REQ_USER_PROPERTY } from '../authentication.dto';

@Injectable()
export class AuthorizationGuard extends AuthGuard('jwt') {
	private TEST_USER: RequestUser = {
		id: '63457ee2bb8dd0d311fbbe2b',
		username: 'Jimmie_Boehm10',
		email: 'Judge67@gmail.com',
	};

	canActivate(context: ExecutionContext): boolean | Promise<boolean> {
		const ctx = GqlExecutionContext.create(context).getContext();
		// console.log('ctx', ctx.req?.headers);
		const authorization = ctx.req?.headers?.authorization; // 'Bearer ....'
		console.log(authorization);

		const data = this.validateToken(authorization);

		// console.log(data.id);

		// mocked user
		ctx[REQ_USER_PROPERTY] = new RequestUser({
			id: this.TEST_USER.id,
			username: this.TEST_USER.username,
			email: this.TEST_USER.email,
		});

		// current user
		// ctx[REQ_USER_PROPERTY] = new RequestUser({
		// 	id: data.id,
		// 	username: data.username,
		// 	email: data.email,
		// });

		return true;
	}

	validateToken(auth: string): RequestUserInt {
		if (!auth) {
			throw new HttpException('Header information not found in the request', HttpStatus.BAD_GATEWAY);
		}

		if (auth.split(' ')[0] !== 'Bearer') {
			throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
		}
		try {
			const token = auth.split(' ')[1];
			const decoded = jwt.decode(token);
			return decoded as RequestUserInt;
		} catch (err) {
			throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
		}
	}
}
