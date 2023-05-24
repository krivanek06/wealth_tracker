export type ThemeType = 'light' | 'dark';

export const LightTheme = {
	background: {
		name: '--backgroundDashboard',
		value:
			'linear-gradient(168.19deg, #eaeaea 1.34%, #f2f2f2 1.35%, #efeded 33.36%, #e8e4e4 52.32%, rgb(175 173 173 / 87%) 98.93%)',
	},
	primary: {
		name: '--primary-dark',
		value: '#eb701c',
	},
	grayDark: {
		name: '--gray-dark',
		value: '#818690',
	},
	grayMedium: {
		name: '--gray-medium',
		value: '#9ca3af',
	},
	grayLight: {
		name: '--gray-light',
		value: '#dcdcdc',
	},
} as const;

export const DarkTheme = {
	background: {
		name: '--backgroundDashboard',
		value: 'linear-gradient(168.19deg, #000607 1.34%, #000808 1.35%, #031b1b 33.36%, #021a1a 52.32%, #030000 98.93%)',
	},
	primary: {
		name: '--primary-dark',
		value: '#12aaaa',
	},
	grayDark: {
		name: '--gray-dark',
		value: '#818690',
	},
	grayMedium: {
		name: '--gray-medium',
		value: '#9ca3af',
	},
	grayLight: {
		name: '--gray-light',
		value: '#dcdcdc',
	},
} as const;
