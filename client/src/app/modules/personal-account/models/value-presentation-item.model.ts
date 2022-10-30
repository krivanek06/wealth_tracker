export interface ValueItem {
	id: string | number;
	name: string | number;
	description?: string;
	value: number;

	// set true if value is percentage
	isPercent?: boolean;
	color?: string;
}
