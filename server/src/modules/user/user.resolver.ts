import { Resolver } from '@nestjs/graphql';
import { AuthenticationService } from '../../auth';

@Resolver()
export class UserResolver {
	constructor(authenticationService: AuthenticationService) {}

	// TODO: implement authentiocation -> return token
	//async basicAuthentication(basicAuth: ??): Promise<void> {}

	// TODO: implement authentiocation -> return token
	//async basicAuthenticationRegistration(basicAuth: ??): Promise<void> {}

	// TODO: implement authentiocation -> return token
	//async providerAuthentication(basicAuth: ??): Promise<void> {}

	// TODO: change password

	// TODO: reset password
}
