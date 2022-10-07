import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { GraphQLBackendModule } from './graphql';
import { PersonalAccountTagModule } from './modules/personal-account-tag/personal-account-tag.module';

@Module({
	imports: [GraphQLBackendModule, PersonalAccountTagModule],
	controllers: [],
	providers: [AppService],
})
export class AppModule {}
