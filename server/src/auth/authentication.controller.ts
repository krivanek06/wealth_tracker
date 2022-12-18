import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { IncomingMessage } from 'http';
import { AuthenticationService } from './authentication.service';
import { AuthenticationGoogleGuard } from './guards';

@Controller('auth')
export class AuthenticationController {
	constructor(private authenticationService: AuthenticationService) {}

	@Get('test')
	test() {
		return 'test';
		// initiates the Google OAuth2 login flow
	}

	@Get('google/login')
	@UseGuards(AuthenticationGoogleGuard)
	googleLogin() {
		console.log('aaa');
		// initiates the Google OAuth2 login flow
	}

	@Get('google/callback')
	@UseGuards(AuthenticationGoogleGuard)
	googleLoginCallback(@Req() req: IncomingMessage, @Res() res) {
		return this.authenticationService.prepareLoggedUserOutput(req?.['user']);
	}
}
