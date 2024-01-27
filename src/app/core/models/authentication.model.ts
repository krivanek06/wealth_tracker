export type LoginUserInput = {
	email: string;
	password: string;
};

export type RegisterUserInput = LoginUserInput & {
	passwordRepeat: string;
};
