// Seeds sample sellers and listings so the browse page has real Firestore
// data to read. Safe to run more than once - every document uses a fixed id,
// so a second run overwrites instead of duplicating.
//
//   npm run seed
//
// Uses the same firebase config the app uses - no extra credentials.

import { db } from "../src/firebase/firebase.js";
import { doc, setDoc } from "firebase/firestore";

const sellers = [
	{
		id: "seed-user-1",
		studentName: "Jane Doe",
		studentId: "01234567",
		ucard: true,
		umass: true,
		umassLowell: true,
		student: true,
		sixteenDigitNumber: "",
		// Generic drawn avatar (inline SVG, no external host, not a real
		// person). Swap for a real photo once profiles can be edited.
		photoURL:
			"data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%20128%20128'%3E%3Crect%20width='128'%20height='128'%20fill='%23f59e0b'/%3E%3Ccircle%20cx='64'%20cy='48'%20r='22'%20fill='%23fff'/%3E%3Cpath%20d='M20%20128c0-24%2020-40%2044-40s44%2016%2044%2040z'%20fill='%23fff'/%3E%3C/svg%3E",
		phone: "(978) 555-0142",
		verifiedAt: "2026-08-01T12:00:00.000Z",
	},
	{
		// deliberately has no phone and no photo, so the fallbacks are visible
		id: "seed-user-2",
		studentName: "Alex Rivera",
		studentId: "07654321",
		ucard: true,
		umass: true,
		umassLowell: true,
		student: true,
		sixteenDigitNumber: "",
		photoURL: "",
		phone: "",
		verifiedAt: "2026-08-02T12:00:00.000Z",
	},
];

const listings = [
	{
		id: "seed-listing-1",
		title: "MacBook Air 2020",
		price: 250,
		description:
			"M1 MacBook Air, 8GB RAM, 256GB SSD. Battery health 91%. Comes with the original charger. Used for two semesters of CS coursework.",
		imageUrl:
			"https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=60",
		category: "E",
		condition: "S",
		location: "FOX",
		sellerId: "seed-user-1",
		createdAt: "2026-08-08T09:30:00.000Z",
	},
	{
		id: "seed-listing-2",
		title: "TI-84 Plus Calculator",
		price: 50,
		description:
			"Required for Calc 1 and 2. Screen is perfect, cover included, batteries not included.",
		imageUrl:
			"https://images.unsplash.com/photo-1587145820266-a5951ee6f620?auto=format&fit=crop&w=800&q=60",
		category: "E",
		condition: "U",
		location: "LEI",
		sellerId: "seed-user-1",
		createdAt: "2026-08-07T14:15:00.000Z",
	},
	{
		// no imageUrl - exercises the placeholder icon fallback
		id: "seed-listing-3",
		title: "Calculus 2 Textbook",
		price: 0,
		description:
			"Stewart Calculus 8th edition. Some highlighting in the first few chapters. Free to whoever wants it, just pick it up.",
		imageUrl: "",
		category: "B",
		condition: "U",
		location: "STAR",
		sellerId: "seed-user-2",
		createdAt: "2026-08-06T11:00:00.000Z",
	},
	{
		id: "seed-listing-4",
		title: "White Ottoman Chair",
		price: 150,
		description:
			"Barely used accent chair, no stains or tears. Too big for my dorm room. You will need a car to move it.",
		imageUrl:
			"https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=60",
		category: "F",
		condition: "S",
		location: "CON",
		sellerId: "seed-user-2",
		createdAt: "2026-08-05T16:45:00.000Z",
	},
	{
		id: "seed-listing-5",
		title: "Bella Air Fryer",
		price: 25,
		description:
			"2 quart air fryer, works great. Cleaned and ready to go. Selling because I'm moving off campus.",
		imageUrl: "",
		category: "A",
		condition: "U",
		location: "RIVW",
		sellerId: "seed-user-1",
		createdAt: "2026-08-04T10:20:00.000Z",
	},
	{
		id: "seed-listing-6",
		title: "UML Riverhawks Hoodie",
		price: 20,
		description:
			"Size large, navy blue, washed a handful of times. No rips or fading.",
		imageUrl: "",
		category: "C",
		condition: "S",
		location: "DON",
		sellerId: "seed-user-2",
		createdAt: "2026-08-03T08:10:00.000Z",
	},
];

async function seed() {
	console.log("Seeding sellers...");
	for (const { id, ...data } of sellers) {
		await setDoc(doc(db, "users", id), data);
		console.log(`  users/${id}  (${data.studentName})`);
	}

	console.log("Seeding listings...");
	for (const { id, ...data } of listings) {
		await setDoc(doc(db, "listings", id), data);
		console.log(`  listings/${id}  (${data.title})`);
	}

	console.log(
		`\nDone. ${sellers.length} sellers, ${listings.length} listings.`,
	);
	process.exit(0);
}

seed().catch((err) => {
	console.error("Seed failed:", err);
	process.exit(1);
});
