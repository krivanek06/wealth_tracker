import { ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {
	InvestmentAccountHistoryModule,
	InvestmentAccountModule,
	PersonalAccountModule,
	PersonalAccountMonthlyModule,
	PersonalAccountTagModule,
	UserModule,
} from '../modules';

import { GraphQLModule } from '@nestjs/graphql';

import { GraphQLHelper } from './graphql.helper';
import { GraphQLResolver } from './graphql.resolver';

@Module({
	imports: [
		ConfigModule,
		GraphQLModule.forRoot<ApolloDriverConfig>(GraphQLHelper.getApolloDriverConfig()),
		// modules
		UserModule,
		PersonalAccountModule,
		PersonalAccountTagModule,
		PersonalAccountMonthlyModule,

		InvestmentAccountModule,
		InvestmentAccountHistoryModule,
	],
	providers: [GraphQLResolver],
})
export class GraphQLBackendModule {}
