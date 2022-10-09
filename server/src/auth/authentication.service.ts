import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

/**
 * Calling the public methods, check if user already exists in the DB
 *     - if no user, create new one
 * then load user's data and return as a token
 *
 */
@Injectable()
export class AuthenticationService {
	constructor(private prismaService: PrismaService) {}

	// TODO: implement authentiocation -> return token
	//async basicAuthentication(basicAuth: ??): Promise<void> {}

	// TODO: implement authentiocation -> return token
	//async basicAuthenticationRegistration(basicAuth: ??): Promise<void> {}

	// TODO: implement authentiocation -> return token
	//async providerAuthentication(basicAuth: ??): Promise<void> {}
}
