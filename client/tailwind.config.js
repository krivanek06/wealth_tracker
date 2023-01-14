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
				'wt-color-background-dark': 'var(--color-background-dark)',
				'wt-color-background-medium': 'var(--color-background-medium)',
			},
		},
		screens: {
			xs: '475px',
			...defaultTheme.screens,
		},
	},
	plugins: [],
};
