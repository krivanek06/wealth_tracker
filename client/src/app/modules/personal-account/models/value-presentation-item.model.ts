export interface ValueItem {
	name: string | number;
	description?: string;
	value: number;

	// set true if value is percentage
	isPercent?: boolean;
	color?: string;
}
