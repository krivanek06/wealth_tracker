/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
	//prefix: 'tw-',
	important: true, // to overwride angular material
	content: ['./src/**/*.{html,ts,scss}'],
	theme: {
		fontFamily: {
			sans: ['sans-serif', 'Poppins'],
			serif: ['sans-serif', 'Poppins'],
		},
		extend: {
			colors: {
				'wt-background-dark': 'var(--background-dark)',
				'wt-background-medium': 'var(--background-medium)',
				'wt-background-light': 'var(--background-light)',

				/* primary */
				'wt-primary-dark': 'var(--primary)',

				/* success */
				'wt-success-medium': 'var(--success)',

				/* danger */
				'wt-danger-medium': 'var(--danger)',

				/* gray */
				'wt-gray-dark': 'var(--gray-dark)',
				'wt-gray-medium': 'var(--gray-medium)',
				'wt-gray-light': 'var(--gray-light)',
			},
			flex: {
				2: '2 2 0%',
			},
		},
		screens: {
			xs: '475px',
			...defaultTheme.screens,
		},
	},
	plugins: [],
};
