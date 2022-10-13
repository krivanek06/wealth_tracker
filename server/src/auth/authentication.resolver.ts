import { UseGuards } from '@nestjs/common';
import { Mutation, Resolver } from '@nestjs/graphql';
import { User as UserClient } from '@prisma/client';
import { Profile } from 'passport';
import { Input } from './../graphql/args/';
import { AuthenticationService } from './authentication.service';
import { AuthenticationUtil } from './authentication.util';
import { SocialProfile } from './decorators';
import { AuthenticationGoogleGuard } from './guards';
import { LoginSocialInput, LoginUserInput, RegisterUserInput } from './inputs';
import { LoggedUserOutput } from './outputs';

@Resolver()
export class AuthenticationResolver {
	constructor(private authenticationService: AuthenticationService) {}

	// TODO: change password

	// TODO: reset password

	@Mutation(() => LoggedUserOutput)
	async registerBasic(@Input() registerUserInput: RegisterUserInput): Promise<LoggedUserOutput> {
		const newUser = await this.authenticationService.registerBasic(registerUserInput);
		const loggedUserOutput = this.prepareLoggedUserOutput(newUser);
		return loggedUserOutput;
	}

	@Mutation(() => LoggedUserOutput)
	async loginBasic(@Input() loginUserInput: LoginUserInput): Promise<LoggedUserOutput> {
		const loginUser = await this.authenticationService.loginBasic(loginUserInput);
		const loggedUserOutput = this.prepareLoggedUserOutput(loginUser);
		return loggedUserOutput;
	}

	/**
	 *
	 * @param profile
	 * @param input
	 * @returns authentication user access token
	 */
	@UseGuards(AuthenticationGoogleGuard)
	@Mutation(() => LoggedUserOutput)
	async loginSocial(@SocialProfile() profile: Profile, @Input() input: LoginSocialInput): Promise<LoggedUserOutput> {
		const loginUser = await this.authenticationService.loginSocial(profile, input);
		const loggedUserOutput = this.prepareLoggedUserOutput(loginUser);
		return loggedUserOutput;
	}

	private prepareLoggedUserOutput(user: UserClient): LoggedUserOutput {
		const requesterUser = AuthenticationUtil.convertUserClientToRequestUser(user);
		const accessToken = this.authenticationService.generateJwt(requesterUser);
		return { accessToken, user };
	}
}
