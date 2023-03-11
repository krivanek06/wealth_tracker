/**
 * If price of some asset is not updated for at least N days, update it
 */
export const ASSET_PRICE_UPDATE_THRESHOLD_HOURS = 1;
export const ASSET_PRICE_UPDATE_MAX = 100;

export enum ASSET_STOCK_SECTOR_TYPE_IMAGES {
	basic_materials = 'https://storage.googleapis.com/frequently_accessible_assets/investment-account/basic_materials.svg',
	technology = 'https://storage.googleapis.com/frequently_accessible_assets/investment-account/technology.svg',
	communication_services = 'https://storage.googleapis.com/frequently_accessible_assets/investment-account/communication_services.svg',
	consumer_cyclical = 'https://storage.googleapis.com/frequently_accessible_assets/investment-account/consumer_cyclical.svg',
	consumer_defensive = 'https://storage.googleapis.com/frequently_accessible_assets/investment-account/consumer_defensive.svg',
	energy = 'https://storage.googleapis.com/frequently_accessible_assets/investment-account/energy.svg',
	financial_services = 'https://storage.googleapis.com/frequently_accessible_assets/investment-account/financial_services.svg',
	healthcare = 'https://storage.googleapis.com/frequently_accessible_assets/investment-account/healthcare.svg',
	industrials = 'https://storage.googleapis.com/frequently_accessible_assets/investment-account/industrials.svg',
	real_estate = 'https://storage.googleapis.com/frequently_accessible_assets/investment-account/real_estate.svg',
	utilities = 'https://storage.googleapis.com/frequently_accessible_assets/investment-account/utilities.svg',
	crypto = 'https://storage.googleapis.com/frequently_accessible_assets/investment-account/crypto.svg',
}
