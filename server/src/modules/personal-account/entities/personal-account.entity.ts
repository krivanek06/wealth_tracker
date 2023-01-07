import { Field, ObjectType } from '@nestjs/graphql';
import { PersonalAccount as PersonalAccountClient } from '@prisma/client';
import { AccountIdentification } from '../../../shared/dto';
import { PersonalAccountTag } from './personal-account-tag.entity';

@ObjectType()
export class PersonalAccount extends AccountIdentification implements PersonalAccountClient {
	@Field(() => [PersonalAccountTag])
	personalAccountTag: PersonalAccountTag[];
}
