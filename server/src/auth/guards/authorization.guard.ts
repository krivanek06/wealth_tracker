import { CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import * as jwt from 'jsonwebtoken';
import { REQ_USER_PROPERTY } from '../authorization.constants';

export class AuthorizationGuard implements CanActivate {
	canActivate(context: ExecutionContext): boolean | Promise<boolean> {
		const ctx = GqlExecutionContext.create(context).getContext();
		//console.log('ctx', ctx.req?.headers);
		const authorization = ctx.req?.headers?.authorization;
		if (!authorization) {
			throw new HttpException('Header information not found in the request', HttpStatus.BAD_GATEWAY);
		}

		const data = this.validateToken(authorization);
		console.log(data);
		ctx[REQ_USER_PROPERTY] = data;
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
