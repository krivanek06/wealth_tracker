import { registerEnumType } from '@nestjs/graphql';

/**
 * execution context property name
 */
export const REQ_USER_PROPERTY = 'REQ_USER';

export enum AUTHENTICATION_PROVIDERS {
	/** gmail authentication  */
	GOOGLE = 'GOOGLE',
}

registerEnumType(AUTHENTICATION_PROVIDERS, {
	name: 'AUTHENTICATION_PROVIDERS',
});
