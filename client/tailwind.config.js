/** @type {import('tailwindcss').Config} */

module.exports = {
	//prefix: 'tw-',
	important: true, // to overwride angular material
	content: ['./src/**/*.{html,ts,scss}'],
	theme: {
		fontFamily: {
			sans: ['sans-serif', 'Poppins'],
			serif: ['sans-serif', 'Poppins'],
		},
		extend: {},
	},
	plugins: [],
};
