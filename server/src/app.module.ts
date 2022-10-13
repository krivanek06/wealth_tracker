import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AppService } from './app.service';
import { Authenticationodule } from './auth';
import { GraphQLBackendModule } from './graphql';

@Module({
	imports: [
		GraphQLBackendModule,
		Authenticationodule,
		ConfigModule.forRoot(),
		JwtModule.register({ secret: process.env.JWT_SECRET }),
	],
	controllers: [],
	providers: [AppService],
})
export class AppModule {}
