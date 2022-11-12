import { Module } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { PUB_SUB } from './graphql.types';

@Module({
	imports: [],
	providers: [
		{
			provide: PUB_SUB,
			useClass: PubSub,
		},
	],
	exports: [PUB_SUB],
})
export class GraphQLPubsubBackendModule {}
