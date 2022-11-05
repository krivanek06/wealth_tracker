export const getTagImageLocation = (tagName: string) => {
	const formattedName = tagName.toLowerCase().split(' ').join('_');
	return `assets/personal-account-tags/${formattedName}.svg`;
};
