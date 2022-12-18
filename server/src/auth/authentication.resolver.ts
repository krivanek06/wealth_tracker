import { Mutation, Resolver } from '@nestjs/graphql';
import { Input } from './../graphql/args/';
import { AuthenticationService } from './authentication.service';
import { LoginUserInput, RegisterUserInput } from './inputs';
import { LoggedUserOutput } from './outputs';

@Resolver()
export class AuthenticationResolver {
	constructor(private authenticationService: AuthenticationService) {}

	// TODO: change password

	// TODO: reset password

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
