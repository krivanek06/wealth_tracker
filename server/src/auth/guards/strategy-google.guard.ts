import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { User as UserClient } from '@prisma/client';
import { Profile, Strategy } from 'passport-google-oauth20';
import { AuthenticationService } from '../authentication.service';
import { AUTHENTICATION_PROVIDERS } from '../inputs';
@Injectable()
export class StrategyGoogle extends PassportStrategy(Strategy, 'google') {
	constructor(private authenticationService: AuthenticationService) {
		super({
			clientID: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			callbackURL: process.env.GOOGLE_CALLBACK,
			scope: ['profile', 'email'],
		});
	}

	async validate(accessToken: string, refreshToken: string, profile: Profile): Promise<UserClient> {
		// console.log(accessToken);
		// console.log(refreshToken);
		// console.log(profile);

		const user = await this.authenticationService.loginSocial(profile, {
			accessToken,
			provider: AUTHENTICATION_PROVIDERS.GOOGLE,
		});

		return user;
	}
}
