import { IsString, IsUUID } from 'class-validator';

export class RequestUser {
	@IsUUID()
	public id: string;

	@IsString()
	public name: string;

	@IsString()
	public email: string;
}
