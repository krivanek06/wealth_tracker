import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SendGridService } from './sendgrid.service';

@Module({
	providers: [SendGridService, ConfigService],
	exports: [SendGridService],
})
export class SendGridModule {}
