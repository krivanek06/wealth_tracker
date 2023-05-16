import { Controller, Get } from '@nestjs/common';

@Controller('public')
export class AppController {
	/**
	 *
	 * @returns true if the application is running
	 */
	@Get('/start')
	applicationStart(): boolean {
		return true;
	}
}
