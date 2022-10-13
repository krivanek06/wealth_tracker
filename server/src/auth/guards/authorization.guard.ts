import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import * as jwt from 'jsonwebtoken';
import { RequestUser, REQ_USER_PROPERTY } from '../authentication.dto';

@Injectable()
export class AuthorizationGuard implements CanActivate {
	private TEST_USER: RequestUser = {
		id: '63457ee2bb8dd0d311fbbe2b',
		username: 'Jimmie_Boehm10',
		email: 'Judge67@gmail.com',
	};

	canActivate(context: ExecutionContext): boolean | Promise<boolean> {
		const ctx = GqlExecutionContext.create(context).getContext();
		// console.log('ctx', ctx.req?.headers);
		// const authorization = ctx.req?.headers?.authorization;
		// if (!authorization) {
		// 	throw new HttpException('Header information not found in the request', HttpStatus.BAD_GATEWAY);
		// }

		//const data = this.validateToken(authorization);

		// TODO check if data is RequestUser object
		//console.log(data);

		ctx[REQ_USER_PROPERTY] = new RequestUser({
			id: this.TEST_USER.id,
			username: this.TEST_USER.username,
			email: this.TEST_USER.email,
		}); // data

		return true;
	}

	validateToken(auth: string) {
		if (auth.split(' ')[0] !== 'Berear') {
			throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
		}
		try {
			const token = auth.split(' ')[1];
			return jwt.decode(token);
		} catch (err) {
			throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
		}
	}
}
