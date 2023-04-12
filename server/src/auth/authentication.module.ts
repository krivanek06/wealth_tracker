import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma';
import { SendGridModule } from '../providers/sendgrid';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationResolver } from './authentication.resolver';
import { AuthenticationService } from './authentication.service';
import { AuthenticationGoogleGuard, AuthorizationGuard, StrategyGoogle } from './guards';
import { SessionSerializer } from './session-serializer.util';

@Module({
	imports: [SendGridModule],
	providers: [
		AuthenticationResolver,
		AuthenticationService,
		PrismaService,
		StrategyGoogle,
		AuthorizationGuard,
		JwtService,
		AuthenticationGoogleGuard,
		SessionSerializer,
	],
	controllers: [AuthenticationController],
	exports: [AuthenticationResolver, AuthenticationService],
})
export class AuthenticationModule {}
