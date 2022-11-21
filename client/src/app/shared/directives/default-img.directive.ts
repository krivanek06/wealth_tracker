import { Directive, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DefaultImageType } from '../models';

@Directive({
	selector: '[appDefaultImg]',
	standalone: true,
})
export class DefaultImgDirective implements OnChanges {
	@Input() src?: string | null;
	@Input() imageType: DefaultImageType = 'default';

	constructor(private imageRef: ElementRef) {}

	ngOnChanges(changes: SimpleChanges): void {
		this.setImage(this.resolveImage(this.src));
	}

	private setImage(src: string) {
		this.imageRef.nativeElement.setAttribute('src', src);
	}

	private resolveImage(location?: string | null): string {
		if (!location) {
			return 'assets/image-placeholder.jpg';
		}

		if (this.imageType === 'tags') {
			const formattedName = location.toLowerCase().split(' ').join('_');
			return `assets/personal-account-tags/${formattedName}.svg`;
		}
		if (this.imageType === 'url') {
			return location;
		}

		return 'assets/image-placeholder.jpg';
	}
}
