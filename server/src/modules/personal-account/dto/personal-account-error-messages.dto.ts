export enum PERSONAL_ACCOUNT_ERROR_MONTHLY_DATA {
	NOT_FOUND = 'Unable to found associated month. Can not add daily entry before you used the service, or in the future months',
}

export enum PERSONAL_ACCOUNT_ERROR_DAILY_DATA {
	NOT_FOUND = 'Daily entry for personal account is not found, can not be deleted',
	INCORRECT_USER_ID = 'Daily entry for personal account can not be removed, requester does not match the person who has created the entry',
}

export enum PERSONAL_ACCOUNT_ERROR {
	NOT_FOUND = 'Personal account not found, can not be removed',
}
