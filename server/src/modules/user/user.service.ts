import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma';
import { User } from './user.entity';

@Injectable()
export class UserService {
	constructor(private prisma: PrismaService) {}

	getUserById(userId: string): Promise<User> {
		return this.prisma.user.findFirstOrThrow({
			where: {
				id: userId,
			},
		});
	}
}
