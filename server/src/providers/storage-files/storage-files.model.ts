export class StorageFile {
	buffer: Buffer;
	metadata: Map<string, string>;
	contentType: string;
}

export const BUCKET_INJECTION_TOKEN = 'BUCKET_PATH';
