import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { GOOGLE_CALLBACK, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from '../../environments';
import { AuthenticationService } from '../authentication.service';
@Injectable()
export class StrategyGoogle extends PassportStrategy(Strategy, 'google') {
	constructor(private authenticationService: AuthenticationService) {
		super({
			clientID: GOOGLE_CLIENT_ID,
			clientSecret: GOOGLE_CLIENT_SECRET,
			callbackURL: GOOGLE_CALLBACK,
			scope: ['profile', 'email'],
		});
	}

	validate(accessToken: string, refreshToken: string, profile: Profile) {
		// console.log(accessToken);
		// console.log(refreshToken);
		// console.log(profile);

		return { accessToken, profile };
	}
}
