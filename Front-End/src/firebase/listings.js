// Firestore access for product listings and their sellers.
// Keeping the queries in one place so the browse page and the detail page
// can't drift apart on collection or field names.

import { db } from "../firebase/firebase";
import { collection, addDoc, getDocs, getDoc, doc } from "firebase/firestore";

export const LISTINGS_COLLECTION = "listings";
export const USERS_COLLECTION = "users";

// Dates get written as ISO strings by this app, but a document added by
// hand in the Firebase console comes back as a Timestamp object. Flatten
// both to a string so sorting and display can rely on one shape.
function toIsoString(value) {
	if (!value) return "";
	if (typeof value === "string") return value;
	if (typeof value.toDate === "function") return value.toDate().toISOString();
	if (value instanceof Date) return value.toISOString();
	return String(value);
}

// Fill in anything a listing might be missing so the UI never renders
// "undefined". Called on every document we read.
export function normalizeListing(id, data) {
	const raw = data || {};
	// null/undefined/"" all mean "no price given" - don't let Number() turn
	// them into 0, which formatPrice would render as "Free".
	const hasPrice =
		raw.price !== null && raw.price !== undefined && raw.price !== "";
	const price = hasPrice ? Number(raw.price) : null;

	return {
		id,
		title: raw.title || "Untitled item",
		price: price === null || Number.isNaN(price) ? null : price,
		description: raw.description || "",
		imageUrl: raw.imageUrl || "",
		category: raw.category || "",
		condition: raw.condition || "",
		location: raw.location || "",
		sellerId: raw.sellerId || "",
		createdAt: toIsoString(raw.createdAt),
	};
}

// Same idea for the seller record.
export function normalizeSeller(id, data) {
	const raw = data || {};

	return {
		id,
		studentName: raw.studentName || "UML Student",
		studentId: raw.studentId || "",
		phone: raw.phoneNumber || raw.phone || "", // firebase wants both phone number and phone in this 
		photoURL: raw.photoURL || "",
	};
}

// Newest first. We sort here instead of using orderBy() because orderBy
// silently drops documents that are missing the field, and a listing added
// by hand in the Firebase console might not have createdAt.
export async function fetchListings() {
	const snapshot = await getDocs(collection(db, LISTINGS_COLLECTION));
	const listings = snapshot.docs.map((d) => normalizeListing(d.id, d.data()));

	return listings.sort((a, b) =>
		String(b.createdAt).localeCompare(String(a.createdAt)),
	);
}

// Returns null when the id doesn't exist so callers can show "not found"
// instead of an error.
export async function fetchListingById(listingId) {
	if (!listingId) return null;

	const snapshot = await getDoc(doc(db, LISTINGS_COLLECTION, listingId));
	if (!snapshot.exists()) return null;

	return normalizeListing(snapshot.id, snapshot.data());
}

export async function fetchSellerById(sellerId) {
	if (!sellerId) return null;

	const snapshot = await getDoc(doc(db, USERS_COLLECTION, sellerId));
	if (!snapshot.exists()) return null;

	return normalizeSeller(snapshot.id, snapshot.data());
}

export async function createListing(listing) {
	const docRef = await addDoc(collection(db, LISTINGS_COLLECTION), {
		title: listing.title,
		price: listing.price,
		description: listing.description,
		imageUrl: listing.imageUrl || "",
		category: listing.category || "",
		condition: listing.condition || "",
		location: listing.location || "",
		sellerId: listing.sellerId || "",
		createdAt: new Date().toISOString(),
	});

	return docRef.id;
}
