import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { AuthenticationResolver } from './authentication.resolver';
import { AuthenticationService } from './authentication.service';

@Module({
	providers: [AuthenticationResolver, AuthenticationService, PrismaService],
	exports: [AuthenticationResolver, AuthenticationService],
})
export class Authenticationodule {}
