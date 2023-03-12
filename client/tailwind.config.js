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
				'wt-primary-dark': 'var(--primary-dark)',

				/* secondary */
				'wt-secondary-dark': 'var(--secondary-dark)',
				'wt-secondary-medium': 'var(--secondary-medium)',

				/* success */
				'wt-success-dark': 'var(--success-dark)',
				'wt-success-medium': 'var(--success-medium)',

				/* danger */
				'wt-danger-dark': 'var(--danger-dark)',
				'wt-danger-medium': 'var(--danger-medium)',

				/* gray */
				'wt-gray-dark-2': 'vat(--gray-dark-2)',
				'wt-gray-dark': 'var(--gray-dark)',
				'wt-gray-medium': 'var(--gray-medium)',
				'wt-gray-light': 'var(--gray-light)',

				/* table */
				'wt-table-hover': 'var(--table-hover)',
				'wt-table-border': 'var(--table-border)',

				/* pulse */
				'wt-pulse': 'var(--gray-medium)',
			},
		},
		screens: {
			xs: '475px',
			...defaultTheme.screens,
		},
	},
	plugins: [],
};
