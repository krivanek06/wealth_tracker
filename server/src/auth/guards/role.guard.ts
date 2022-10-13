import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

/**
 * Use as @UseGuards(RolesGuard)
 * Reference: https://docs.nestjs.com/guards
 */
@Injectable()
export class RolesGuard implements CanActivate {
	canActivate(context: ExecutionContext): boolean | Promise<boolean> {
		return true;
	}
}
