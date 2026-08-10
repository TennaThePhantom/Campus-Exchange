// Shared vocabulary for listings.
// The codes come from the selects in sell_item.jsx so the sell form,
// the browse page and the detail page all speak the same language.

export const LOCATIONS = {
	FOX: "Fox Hall (East Campus)",
	LEI: "Leitch Hall (East Campus)",
	BOU: "Bougeois Hall (East Campus)",
	DON: "Donahue Hall (East Campus)",
	RIVE: "River Suites East (East Campus)",
	US: "University Suites (East Campus)",
	CON: "Concordia Hall (South Campus)",
	SHE: "Sheehy Hall (South Campus)",
	RIVW: "River Suites West (South Campus)",
	STAR: "Starbucks (North Campus)",
};

export const CATEGORIES = {
	B: "Books",
	E: "Electronics",
	F: "Furniture",
	C: "Clothing",
	A: "Appliances",
};

export const CONDITIONS = {
	N: "New",
	S: "Slightly Used",
	U: "Used",
	D: "Damaged",
};

// Turn a code into something readable. Unknown codes fall through to the
// code itself so a typo shows up on screen instead of a blank space.
export function labelFor(map, code) {
	if (!code) return "";
	return map[code] || code;
}

// Prices are stored as numbers. 0 means the student is giving it away.
export function formatPrice(price) {
	if (price === 0) return "Free";
	if (typeof price !== "number" || Number.isNaN(price)) {
		return "Price not listed";
	}
	return `$${price.toFixed(2)}`;
}
