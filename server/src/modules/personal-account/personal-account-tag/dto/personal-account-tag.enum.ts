import { registerEnumType } from '@nestjs/graphql';
import { PersonalAccountTagDataType } from '@prisma/client';

registerEnumType(PersonalAccountTagDataType, {
	name: 'PersonalAccountTagDataType',
});
