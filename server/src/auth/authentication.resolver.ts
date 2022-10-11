import { Req, UseGuards } from '@nestjs/common';
import { Mutation, Resolver } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { Void } from './../graphql/graphql.types';
import { AuthenticationService } from './authentication.service';

@Resolver()
export class AuthenticationResolver {
	constructor(private authenticationService: AuthenticationService) {}

	// TODO: implement authentiocation -> return token
	//async basicAuthentication(basicAuth: ??): Promise<void> {}

	// TODO: implement authentiocation -> return token
	//async basicAuthenticationRegistration(basicAuth: ??): Promise<void> {}

	// TODO: implement authentiocation -> return token
	//async providerAuthentication(basicAuth: ??): Promise<void> {}

	// TODO: change password

	// TODO: reset password

	@Mutation(() => Void, { nullable: true })
	@UseGuards(AuthGuard('google'))
	async googleAuth(@Req() req) {}

	@Mutation(() => Void, { nullable: true })
	@UseGuards(AuthGuard('google'))
	googleAuthRedirect(@Req() req) {
		return this.authenticationService.googleLogin(req);
	}
}
