import { DownloadResponse, Storage } from '@google-cloud/storage';
import { Injectable } from '@nestjs/common';
import { GOOGLE_BUCKET, GOOGLE_STORAGE_SERVICE_ACCOUNT } from '../../environments';
import { StorageFile } from './storage-files.model';

@Injectable()
export class StorageFilesService {
	private storage: Storage;
	private bucketPath = GOOGLE_BUCKET;

	constructor() {
		this.storage = new Storage({
			credentials: {
				...GOOGLE_STORAGE_SERVICE_ACCOUNT,
			},
		});
	}

	async save(path: string, contentType: string, media: Buffer, metadata: { [key: string]: string }[]) {
		const object = metadata.reduce((obj, item) => Object.assign(obj, item), {});
		const file = this.storage.bucket(this.bucketPath).file(path);
		const stream = file.createWriteStream();
		stream.on('finish', async () => {
			return await file.setMetadata({
				metadata: object,
			});
		});
		stream.end(media);
	}

	async delete(path: string) {
		await this.storage.bucket(this.bucketPath).file(path).delete({ ignoreNotFound: true });
	}

	async getFilesFromFolder(folder: string): Promise<string[]> {
		const [files] = await this.storage.bucket(this.bucketPath).getFiles({ prefix: folder });

		return files.map((d) => `${d.storage.apiEndpoint}/${this.bucketPath}/${d.name}`);
	}

	async get(path: string): Promise<StorageFile> {
		const fileResponse: DownloadResponse = await this.storage.bucket(this.bucketPath).file(path).download();
		const [buffer] = fileResponse;
		const storageFile = new StorageFile();
		storageFile.buffer = buffer;
		storageFile.metadata = new Map<string, string>();
		return storageFile;
	}

	async getWithMetaData(path: string): Promise<StorageFile> {
		const [metadata] = await this.storage.bucket(this.bucketPath).file(path).getMetadata();
		const fileResponse: DownloadResponse = await this.storage.bucket(this.bucketPath).file(path).download();
		const [buffer] = fileResponse;

		const storageFile = new StorageFile();
		storageFile.buffer = buffer;
		storageFile.metadata = new Map<string, string>(Object.entries(metadata || {}));
		storageFile.contentType = storageFile.metadata.get('contentType');
		return storageFile;
	}
}
