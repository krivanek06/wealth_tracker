import { Directive, ElementRef, HostListener, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DefaultImageType } from '../models';
import { GeneralFunctionUtil } from '../utils';

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

	@HostListener('error')
	onError() {
		this.imageRef.nativeElement.setAttribute('src', this.resolveImage(null));
	}

	private setImage(src: string) {
		this.imageRef.nativeElement.setAttribute('src', src);
	}

	private resolveImage(location?: string | null): string {
		if (!location) {
			return 'assets/image-placeholder.jpg';
		}

		if (this.imageType === 'investment_cash') {
			const formattedName = 'cash_' + location.toLowerCase();
			return `assets/investment-account/${formattedName}.svg`;
		}

		if (this.imageType === 'assetId') {
			return GeneralFunctionUtil.getAssetUrl(location);
		}

		if (this.imageType === 'url') {
			return location;
		}

		return 'assets/image-placeholder.jpg';
	}
}
