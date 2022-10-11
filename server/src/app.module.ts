import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { AppService } from './app.service';
import { Authenticationodule, AuthorizationGuard } from './auth';
import { GraphQLBackendModule } from './graphql';

@Module({
	imports: [
		GraphQLBackendModule,
		Authenticationodule,
		ConfigModule.forRoot(),
		JwtModule.register({ secret: process.env.JWT_SECRET }),
	],
	controllers: [],
	providers: [
		AppService,
		{
			provide: APP_GUARD,
			useClass: AuthorizationGuard,
		},
	],
})
export class AppModule {}
