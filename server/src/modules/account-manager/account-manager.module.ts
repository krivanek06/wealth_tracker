import { Module, forwardRef } from '@nestjs/common';
import { InvestmentAccountModule } from '../investment-account';
import { PersonalAccountModule } from '../personal-account';
import { UserModule } from '../user';
import { PrismaService } from './../../prisma/prisma.service';
import { AccountManagerResolver } from './resolvers';
import { AccountManager, AccountManagerPopulationService } from './services';

@Module({
	imports: [
		forwardRef(() => PersonalAccountModule),
		forwardRef(() => InvestmentAccountModule),
		forwardRef(() => UserModule),
	],
	providers: [PrismaService, AccountManager, AccountManagerPopulationService, AccountManagerResolver],
	exports: [AccountManagerResolver],
})
export class AccountManagerModule {}
