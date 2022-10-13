import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User as UserClient } from '@prisma/client';
import { Profile } from 'passport';
import { PrismaService } from 'prisma/prisma.service';
import { LoginSocialInput, LoginUserInput, RegisterUserInput } from './inputs';

/**
 * Calling the public methods, check if user already exists in the DB
 *     - if no user, create new one
 * then load user's data and return as a token
 *
 */
@Injectable()
export class AuthenticationService {
	constructor(private prismaService: PrismaService, private jwtService: JwtService) {}

	async registerBasic(registerUserInput: RegisterUserInput): Promise<UserClient> {
		// check if passwords match

		// load user from DB

		// if user email throw error

		// register user

		// return user
		return {} as UserClient;
	}

	async loginBasic(loginUserInput: LoginUserInput): Promise<UserClient> {
		// load user from DB

		// if not exists - throw error

		// update login time in DB

		return {} as UserClient;
	}

	async loginSocial(profile: Profile, input: LoginSocialInput): Promise<UserClient> {
		// load user from DB

		// if not exists - create one

		// update login time in DB

		return {} as UserClient;
	}

	generateJwt(userClient: UserClient): string {
		return this.jwtService.sign(userClient);
	}

	private async getUserByEmail(email: string): Promise<UserClient> {
		return this.prismaService.user.findUnique({
			where: {
				email,
			},
		});
	}
}
