import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { PersonalAccountFacadeService } from '../../../../../core/api';

@Component({
	selector: 'app-tag-selector',
	templateUrl: './tag-selector.component.html',
	styleUrls: ['./tag-selector.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagSelectorComponent implements OnInit {
	availableTagImages$!: Observable<string[]>;
	skeletons = Array(21);
	constructor(
		private dialogRef: MatDialogRef<TagSelectorComponent>,
		private personalAccountFacadeService: PersonalAccountFacadeService
	) {}
	ngOnInit(): void {
		this.availableTagImages$ = this.personalAccountFacadeService.getPersonalAccountAvailableTagImages();
	}

	onImageClick(url: string) {
		this.dialogRef.close({ url });
	}
}
