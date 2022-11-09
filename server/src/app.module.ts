import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AppService } from './app.service';
import { Authenticationodule } from './auth';
import { GraphQLBackendModule } from './graphql';
import { AssetManagerModule, InvestmentAccountModule, PersonalAccountModule, UserModule } from './modules';

@Module({
	imports: [
		GraphQLBackendModule,
		Authenticationodule,
		ConfigModule.forRoot(),
		JwtModule.register({ secret: process.env.JWT_SECRET }),

		// modules
		UserModule,
		PersonalAccountModule,
		InvestmentAccountModule,
		AssetManagerModule,
	],
	controllers: [],
	providers: [AppService],
})
export class AppModule {}
