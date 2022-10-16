import { ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { InvestmentAccountModule, PersonalAccountModule, UserModule } from '../modules';
import { GraphQLHelper } from './graphql.helper';
import { GraphQLResolver } from './graphql.resolver';

@Module({
	imports: [
		ConfigModule,
		GraphQLModule.forRoot<ApolloDriverConfig>(GraphQLHelper.getApolloDriverConfig()),
		// modules
		UserModule,
		PersonalAccountModule,
		InvestmentAccountModule,
	],
	providers: [GraphQLResolver],
})
export class GraphQLBackendModule {}
