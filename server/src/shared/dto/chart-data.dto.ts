import { Field, Float, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ChartSeries {
	@Field(() => String, {
		description: 'Name of the series',
	})
	name: string;

	@Field(() => [[Float, Float]], {
		description: 'Chart Data',
	})
	data: [number, number][];
}
