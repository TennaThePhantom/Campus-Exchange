import { Button } from "@/components/ui/button";
import { ShoppingBag, Plus, LogOut, Users, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { db } from "../firebase/firebase";
import { collection, query, onSnapshot } from "firebase/firestore";

export default function Dashboard() {
	const navigate = useNavigate();
	const [activeListings, setActiveListings] = useState(0);
	const [totalUsers, setTotalUsers] = useState(0);
	const [itemsSold, setItemsSold] = useState(0);
	const [loading, setLoading] = useState(true);

	// Real-time listener for active listings
	useEffect(() => {
		const listingsRef = collection(db, "listings");
		const q = query(listingsRef);

		const unsubscribeListings = onSnapshot(
			q,
			(snapshot) => {
				const active = snapshot.docs.filter((doc) => {
					const data = doc.data();
					return data.status !== "sold" && data.status !== "deleted";
				}).length;
				setActiveListings(active);
				setLoading(false);
			},
			(error) => {
				console.error("Error fetching listings:", error);
				setLoading(false);
			},
		);

		return () => unsubscribeListings();
	}, []);

	// Real-time listener for total users (all accounts)
	useEffect(() => {
		const usersRef = collection(db, "users");
		const q = query(usersRef);

		const unsubscribeUsers = onSnapshot(
			q,
			(snapshot) => {
				// Count ALL users in the users collection
				const total = snapshot.docs.length;
				setTotalUsers(total);
			},
			(error) => {
				console.error("Error fetching users:", error);
			},
		);

		return () => unsubscribeUsers();
	}, []);

	return (
		<div className="min-h-screen bg-gray-100 p-10">
			{/* Top Bar */}
			<div className="mb-8 flex items-center justify-between">
				{/* Page title */}
				<div>
					<h1 className="text-6xl font-bold text-sky-200">Welcome Back!</h1>

					<p className="mt-2 text-2xl text-gray-600">
						What would you like to do today?
					</p>
				</div>

				{/* Logout Button */}
				<Button
					onClick={() => navigate("/signin")}
					variant="outline"
					className="flex items-center gap-2 border-gray-300 bg-white text-black hover:bg-gray-100"
				>
					<LogOut size={20} />
					Log Out
				</Button>
			</div>

			{/* Cards */}
			<div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
				{/* Browse Marketplace Card */}
				<div className="rounded-3xl bg-white p-10 text-center shadow-lg">
					<div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
						<ShoppingBag size={42} className="text-green-700" />
					</div>

					<h2 className="text-5xl font-bold text-sky-200">
						Browse Marketplace
					</h2>

					<p className="mt-6 text-2xl text-gray-600">
						Explore textbooks, electronics, furniture, bikes, clothing, and more
						posted by UML students.
					</p>

					<Button
						onClick={() => navigate("/browse")}
						className="mt-10 rounded-full bg-green-600 px-8 py-6 text-lg hover:bg-green-700"
					>
						Start Shopping →
					</Button>
				</div>

				{/* Sell Item Card */}
				<div className="rounded-3xl bg-white p-10 text-center shadow-lg">
					<div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-yellow-100">
						<Plus size={42} className="text-yellow-700" />
					</div>

					<h2 className="text-5xl font-bold text-sky-200">Sell an Item</h2>

					<p className="mt-6 text-2xl text-gray-600">
						List your unused items quickly and safely for other UML students.
					</p>

					<Button
						onClick={() => navigate("/sell")}
						className="mt-10 rounded-full bg-yellow-500 px-8 py-6 text-lg text-black hover:bg-yellow-600"
					>
						Create Listing →
					</Button>
				</div>
			</div>

			{/* Statistic in eal-time */}
			<div className="mt-12 grid grid-cols-3 overflow-hidden rounded-3xl bg-white shadow-lg">
				<div className="border-r p-8 text-center">
					<div className="flex items-center justify-center gap-3">
						<Eye className="h-8 w-8 text-green-700" />
						<h3 className="text-5xl font-bold text-green-700">
							{activeListings}
						</h3>
					</div>
					<p className="mt-2 text-gray-500">Active Listings</p>
					{loading && <p className="text-xs text-gray-400 mt-1">Loading...</p>}
				</div>

				<div className="border-r p-8 text-center">
					<div className="flex items-center justify-center gap-3">
						<Users className="h-8 w-8 text-green-700" />
						<h3 className="text-5xl font-bold text-green-700">{totalUsers}</h3>
					</div>
					<p className="mt-2 text-gray-500">Total Users</p>
				</div>

				<div className="p-8 text-center">
					<div className="flex items-center justify-center gap-3">
						<ShoppingBag className="h-8 w-8 text-green-700" />
						<h3 className="text-5xl font-bold text-green-700">{itemsSold}</h3>
					</div>
					<p className="mt-2 text-gray-500">Items Sold This Month</p>
				</div>
			</div>
		</div>
	);
}
