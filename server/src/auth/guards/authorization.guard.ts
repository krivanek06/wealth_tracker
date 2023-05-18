import { ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
//import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import * as jwt from 'jsonwebtoken';
import { REQ_USER_PROPERTY, RequestUser, RequestUserInt } from '../authentication.dto';

@Injectable()
export class AuthorizationGuard extends AuthGuard('jwt') {
	// constructor(private readonly jwtService: JwtService) {
	// 	super();
	// }

	canActivate(context: ExecutionContext): boolean | Promise<boolean> {
		const ctx = GqlExecutionContext.create(context).getContext();
		// console.log('ctx', ctx.req?.headers);

		const authorization = ctx.req?.headers?.authorization; // 'Bearer ....'
		// console.log(authorization);

		const data = this.validateToken(authorization);

		if (!data) {
			return false;
		}
		// console.log(data.id);

		ctx[REQ_USER_PROPERTY] = new RequestUser({
			id: data.id,
			username: data.username,
			email: data.email,
			role: data.role,
		});

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
			console.log(err);
			throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
		}
	}
}
