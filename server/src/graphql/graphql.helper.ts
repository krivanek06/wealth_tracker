import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { HttpStatus } from '@nestjs/common';
import { ApolloError } from 'apollo-server-fastify';

export const INTERNAL_SERVER_ERROR_MESSAGE = 'Oops, something went wrong';

export class GraphQLHelper {
	static getApolloDriverConfig(): ApolloDriverConfig {
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
				// Don't give the specific errors to the client.
				if (error.message.startsWith('Database Error: ')) {
					return new Error('Internal server error');
				}

				return GraphQLHelper.getStatusAndMessage(error);
				// return {
				// 	message: GraphQLHelper.getMessage(error),
				// 	statusCode: GraphQLHelper.getStatusCode(error),
				// };
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

	static getStatusAndMessage(error: unknown): { statusCode: HttpStatus; message: string } {
		const statusCode = error?.['extensions']?.['exception']?.['status'];
		const message = error?.['extensions']?.['exception']?.['message'];

		if (!statusCode || statusCode === 500) {
			return { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: INTERNAL_SERVER_ERROR_MESSAGE };
		}

		return { statusCode, message };
	}
}
