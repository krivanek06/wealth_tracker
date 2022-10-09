import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { AuthenticationService } from '../../auth';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

@Module({
	providers: [UserService, UserResolver, PrismaService, AuthenticationService],
	exports: [UserService, UserResolver],
})
export class UserModule {}
