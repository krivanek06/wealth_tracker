import { GraphQLScalarType } from 'graphql';

export const Void = new GraphQLScalarType({
	description: 'Void custom scalar',
	name: 'Void',
	parseLiteral: () => null,
	parseValue: () => null,
	serialize: () => null,
});

// USE: @Inject(PUB_SUB) private pubSub: PubSubEngine
export const PUB_SUB = 'PUB_SUB';
