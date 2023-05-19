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

	removeAccount(userId: string): Promise<User | null> {
		try {
			return this.prisma.user.delete({
				where: {
					id: userId,
				},
			});
		} catch (error) {
			console.log(error);
			return null;
		}
	}
}
