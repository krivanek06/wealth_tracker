import { AfterViewInit, Directive, ElementRef, Input } from '@angular/core';

@Directive({
	selector: '[appDefaultImg]',
	standalone: true,
})
export class DefaultImgDirective implements AfterViewInit {
	@Input() src!: string | null | undefined;
	@Input() imageType: 'default' | 'tags' = 'default';

	constructor(private imageRef: ElementRef) {}

	ngAfterViewInit(): void {
		const img = new Image();

		if (!this.src) {
			this.setImage(this.resolveImage());
			return;
		}
		img.onload = () => {
			if (this.src) {
				this.setImage(this.src);
			}
		};

		img.onerror = () => {
			// Set a placeholder image
			this.setImage(this.resolveImage());
		};

		img.src = this.src;
	}

	private setImage(src: string) {
		this.imageRef.nativeElement.setAttribute('src', src);
	}

	private resolveImage(): string {
		if (!this.src) {
			return 'assets/image-placeholder.jpg';
		}

		if (this.imageType === 'tags') {
			const formattedName = this.src.toLowerCase().split(' ').join('_');
			return `assets/personal-account-tags/${formattedName}.svg`;
		}
		return 'assets/image-placeholder.jpg';
	}
}
