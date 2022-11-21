import { DefaultImageType } from './uncotegorized.model';

export interface ValuePresentItem<T> {
	imageSrc?: string | null;
	imageType: DefaultImageType;

	name: string;
	value: number;
	valuePrct: number;

	color: string;

	// item that will be propagated to the parent
	item: T;
}
