import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { GraphQLBackendModule } from './graphql';
import { LodashService } from './utils';

@Module({
	imports: [GraphQLBackendModule, LodashService],
	controllers: [],
	providers: [AppService],
})
export class AppModule {}
