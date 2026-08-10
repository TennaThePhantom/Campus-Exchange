import React, { useCallback, useEffect, useState } from "react";
import { Search, X, Check, Image as ImageIcon, UserCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { fetchListings } from "../firebase/listings";
import { LOCATIONS, formatPrice, labelFor } from "@/lib/listingOptions";

export default function BrowseListings({ setPage, onSelectListing }) {
	const [searchQuery, setSearchQuery] = useState("");
	const [listings, setListings] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	const loadListings = useCallback(async () => {
		setLoading(true);
		setError("");
		try {
			const data = await fetchListings();
			setListings(data);
		} catch (err) {
			console.error("Failed to load listings:", err);
			setError("We couldn't load the listings. Check your connection and try again.");
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		loadListings();
	}, [loadListings]);

	// filter on what the student typed in the search box
	const query = searchQuery.trim().toLowerCase();
	const visibleListings = query
		? listings.filter(
				(item) =>
					item.title.toLowerCase().includes(query) ||
					item.description.toLowerCase().includes(query),
			)
		: listings;

	return (
		<div className="min-h-svh bg-sky-50 text-neutral-900 font-sans pb-12">
			{/* Navigation Bar */}
			<nav className="flex items-center justify-between px-8 py-4 bg-white border-b border-sky-200">
				<div className="flex gap-8 text-sm font-medium">
					<button
						type="button"
						onClick={() => setPage("dashboard")}
						className="hover:text-red-600 transition-colors"
					>
						Home
					</button>
					<button
						type="button"
						onClick={() => setPage("sell")}
						className="hover:text-red-600 transition-colors"
					>
						Sell
					</button>
					<button
						type="button"
						onClick={() => setPage("landing")}
						className="hover:text-red-600 transition-colors"
					>
						Log Out
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
						placeholder="Search Textbooks, Electronics, Furniture, etc..."
						className="w-full rounded-full border-sky-200 bg-white py-6 pl-12 pr-4 text-base focus-visible:ring-sky-300 shadow-sm"
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
								{["Books", "Electronics", "Furniture"].map((keyword) => (
									<Badge
										key={keyword}
										variant="secondary"
										className="bg-sky-100 text-neutral-700 hover:bg-sky-200 cursor-pointer font-normal rounded-md px-2 py-1"
									>
										{keyword} <X className="ml-1 size-3" />
									</Badge>
								))}
							</div>
						</div>

						{/* Categories */}
						<div className="mb-8 space-y-3">
							{["All Items", "Books", "Electronics"].map((category, idx) => (
								<div key={category} className="flex items-center gap-3">
									<Checkbox
										id={`cat-${idx}`}
										defaultChecked={idx === 0}
										className="border-sky-300 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
									/>
									<label
										htmlFor={`cat-${idx}`}
										className="text-sm font-medium leading-none text-neutral-700"
									>
										{category}
									</label>
								</div>
							))}
						</div>

						{/* Price Slider */}
						<div className="mb-8">
							<div className="mb-4 flex items-center justify-between text-sm text-neutral-700">
								<span className="font-semibold text-neutral-900">Price</span>
								<span>$0-999</span>
							</div>
							<Slider
								defaultValue={[0, 999]}
								max={1000}
								step={1}
								className="w-full [&_[role=slider]]:bg-red-600"
							/>
						</div>

						{/* Location */}
						<div className="mb-8 space-y-3">
							<h3 className="mb-3 text-sm font-semibold text-neutral-900">
								Location
							</h3>
							{["South Campus", "North Campus", "East Campus"].map(
								(location, idx) => (
									<div key={location} className="flex items-center gap-3">
										<Checkbox
											id={`loc-${idx}`}
											defaultChecked
											className="border-sky-300 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
										/>
										<label
											htmlFor={`loc-${idx}`}
											className="text-sm font-medium leading-none text-neutral-700"
										>
											{location}
										</label>
									</div>
								),
							)}
						</div>

						{/* Date */}
						<div className="space-y-3">
							<h3 className="mb-3 text-sm font-semibold text-neutral-900">
								Date Added
							</h3>
							<div className="flex items-center gap-3">
								<Checkbox
									id="date-oldest"
									className="border-sky-300 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
								/>
								<label
									htmlFor="date-oldest"
									className="text-sm font-medium leading-none text-neutral-700"
								>
									Oldest
								</label>
							</div>
							<div className="flex items-center gap-3">
								<Checkbox
									id="date-newest"
									defaultChecked
									className="border-sky-300 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
								/>
								<label
									htmlFor="date-newest"
									className="text-sm font-medium leading-none text-neutral-700"
								>
									Newest
								</label>
							</div>
						</div>
					</aside>

					{/* Listings Grid Area */}
					<main className="col-span-1 lg:col-span-3">
						{/* Sort Controls */}
						<div className="mb-6 flex flex-wrap justify-end gap-2">
							<Button className="bg-neutral-900 text-white hover:bg-neutral-800">
								<Check className="mr-1 size-4" /> New
							</Button>
							<Button
								variant="outline"
								className="border-sky-200 bg-white text-neutral-600 hover:bg-sky-50"
							>
								Price ascending
							</Button>
							<Button
								variant="outline"
								className="border-sky-200 bg-white text-neutral-600 hover:bg-sky-50"
							>
								Price descending
							</Button>
							<Button
								variant="outline"
								className="border-sky-200 bg-white text-neutral-600 hover:bg-sky-50"
							>
								Rating
							</Button>
						</div>

						{/* Loading */}
						{loading && (
							<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
								{[0, 1, 2, 3, 4, 5].map((n) => (
									<Card
										key={n}
										className="overflow-hidden border-sky-200 bg-white shadow-sm"
									>
										<div className="h-56 w-full animate-pulse bg-sky-100" />
										<CardContent className="p-4">
											<div className="mb-2 h-4 w-3/4 animate-pulse rounded bg-sky-100" />
											<div className="mb-3 h-5 w-1/3 animate-pulse rounded bg-sky-100" />
											<div className="h-3 w-1/2 animate-pulse rounded bg-sky-100" />
										</CardContent>
									</Card>
								))}
							</div>
						)}

						{/* Error */}
						{!loading && error && (
							<div className="rounded-lg border border-red-200 bg-white p-8 text-center shadow-sm">
								<p className="mb-4 text-neutral-700">{error}</p>
								<Button
									onClick={loadListings}
									className="bg-red-600 text-white hover:bg-red-700"
								>
									Try Again
								</Button>
							</div>
						)}

						{/* Empty */}
						{!loading && !error && visibleListings.length === 0 && (
							<div className="rounded-lg border border-sky-200 bg-white p-12 text-center shadow-sm">
								<ImageIcon
									className="mx-auto mb-4 size-12 text-sky-300"
									strokeWidth={1}
								/>
								<p className="mb-1 text-lg font-medium text-neutral-900">
									{listings.length === 0
										? "No listings yet"
										: "No listings match your search"}
								</p>
								<p className="mb-6 text-sm text-neutral-500">
									{listings.length === 0
										? "Be the first student to post something."
										: "Try a different word."}
								</p>
								{listings.length === 0 && (
									<Button
										onClick={() => setPage("sell")}
										className="bg-red-600 text-white hover:bg-red-700"
									>
										Create a Listing
									</Button>
								)}
							</div>
						)}

						{/* Grid */}
						{!loading && !error && visibleListings.length > 0 && (
							<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
								{visibleListings.map((item) => (
									<Card
										key={item.id}
										className="overflow-hidden border-sky-200 bg-white shadow-sm transition-shadow hover:shadow-md"
									>
										<button
											type="button"
											onClick={() => onSelectListing?.(item.id)}
											className="w-full cursor-pointer text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
										>
											{/* Image, falls back to the placeholder icon */}
											<ListingImage
												imageUrl={item.imageUrl}
												title={item.title}
											/>
											<CardContent className="p-4">
												<h4 className="mb-1 text-base font-medium text-neutral-900 line-clamp-1">
													{item.title}
												</h4>
												<p className="mb-2 text-lg font-bold text-neutral-900">
													{formatPrice(item.price)}
												</p>
												<p className="mb-3 text-sm text-neutral-600 line-clamp-2 min-h-[2.5rem]">
													{item.description || "No description provided."}
												</p>
												<p className="text-sm text-neutral-500">
													{labelFor(LOCATIONS, item.location) ||
														"Location not listed"}
												</p>
											</CardContent>
										</button>
									</Card>
								))}
							</div>
						)}
					</main>
				</div>
			</div>
		</div>
	);
}

// Shows the listing photo, or the placeholder icon when there isn't one
// (or when the URL is broken).
function ListingImage({ imageUrl, title }) {
	const [failed, setFailed] = useState(false);

	if (!imageUrl || failed) {
		return (
			<div className="flex h-56 w-full items-center justify-center bg-sky-100">
				<ImageIcon
					className="size-16 text-sky-300 opacity-50"
					strokeWidth={1}
				/>
			</div>
		);
	}

	return (
		<img
			src={imageUrl}
			alt={title}
			onError={() => setFailed(true)}
			className="h-56 w-full object-cover"
		/>
	);
}
