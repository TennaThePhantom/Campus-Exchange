/*
	Notes from Daniyal July 27:
	I made the search bar feature work, since someone
	else had already done 98% of it, it was very quick. All I
	had to do was make a variable called filteredListings, and
	then replace it with the regular listings. when the search bar
	is empty, all results will show. As someone types in letters,
	they will become more and more filtered

	Notes from Daniyal August 1:
	I got the filters to start working now, as well as changing
	the colors of the filter stuff to our background color theme.
	I was having some issues getting the listings to show up
	after getting filtering to work, but it seems good now


    Notes from Diya 08/02 :
    I updated the Browse Listings page to use React Router for navigation.
    The Home, Sell, and Log Out buttons now redirect users to the correct
    pages instead of using the old setPage() function. This makes navigation
    smoother and allows the app to switch pages without requiring a refresh.

    Notes from Daniyal August 8:
	I added an "other/misc" filter based on what the beta user testing
	said. I also removed the "Messages" link in the navigation bar, since we 
	won't be adding a messaging page feature
*/
import React, { useMemo, useState, useEffect } from "react";
import { Search, X, Check, Image as ImageIcon, UserCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase/firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
 
export default function BrowseListings() {
	const navigate = useNavigate();
	const [searchQuery, setSearchQuery] = useState("");
	const [listings, setListings] = useState([]);
	const [loading, setLoading] = useState(true);
 
	const checkboxClass =
		"border-sky-300 data-checked:bg-sky-300 data-checked:border-sky-300";
 
	// categories for filters
	const ALL_CATEGORIES = ["Books", "Electronics", "Furniture", "Clothing", "Appliances"];
	const ALL_LOCATIONS = ["South Campus", "North Campus", "East Campus"];
	const SORTS = ["New", "Price Ascending", "Price Descending"];
 
	const [keywords, setKeywords] = useState([]);
	const [categories, setCategories] = useState(ALL_CATEGORIES);
	const [locations, setLocations] = useState(ALL_LOCATIONS);
	const [priceRange, setPriceRange] = useState([0, 999]);
	const [sort, setSort] = useState("New");
	const [dateAdded, setDateAdded] = useState("newest");
 
	// real time listener for listings from Firestore
	useEffect(() => {
		const q = query(collection(db, "listings"), orderBy("createdAt", "desc"));
		const unsubscribe = onSnapshot(
			q,
			(snapshot) => {
				const listingsData = [];
				snapshot.forEach((doc) => {
					listingsData.push({ id: doc.id, ...doc.data() });
				});
				setListings(listingsData);
				setLoading(false);
				console.log("Listings updated in real-time:", listingsData.length);
			},
			(error) => {
				console.error("Error fetching listings:", error);
				setLoading(false);
			},
		);
		return () => unsubscribe();
	}, []);
 
	// adding keywords to search
	function addKeywordFromSearch() {
		const k = searchQuery.trim();
		if (k && !keywords.includes(k)) setKeywords([...keywords, k]);
		setSearchQuery("");
	}
 
	// removing keywords
	function removeKeyword(k) {
		setKeywords(keywords.filter((w) => w !== k));
	}
 
	// toggling categories
	function toggleCategory(cat) {
		setCategories((prev) =>
			prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
		);
	}
 
	// toggling for miscellaneous, suggestion from Beta testing
	function toggleMiscKeyword() {
		setKeywords((prev) =>
			prev.includes("Other") ? prev.filter((w) => w !== "Other") : [...prev, "Other"]
		);
	}
 
	// toggling all items, checks off everything if "all categories" is selected
	function toggleAllItems(checked) {
		setCategories(checked ? ALL_CATEGORIES : []);
	}
 
	// toggling location
	function toggleLocation(loc) {
		setLocations((prev) =>
			prev.includes(loc) ? prev.filter((l) => l !== loc) : [...prev, loc]
		);
	}
 
	// price ascending/descending
	// real Firestore data
	function parsePrice(priceStr) {
		if (typeof priceStr === "number") return priceStr;
		if (priceStr === "Free") return 0;
		return Number(String(priceStr).replace("$", ""));
	}
 
	// filters listings by name, price, category, etc
	const filteredListings = useMemo(() => {
		let items = listings.filter((item) => {
			const price = parsePrice(item.price);
			const matchesSearch =
				searchQuery.trim() === "" ||
				item.title.toLowerCase().includes(searchQuery.toLowerCase());
			const matchesKeywords =
				keywords.length === 0 ||
				keywords.some((k) => item.title.toLowerCase().includes(k.toLowerCase()));
			const matchesCategory = categories.includes(item.category);
			// Filter by campus (checks if location contains "East Campus", "South Campus", or "North Campus")
			const matchesLocation = locations.some((campus) => item.location.includes(campus));
			const matchesPrice = price >= priceRange[0] && price <= priceRange[1];
 
			return matchesSearch && matchesKeywords && matchesCategory && matchesLocation && matchesPrice;
		});
 
		if (sort === "Price Ascending") {
			items = [...items].sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
		}
		if (sort === "Price Descending") {
			items = [...items].sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
		}
		if (sort === "New") {
			items = [...items].sort((a, b) => {
				const aDate = a.createdAt?.toDate?.() || new Date(0);
				const bDate = b.createdAt?.toDate?.() || new Date(0);
				return bDate - aDate;
			});
		}
 
		return items;
	}, [listings, searchQuery, keywords, categories, locations, priceRange, sort]);
 
	if (loading) {
		return (
			<div className="min-h-svh bg-sky-50 flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto"></div>
					<p className="mt-4 text-neutral-600">Loading listings...</p>
				</div>
			</div>
		);
	}
 
	return (
		<div className="min-h-svh bg-sky-50 text-neutral-900 font-sans pb-12">
			{/* Navigation Bar */}
			<nav className="flex items-center justify-between px-8 py-4 bg-white border-b border-sky-200">
				<div className="flex gap-8 text-sm font-medium">
					<button onClick={() => navigate("/")} className="hover:text-red-600 transition-colors">
						Home
					</button>
					<button onClick={() => navigate("/sell")} className="hover:text-red-600 transition-colors">
						Sell
					</button>
					<button onClick={() => navigate("/signin")} className="hover:text-red-600 transition-colors">
						Sign In
					</button>
				</div>
				<UserCircle className="size-8 text-sky-600" strokeWidth={1.5} />
			</nav>
 
			{/* Header & Search */}
			<div className="px-8 py-8 max-w-[1400px] mx-auto">
				<h1 className="mb-6 text-4xl font-black text-neutral-900">
					Browse Listings
				</h1>
 
				<div className="relative mb-8">
					<Search
						className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-neutral-500"
						strokeWidth={2}
					/>
					<Input
						type="text"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addKeywordFromSearch())}
						placeholder="Search Textbooks, Electronics, Furniture, etc..."
						className="w-full rounded-full border-sky-200 bg-white py-6 pl-14 pr-4 text-base focus-visible:ring-sky-300 shadow-sm"
					/>
				</div>
 
				{/* main Content Layout */}
				<div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
					{/* sidebar / Filters */}
					<aside className="col-span-1 h-fit rounded-lg border border-sky-200 bg-white p-6 shadow-sm">
						{/* keywords */}
						<div className="mb-8">
							<h3 className="mb-3 text-sm font-semibold text-neutral-900">
								Keywords
							</h3>
							<div className="flex flex-wrap gap-2">
								{keywords.map((keyword) => (
									<Badge
										key={keyword}
										variant="secondary"
										onClick={() => removeKeyword(keyword)}
										className="bg-sky-100 text-neutral-700 hover:bg-sky-200 cursor-pointer font-normal rounded-md px-2 py-1"
									>
										{keyword} <X className="ml-1 size-3" />
									</Badge>
								))}
							</div>
						</div>
 
						{/* Categories */}
						<div className="mb-8 space-y-3">
							<div className="flex items-center gap-3">
								<Checkbox
									id="cat-all"
									checked={categories.length === ALL_CATEGORIES.length}
									onCheckedChange={toggleAllItems}
									className={checkboxClass}
								/>
								<label htmlFor="cat-all" className="text-sm font-medium leading-none text-neutral-700">All Items</label>
							</div>
							{ALL_CATEGORIES.map((category) => (
								<div key={category} className="flex items-center gap-3">
									<Checkbox
										id={`cat-${category}`}
										checked={categories.includes(category)}
										onCheckedChange={() => toggleCategory(category)}
										className={checkboxClass}
									/>
									<label htmlFor={`cat-${category}`} className="text-sm font-medium leading-none text-neutral-700">{category}</label>
								</div>
							))}
							{/* Other/misc */}
							<div className="flex items-center gap-3">
								<Checkbox
									id="cat-other"
									checked={keywords.includes("Other")}
									onCheckedChange={toggleMiscKeyword}
									className={checkboxClass}
								/>
								<label htmlFor="cat-other" className="text-sm font-medium leading-none text-neutral-700">
									Other / Miscellaneous
								</label>
							</div>
						</div>
 
						{/* Price Slider */}
						<div className="mb-8">
							<div className="mb-4 flex items-center justify-between text-sm text-neutral-700">
								<span className="font-semibold text-neutral-900">Price</span>
								<span>${priceRange[0]}-{priceRange[1]}</span>
							</div>
							<Slider
								value={priceRange}
								onValueChange={setPriceRange}
								max={999}
								step={1}
								className="w-full [&_[data-slot=slider-range]]:bg-sky-300"
							/>
						</div>
 
						{/* Location */}
						<div className="mb-8 space-y-3">
							<h3 className="mb-3 text-sm font-semibold text-neutral-900">
								Location
							</h3>
							{ALL_LOCATIONS.map((location) => (
								<div key={location} className="flex items-center gap-3">
									<Checkbox
										id={`loc-${location}`}
										checked={locations.includes(location)}
										onCheckedChange={() => toggleLocation(location)}
										className={checkboxClass}
									/>
									<label htmlFor={`loc-${location}`} className="text-sm font-medium leading-none text-neutral-700">
										{location}
									</label>
								</div>
							))}
						</div>
 
						{/* Date */}
						<div className="space-y-3">
							<h3 className="mb-3 text-sm font-semibold text-neutral-900">
								Date Added
							</h3>
							<div className="flex items-center gap-3">
								<Checkbox
									id="date-oldest"
									checked={dateAdded === "oldest"}
									onCheckedChange={() => setDateAdded("oldest")}
									className={checkboxClass}
								/>
								<label htmlFor="date-oldest" className="text-sm font-medium leading-none text-neutral-700">
									Oldest
								</label>
							</div>
							<div className="flex items-center gap-3">
								<Checkbox
									id="date-newest"
									checked={dateAdded === "newest"}
									onCheckedChange={() => setDateAdded("newest")}
									className={checkboxClass}
								/>
								<label htmlFor="date-newest" className="text-sm font-medium leading-none text-neutral-700">
									Newest
								</label>
							</div>
						</div>
					</aside>
 
					{/* Listings Grid Area */}
					<main className="col-span-1 lg:col-span-3">
						{/* Sort Controls */}
						<div className="mb-6 flex flex-wrap justify-end gap-2">
							{SORTS.map((s) => (
								<Button
									key={s}
									onClick={() => setSort(s)}
									variant={sort === s ? "default" : "outline"}
									className={
										sort === s
											? "bg-neutral-900 text-white hover:bg-neutral-800"
											: "border-sky-200 bg-white text-neutral-600 hover:bg-sky-50"
									}
								>
									{sort === s && <Check className="mr-1 size-4" />}
									{s}
								</Button>
							))}
						</div>
 
						<p className="mb-4 text-sm text-neutral-500">
							{filteredListings.length} listing{filteredListings.length !== 1 ? "s" : ""} found
						</p>
 
						{/* Grid */}
						<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
							{filteredListings.map((item) => (
								<Card
									key={item.id}
									className="overflow-hidden border-sky-200 bg-white shadow-sm transition-shadow hover:shadow-md"
								>
									{/* image (real photo if the listing has one, placeholder icon if not) */}
									<div className="flex h-56 w-full items-center justify-center bg-sky-100">
										{item.imageUrl ? (
											<img
												src={item.imageUrl}
												alt={item.title}
												className="h-full w-full object-cover"
											/>
										) : (
											<ImageIcon className="size-16 text-sky-300 opacity-50" strokeWidth={1} />
										)}
									</div>
									<CardContent className="p-4">
										<h4 className="mb-1 text-base font-medium text-neutral-900 line-clamp-1">
											{item.title}
										</h4>
										<p className="mb-3 text-lg font-bold text-neutral-900">
											${item.price}
										</p>
										<p className="text-sm text-neutral-500">{item.location}</p>
										<p className="text-xs text-neutral-400 mt-1">Category: {item.category}</p>
									</CardContent>
								</Card>
							))}
						</div>
 
						{filteredListings.length === 0 && (
							<div className="col-span-full text-center py-12">
								<p className="text-neutral-500">No listings found.</p>
								<p className="text-sm text-neutral-400">
									Try adjusting your filters or be the first to post an item!
								</p>
							</div>
						)}
					</main>
				</div>
			</div>
		</div>
	);
}
 
