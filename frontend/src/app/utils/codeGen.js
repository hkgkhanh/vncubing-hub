export async function generateCode(length = 6) {
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	let result = '';
	for (let i = 0; i < length; i++)
		result += chars.charAt(Math.floor(Math.random() * chars.length));
	return result;
}

export function nameToSlug(name, id) {
	const name_part = name
		.toString() // ensure it's a string
		.normalize("NFD") // remove accents
		.replace(/[\u0300-\u036f]/g, "") // remove diacritics
		.toLowerCase() // convert to lowercase
		.trim() // remove extra spaces
		.replace(/[^a-z0-9\s-]/g, "") // remove invalid chars
		.replace(/\s+/g, "-") // replace spaces with -
		.replace(/-+/g, "-"); // collapse multiple -

	if (id < 0) return name_part;

	return [name_part, id].join("-");
}

export const getClientSideCookie = (name) => {
	const cookieValue = document.cookie
		.split('; ')
		.find((row) => row.startsWith(`${name}=`))
		?.split('=')[1];

	return cookieValue ?? null;
};