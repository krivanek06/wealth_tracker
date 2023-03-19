import { Pipe, PipeTransform } from '@angular/core';
import { map, Observable } from 'rxjs';
import { PersonalAccountFacadeService } from '../../../core/api';
import { PersonalAccountTag } from '../../../core/graphql';

@Pipe({
	name: 'getTagById',
	standalone: true,
})
export class GetTagByIdPipe implements PipeTransform {
	constructor(private personalAccountFacadeService: PersonalAccountFacadeService) {}

	transform(tagId: string): Observable<PersonalAccountTag | undefined> {
		return this.personalAccountFacadeService
			.getPersonalAccountDetailsByUser()
			.pipe(map((res) => res.personalAccountTag.find((d) => d.id === tagId)));
	}
}
