import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { HttpStatus } from '@nestjs/common';
import { ApolloError } from 'apollo-server-express';

export const INTERNAL_SERVER_ERROR_MESSAGE = 'Oops, something went wrong';

export class GraphQLHelper {
	static getApolloDriverConfig(): ApolloDriverConfig {
		return {
			driver: ApolloDriver,
			installSubscriptionHandlers: true,
			fieldResolverEnhancers: ['filters'],
			cache: 'bounded',
			autoSchemaFile: true,
			// cors: {
			// 	credentials: true,
			// 	origin: true,
			// },
			subscriptions: {
				// 'subscriptions-transport-ws': {
				// 	onConnect: (context: any) => {
				// 		const authorization = context?.authorization;
				// 		return {
				// 			req: {
				// 				headers: { authorization: authorization },
				// 			},
				// 		};
				// 	},
				// },
				'graphql-ws': {
					onConnect: (context: any) => {
						const { connectionParams, extra } = context;
						const authorization = connectionParams?.authorization;
						// user validation will remain the same as in the example above
						// when using with graphql-ws, additional context value should be stored in the extra field
						// extra.user = { user: {} };
						// TODO: this does not work properly, no token in AuthorizationGuard
						return {
							//	...context,
							req: {
								headers: { authorization: authorization },
							},
						};
					},
				},
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
				// return connection ? { req: connection.context } : { req };
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
		console.log(error);
		const statusCode = error?.['extensions']?.['exception']?.['code'] ?? error?.['extensions']?.['code'] ?? 500;
		const statusCodeFormatted = Number(statusCode);
		const message = error?.['message'];

		if (statusCodeFormatted === 500) {
			return { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: INTERNAL_SERVER_ERROR_MESSAGE };
		}

		return { statusCode: statusCodeFormatted, message };
	}
}
