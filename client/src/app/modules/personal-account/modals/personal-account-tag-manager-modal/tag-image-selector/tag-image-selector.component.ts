import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { PersonalAccountFacadeService } from '../../../../../core/api';

@Component({
	selector: 'app-tag-image-selector',
	templateUrl: './tag-image-selector.component.html',
	styleUrls: ['./tag-image-selector.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagImageSelectorComponent implements OnInit {
	availableTagImages$!: Observable<string[]>;
	constructor(
		private dialogRef: MatDialogRef<TagImageSelectorComponent>,
		private personalAccountFacadeService: PersonalAccountFacadeService
	) {}
	ngOnInit(): void {
		this.availableTagImages$ = this.personalAccountFacadeService.getPersonalAccountAvailableTagImages();
	}

	onImageClick(url: string) {
		this.dialogRef.close({ url });
	}
}
