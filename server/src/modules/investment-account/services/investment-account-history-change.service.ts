import { Injectable } from '@nestjs/common';
import { PrismaService } from './../../../prisma';

@Injectable()
export class InvestmentAccountHistoryChangeService {
	constructor(private prisma: PrismaService) {}
}
