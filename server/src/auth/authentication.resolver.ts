import { UseGuards } from '@nestjs/common';
import { Mutation, Resolver } from '@nestjs/graphql';
import { Profile } from 'passport';
import { Input } from './../graphql/args/';
import { AuthenticationService } from './authentication.service';
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
		const accessToken = this.authenticationService.generateJwt(newUser);
		return { accessToken };
	}

	@Mutation(() => LoggedUserOutput)
	async loginBasic(@Input() loginUserInput: LoginUserInput): Promise<LoggedUserOutput> {
		const loginUser = await this.authenticationService.loginBasic(loginUserInput);
		const accessToken = this.authenticationService.generateJwt(loginUser);
		return { accessToken };
	}

	/**
	 *
	 * @param profile
	 * @param input
	 * @returns - Authentication user access token
	 */
	@UseGuards(AuthenticationGoogleGuard)
	@Mutation(() => LoggedUserOutput)
	async loginSocial(@SocialProfile() profile: Profile, @Input() input: LoginSocialInput): Promise<LoggedUserOutput> {
		const loginUser = await this.authenticationService.loginSocial(profile, input);
		const accessToken = this.authenticationService.generateJwt(loginUser);
		return { accessToken };
	}
}
