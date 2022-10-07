import { ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PersonalAccountTagModule, UserModule } from '../modules';

import { GraphQLModule } from '@nestjs/graphql';

import { GraphQLHelper } from './graphql.helper';
import { GraphQLResolver } from './graphql.resolver';

@Module({
	imports: [
		ConfigModule,
		GraphQLModule.forRoot<ApolloDriverConfig>(GraphQLHelper.getApolloDriverConfig()),
		// modules
		UserModule,
		PersonalAccountTagModule,
	],
	providers: [GraphQLResolver],
})
export class GraphQLBackendModule {}
