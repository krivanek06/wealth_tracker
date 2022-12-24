import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { User as UserClient } from '@prisma/client';
import { VerifyCallback } from 'passport-google-oauth20';
import { PrismaService } from './../prisma/prisma.service';

@Injectable()
export class SessionSerializer extends PassportSerializer {
	constructor(private readonly prismaService: PrismaService) {
		super();
	}

	serializeUser(user: UserClient, done: VerifyCallback) {
		console.log('Serializer User');
		done(null, user);
	}

	async deserializeUser(payload: any, done: VerifyCallback) {
		const user = await this.prismaService.user.findUnique({
			where: {
				id: payload.id,
			},
		});
		console.log('Deserialize User');
		console.log(user);
		return user ? done(null, user) : done(null, null);
	}
}
