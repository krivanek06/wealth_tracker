export const STORAGE_MAIN_KEY = 'SPEND_MINDFUL';
export const STORAGE_AUTH_ACCESS_TOKEN = 'ACCESS_TOKEN';
export const STORAGE_THEME_PREFERENCE = 'THEME_PREFERENCE';

export type StorageServiceStructureKeys = typeof STORAGE_AUTH_ACCESS_TOKEN | typeof STORAGE_THEME_PREFERENCE;

export type StorageServiceStructure = {
	[key in StorageServiceStructureKeys]: any;
};

export const EMPTY_STORAGE_SERVICE_STRUCTURE: StorageServiceStructure = {
	[STORAGE_AUTH_ACCESS_TOKEN]: null,
	[STORAGE_THEME_PREFERENCE]: null,
};
