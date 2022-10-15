import { Module } from '@nestjs/common';
import { PrismaService } from '../../../prisma';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

@Module({
	providers: [UserService, UserResolver, PrismaService],
	exports: [UserService, UserResolver],
})
export class UserModule {}
