import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { GraphQLBackendModule } from './graphql';

@Module({
	imports: [GraphQLBackendModule],
	controllers: [],
	providers: [AppService],
})
export class AppModule {}
