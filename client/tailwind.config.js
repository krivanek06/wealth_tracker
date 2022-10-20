/** @type {import('tailwindcss').Config} */

module.exports = {
	prefix: 'tw-',
	important: true, // to overwride angular material
	content: ['./src/**/*.{html,ts,scss}'],
	theme: {
		extend: {},
	},
	plugins: [],
};
