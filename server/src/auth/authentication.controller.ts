import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { IncomingMessage } from 'http';
import { Profile } from 'passport-google-oauth20';
import { AuthenticationService } from './authentication.service';
import { AuthenticationGoogleGuard } from './guards';
import { AUTHENTICATION_PROVIDERS } from './inputs';

@Controller('auth')
export class AuthenticationController {
	constructor(private authenticationService: AuthenticationService) {}

	@Get('google/login')
	@UseGuards(AuthenticationGoogleGuard)
	googleLogin() {
		// initiates the Google OAuth2 login flow
	}

	@Get('google/callback')
	@UseGuards(AuthenticationGoogleGuard)
	async googleLoginCallback(@Req() req: IncomingMessage, @Res() res) {
		const { accessToken, profile } = req?.['user'] as { accessToken: string; profile: Profile };
		const user = await this.authenticationService.loginSocial(profile, {
			accessToken,
			provider: AUTHENTICATION_PROVIDERS.GOOGLE,
		});
		const userOutput = this.authenticationService.prepareLoggedUserOutput(user);
		res.redirect(`${process.env.LOGIN_REDIRECT}?accessToken=${userOutput.accessToken}`);
	}
}
