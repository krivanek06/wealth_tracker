import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthenticationModule } from './auth';
import { JWT_SECRET } from './environments';
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
		JwtModule.register({ secret: JWT_SECRET }),

		// modules
		UserModule,
		PersonalAccountModule,
		InvestmentAccountModule,
		AssetManagerModule,
		AccountManagerModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
