import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthenticationType, User as UserClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { Profile } from 'passport-google-oauth20';
import { JWT_SECRET } from '../environments';
import { PrismaService } from '../prisma';
import { MailConstructor, SendGridService } from '../providers/sendgrid';
import { CustomGraphQlError } from './../graphql/graphql.error';
import { RequestUser } from './authentication.dto';
import { AuthenticationUtil } from './authentication.util';
import {
	ChangePasswordInput,
	LoginForgotPasswordInput,
	LoginSocialInput,
	LoginUserInput,
	RegisterUserInput,
} from './inputs';
import { LoggedUserOutput } from './outputs';

@Injectable()
export class AuthenticationService {
	constructor(
		private prismaService: PrismaService,
		private jwtService: JwtService,
		private sendGridService: SendGridService
	) {}

	async changePassword(changePasswordInput: ChangePasswordInput, authUser: RequestUser): Promise<boolean> {
		// check if passwords match
		if (changePasswordInput.password !== changePasswordInput.passwordRepeat) {
			throw new CustomGraphQlError('Passwords do not match', HttpStatus.FORBIDDEN);
		}

		return this.changeUserPassword(authUser.email, changePasswordInput.password);
	}

	async resetPassword(forgotPasswordInput: LoginForgotPasswordInput): Promise<boolean> {
		const { email } = forgotPasswordInput;
		return this.changeUserPassword(email);
	}

	/**
	 *
	 * @param registerUserInput registration credentials to create an user
	 * @returns newly create
	 */
	async registerBasic({ email, password, passwordRepeat }: RegisterUserInput): Promise<UserClient> {
		// check if passwords match
		if (password !== passwordRepeat) {
			throw new CustomGraphQlError('Passwords do not match', HttpStatus.FORBIDDEN);
		}

		// if user email exists throw error
		const isUser = await this.getUserByEmail(email);
		if (isUser) {
			throw new CustomGraphQlError(`Email ${email} is already being used`, HttpStatus.FORBIDDEN);
		}

		// get data
		const username = email.split('@')[0];
		const hashedPassowrd = await this.hashPassword(password);

		// register user
		const newUser = this.prismaService.user.create({
			data: {
				username,
				email,
				authentication: {
					authenticationType: AuthenticationType.BASIC_AUTH,
					password: hashedPassowrd,
				},
			},
		});

		// return user
		return newUser;
	}

	async loginBasic({ email, password }: LoginUserInput): Promise<UserClient> {
		// load user from DB
		const user = await this.getUserByEmail(email);

		// if not exists - throw error
		if (!user) {
			throw new CustomGraphQlError(`Email or password is invalid`, HttpStatus.FORBIDDEN);
		}

		// compare passwords
		const isPasswordMatch = await this.comparePasswords(password, user.authentication.password);
		if (!isPasswordMatch) {
			throw new CustomGraphQlError(`Email or password is invalid`, HttpStatus.FORBIDDEN);
		}

		// update login time in DB
		await this.updateUserLastLogin(user);

		return user;
	}

	async loginSocial(profile: Profile, input: LoginSocialInput): Promise<UserClient> {
		const { emails, photos, displayName } = profile;

		// load user from DB
		const email = emails[0].value;
		const user = await this.getUserByEmail(email);

		// if exists, return
		if (user) {
			await this.updateUserLastLogin(user);
			return user;
		}

		// register user
		const newUser = await this.prismaService.user.create({
			data: {
				username: displayName,
				email: email,
				imageUrl: photos[0]?.value,
				authentication: {
					authenticationType: input.provider,
					token: input.accessToken,
				},
			},
		});

		return newUser;
	}

	prepareLoggedUserOutput(user: UserClient): LoggedUserOutput {
		const requesterUser = AuthenticationUtil.convertUserClientToRequestUser(user);
		const accessToken = this.generateJwt(requesterUser);
		return { accessToken };
	}

	private generateJwt(userClient: RequestUser): string {
		return this.jwtService.sign(userClient, {
			secret: JWT_SECRET,
		});
	}

	private async changeUserPassword(email: string, newPassword?: string): Promise<boolean> {
		// load user from DB
		const user = await this.getUserByEmail(email);

		// if not exists - throw error
		if (!user) {
			throw new CustomGraphQlError(`Email does not exists`, HttpStatus.FORBIDDEN);
		}

		if (user.authentication.authenticationType !== 'BASIC_AUTH') {
			throw new CustomGraphQlError(
				`Unable to reset password is not basic authentication is used`,
				HttpStatus.FORBIDDEN
			);
		}

		const randomPassword = newPassword ?? Math.random().toString(36).slice(-8); //  0.123456 -> "0.4fzyo82mvyr" -> "yo82mvyr"
		const hashedPassowrd = await this.hashPassword(randomPassword);
		const emailSending = MailConstructor.changedPasswordEmail(email, randomPassword);

		try {
			// update password in DB
			await this.prismaService.user.update({
				data: {
					authentication: {
						password: hashedPassowrd,
						authenticationType: AuthenticationType.BASIC_AUTH,
					},
				},
				where: {
					email,
				},
			});

			// send email to user
			await this.sendGridService.send(emailSending);
			return true;
		} catch (err) {
			console.log(err);
		}

		return false;
	}

	/**
	 * reference: https://docs.nestjs.com/security/encryption-and-hashing
	 * @param password hashed password
	 */
	private async hashPassword(password: string): Promise<string> {
		const saltOrRounds = 10;

		const hash = await bcrypt.hash(password, saltOrRounds);
		return hash;
	}

	private async comparePasswords(passwordPlainText: string, passwordHash: string): Promise<boolean> {
		return bcrypt.compare(passwordPlainText, passwordHash);
	}

	/**
	 *
	 * @param email of the user we are searching
	 * @returns user if exists in the DB or null if not found
	 */
	private async getUserByEmail(email: string): Promise<UserClient | null> {
		return this.prismaService.user.findFirst({
			where: {
				email,
			},
		});
	}

	private async updateUserLastLogin({ id }: UserClient): Promise<void> {
		await this.prismaService.user.update({
			data: {
				lastSingInDate: new Date(),
			},
			where: {
				id,
			},
		});
	}
}
