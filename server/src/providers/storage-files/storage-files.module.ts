import { Module } from '@nestjs/common';
import { StorageFilesService } from './storage-files.service';

@Module({
	providers: [StorageFilesService],
	exports: [StorageFilesService],
})
export class StorageFilesModule {}
