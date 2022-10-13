import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

@Module({
	providers: [UserService, UserResolver, PrismaService],
	exports: [UserService, UserResolver],
})
export class UserModule {}
