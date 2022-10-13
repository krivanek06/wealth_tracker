import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'prisma/prisma.service';
import { AuthenticationResolver } from './authentication.resolver';
import { AuthenticationService } from './authentication.service';
import { AuthenticationGoogleGuard, AuthorizationGuard, StrategyGoogle } from './guards';

@Module({
	providers: [
		AuthenticationResolver,
		AuthenticationService,
		PrismaService,
		StrategyGoogle,
		JwtService,
		AuthorizationGuard,
		AuthenticationGoogleGuard,
	],
	exports: [AuthenticationResolver, AuthenticationService],
})
export class Authenticationodule {}
