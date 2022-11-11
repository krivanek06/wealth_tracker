import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { HttpStatus } from '@nestjs/common';
import { ApolloError } from 'apollo-server-fastify';

export const INTERNAL_SERVER_ERROR_MESSAGE = 'Oops, something went wrong';

export class GraphQLHelper {
	public static getApolloDriverConfig(): ApolloDriverConfig {
		return {
			driver: ApolloDriver,
			installSubscriptionHandlers: true,
			fieldResolverEnhancers: ['filters'],
			cache: 'bounded',
			autoSchemaFile: true,
			cors: {
				credentials: true,
				origin: true,
			},
			formatError: (error: ApolloError) => {
				return {
					message: GraphQLHelper.getMessage(error),
					statusCode: GraphQLHelper.getStatusCode(error),
				};
			},
			context: ({ req, res, connection, payload, request, reply }) => {
				return {
					req,
					res,
					connection,
					payload,
					request,
					reply,
				};
			},
		};
	}

	public static getStatusCode(error: unknown): HttpStatus {
		/**
		 * Apollo errors https://bit.ly/3LGOm8r
		 */
		const badRequestErrors = [
			'UserInputError',
			'ValidationError',
			'PersistedQueryNotSupportedError',
			'PersistedQueryNotFoundError',
		];
		const isHttpStatusCode = (value: string) => Object.values(HttpStatus).includes(parseInt(value));

		switch (true) {
			case error.constructor?.name && badRequestErrors.includes(error.constructor?.name):
				return HttpStatus.BAD_REQUEST;
			case isHttpStatusCode(error['status']):
				return error['status'];
			default:
				return HttpStatus.INTERNAL_SERVER_ERROR;
		}
	}

	public static getMessage(error: unknown): string {
		const isStringMessage = (value: unknown) => typeof value === 'string';

		switch (true) {
			case isStringMessage(error['message']):
				return error['message'];
			default:
				return INTERNAL_SERVER_ERROR_MESSAGE;
		}
	}
}
