/*
	Notes from Daniyal July 27:
	I made the search bar feature work, since someone 
	else had already done 98% of it, it was very quick. All I
	had to do was make a variable called filteredListings, and 
	then replace it with the regular listings. when the search bar 
	is empty, all results will show. As someone types in letters, 
	they will become more and more filtered

*/

import React, { useState } from "react";
import { Search, X, Check, Image as ImageIcon, UserCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default function BrowseListings({ setPage }) {
	const [searchQuery, setSearchQuery] = useState("");

	// Mock data
	const listings = [
		{
			id: 1,
			title: "MacBook Air 2020",
			price: "$250",
			location: "North Campus",
		},
		{
			id: 2,
			title: "TI-84 Plus Calculator",
			price: "$50",
			location: "East Campus",
		},
		{
			id: 3,
			title: "Old Windows Laptop",
			price: "$40",
			location: "East Campus",
		},
		{
			id: 4,
			title: "White Ottoman Chair",
			price: "$150",
			location: "South Campus",
		},
		{
			id: 5,
			title: "Calculus 2 Textbook",
			price: "Free",
			location: "North Campus",
		},
		{
			id: 6,
			title: "Bella Air Fryer - Used",
			price: "$25",
			location: "South Campus",
		},
	];

	// filters listings by name, changes all letters to lowercase, making it case insensitive
	const filteredListings = listings.filter((item) =>
		item.title.toLowerCase().includes(searchQuery.toLowerCase())
	);

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
					<a href="#" className="hover:text-red-600 transition-colors">
						Messages
					</a>
					<a href="#" className="hover:text-red-600 transition-colors">
						Log Out
					</a>
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

						{/* Grid */}
						{/* filteredListings makes the results become dynamic, responding to the search bar */}
						<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
							{filteredListings.map((item) => (
								<Card
									key={item.id}
									className="overflow-hidden border-sky-200 bg-white shadow-sm transition-shadow hover:shadow-md"
								>
									{/* Image Placeholder */}
									<div className="flex h-56 w-full items-center justify-center bg-sky-100">
										<ImageIcon
											className="size-16 text-sky-300 opacity-50"
											strokeWidth={1}
										/>
									</div>
									<CardContent className="p-4">
										<h4 className="mb-1 text-base font-medium text-neutral-900 line-clamp-1">
											{item.title}
										</h4>
										<p className="mb-3 text-lg font-bold text-neutral-900">
											{item.price}
										</p>
										<p className="text-sm text-neutral-500">{item.location}</p>
									</CardContent>
								</Card>
							))}
						</div>
					</main>
				</div>
			</div>
		</div>
	);
}
