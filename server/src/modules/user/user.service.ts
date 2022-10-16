import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma';

@Injectable()
export class UserService {
	constructor(private prismaService: PrismaService) {}
}
