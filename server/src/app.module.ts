import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AppService } from './app.service';
import { AuthenticationModule } from './auth';
import { GraphQLBackendModule } from './graphql';
import {
	AccountManagerModule,
	AssetManagerModule,
	InvestmentAccountModule,
	PersonalAccountModule,
	UserModule,
} from './modules';

@Module({
	imports: [
		GraphQLBackendModule,
		AuthenticationModule,
		ConfigModule.forRoot(),
		JwtModule.register({ secret: process.env.JWT_SECRET }),

		// modules
		UserModule,
		PersonalAccountModule,
		InvestmentAccountModule,
		AssetManagerModule,
		AccountManagerModule,
	],
	controllers: [],
	providers: [AppService],
})
export class AppModule {}
