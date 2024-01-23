import { Pipe, PipeTransform } from '@angular/core';
import { PersonalAccountService, PersonalAccountTag } from '../../../core/api';
import {} from '../../../core/graphql';

@Pipe({
	name: 'getTagById',
	standalone: true,
})
export class GetTagByIdPipe implements PipeTransform {
	constructor(private personalAccountFacadeService: PersonalAccountService) {}

	transform(tagId: string): PersonalAccountTag | undefined {
		return this.personalAccountFacadeService.personalAccountTagsSignal().find((d) => d.id === tagId);
	}
}
