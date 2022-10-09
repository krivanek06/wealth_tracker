import { ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {
	PersonalAccountModule,
	PersonalAccountMonthlyModule,
	PersonalAccountTagModule,
} from './../modules/personal-account';

import { GraphQLModule } from '@nestjs/graphql';
import { UserModule } from '../modules/user';

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

		// InvestmentAccountModule,
		// InvestmentAccountHistoryModule,
	],
	providers: [GraphQLResolver],
})
export class GraphQLBackendModule {}
