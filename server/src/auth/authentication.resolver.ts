import { UseGuards } from '@nestjs/common';
import { Mutation, Resolver } from '@nestjs/graphql';
import { Input } from './../graphql/args/';
import { RequestUser } from './authentication.dto';
import { AuthenticationService } from './authentication.service';
import { ReqUser } from './decorators';
import { AuthorizationGuard } from './guards';
import { ChangePasswordInput, LoginForgotPasswordInput, LoginUserInput, RegisterUserInput } from './inputs';
import { LoggedUserOutput } from './outputs';

@Resolver()
export class AuthenticationResolver {
	constructor(private authenticationService: AuthenticationService) {}

	@UseGuards(AuthorizationGuard)
	@Mutation(() => Boolean)
	changePassword(
		@Input() changePasswordInput: ChangePasswordInput,
		@ReqUser() authUser: RequestUser
	): Promise<boolean> {
		return this.authenticationService.changePassword(changePasswordInput, authUser);
	}

	@Mutation(() => Boolean)
	resetPassword(@Input() forgotPasswordInput: LoginForgotPasswordInput): Promise<boolean> {
		return this.authenticationService.resetPassword(forgotPasswordInput);
	}

	@Mutation(() => LoggedUserOutput)
	async registerBasic(@Input() registerUserInput: RegisterUserInput): Promise<LoggedUserOutput> {
		const newUser = await this.authenticationService.registerBasic(registerUserInput);
		const loggedUserOutput = this.authenticationService.prepareLoggedUserOutput(newUser);
		return loggedUserOutput;
	}

	@Mutation(() => LoggedUserOutput)
	async loginBasic(@Input() loginUserInput: LoginUserInput): Promise<LoggedUserOutput> {
		const loginUser = await this.authenticationService.loginBasic(loginUserInput);
		const loggedUserOutput = this.authenticationService.prepareLoggedUserOutput(loginUser);
		return loggedUserOutput;
	}
}
