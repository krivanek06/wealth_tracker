import { HttpStatus } from '@nestjs/common';
import { GraphQLError } from 'graphql';

export class CustomGraphQlError extends GraphQLError {
	constructor(message: string, code: string | HttpStatus) {
		super(message, {
			extensions: {
				exception: {
					code: String(code),
				},
			},
		});
	}
}
