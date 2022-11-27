import { Field, InterfaceType, registerEnumType } from '@nestjs/graphql';

export enum DATA_MODIFICATION {
	CREATED = 'CREATED',
	REMOVED = 'REMOVED',
}

export interface PubSubDataModificationI<T> {
	modification: DATA_MODIFICATION;
	accountId: string;
	data: T;
}

@InterfaceType()
export abstract class PubSubDataModification {
	@Field(() => DATA_MODIFICATION)
	modification: DATA_MODIFICATION;

	@Field(() => String)
	accountId: string;
}

// register data types

registerEnumType(DATA_MODIFICATION, {
	name: 'DATA_MODIFICATION',
});
