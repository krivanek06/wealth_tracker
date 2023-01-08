export enum PERSONAL_ACCOUNT_ERROR_MONTHLY_DATA {
	NOT_FOUND = 'Monthly data was not found',
}

export enum PERSONAL_ACCOUNT_ERROR_DAILY_DATA {
	NOT_FOUND = 'Daily entry for personal account is not found, can not be deleted',
	INCORRECT_USER_ID = 'Daily entry for personal account can not be removed, requester does not match the person who has created the entry',
}

export enum PERSONAL_ACCOUNT_ERROR {
	NOT_FOUND = 'Personal account not found',
	NOT_ALLOWED_TO_CREATE = 'You reacted you limit of creating personal accounts, no additional personal account is allowed',
}

export enum PERSONAL_ACCOUNT_TAG_ERROR {
	NOT_FOUND = 'Tags were not loaded for the personal account, please contact administrator',
	NOT_FOUND_BY_ID = 'Tag you are looking for was not found, please choose another one',
}
