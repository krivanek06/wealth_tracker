import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
	selector: '[appDefaultImg]',
	standalone: true,
})
export class DefaultImgDirective {
	@Input() set src(location: string | null | undefined) {
		this.setImage(this.resolveImage(location));
	}
	@Input() imageType: 'default' | 'tags' = 'default';

	constructor(private imageRef: ElementRef) {}

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
		return 'assets/image-placeholder.jpg';
	}
}
