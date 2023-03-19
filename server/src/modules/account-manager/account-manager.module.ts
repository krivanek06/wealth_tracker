import { Module } from '@nestjs/common';
import { PrismaService } from './../../prisma/prisma.service';
import { AccountManagerResolver } from './resolvers';
import { AccountManager } from './services';

@Module({
	imports: [],
	providers: [PrismaService, AccountManager, AccountManagerResolver],
	exports: [AccountManagerResolver],
})
export class AccountManagerModule {}
