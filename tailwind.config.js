const colors = require("tailwindcss/colors");

module.exports = {
	purge: ["./src/pages/**/*.{ts,tsx}", "./src/components/**/*.{ts,tsx}"],
	darkMode: false, // or 'media' or 'class'
	theme: {
		extend: {
			colors: {
				gray: colors.gray,
				coolGray: colors.coolGray,
				blueGray: colors.blueGray,
				trueGray: colors.trueGray,
			},
		},
	},
	variants: {
		extend: {},
	},
	plugins: [],
};
