export type GoogleAuthResponse = {
	id: string;
	email: string;
	verified_email: boolean;
	name: string;
	given_name: string;
	family_name: string;
	picture: string;
	locale: string;
	authorization_response: {
		state: string;
		access_token: string;
		token_type: string;
		expires_in: string;
		scope: string;
		authuser: string;
		prompt: string;
	};
	access_token: string;
};
