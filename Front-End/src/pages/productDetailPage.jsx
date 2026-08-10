import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Image as ImageIcon, Phone, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { fetchListingById, fetchSellerById } from "../firebase/listings";
import {
	CATEGORIES,
	CONDITIONS,
	LOCATIONS,
	formatPrice,
	labelFor,
} from "@/lib/listingOptions";

export default function ProductDetail() {
	const navigate = useNavigate();
	const { listingId } = useParams(); // Get listingId from URL
	const [listing, setListing] = useState(null);
	const [seller, setSeller] = useState(null);
	const [sellerFailed, setSellerFailed] = useState(false);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	const loadListing = useCallback(async () => {
		setLoading(true);
		setError("");
		setSellerFailed(false);
		try {
			const found = await fetchListingById(listingId);
			setListing(found);

			// A missing seller shouldn't hide the product, so this gets its
			// own try/catch instead of failing the whole page.
			if (found?.sellerId) {
				try {
					setSeller(await fetchSellerById(found.sellerId));
				} catch (sellerErr) {
					console.error("Failed to load seller:", sellerErr);
					setSellerFailed(true);
				}
			} else {
				setSeller(null);
			}
		} catch (err) {
			console.error("Failed to load listing:", err);
			setError(
				"We couldn't load this listing. Check your connection and try again.",
			);
		} finally {
			setLoading(false);
		}
	}, [listingId]);

	useEffect(() => {
		loadListing();
	}, [loadListing]);

	return (
		<div className="min-h-svh bg-sky-50 text-neutral-900 font-sans pb-12">
			{/* Navigation Bar */}
			<nav className="flex items-center justify-between px-8 py-4 bg-white border-b border-sky-200">
				<div className="flex gap-8 text-sm font-medium">
					<button
						type="button"
						onClick={() => navigate("/dashboard")}
						className="hover:text-red-600 transition-colors"
					>
						Home
					</button>
					<button
						type="button"
						onClick={() => navigate("/browse")}
						className="hover:text-red-600 transition-colors"
					>
						Browse
					</button>
					<button
						type="button"
						onClick={() => navigate("/sell")}
						className="hover:text-red-600 transition-colors"
					>
						Sell
					</button>
				</div>
				<UserCircle className="size-8 text-sky-600" strokeWidth={1.5} />
			</nav>

			<div className="px-8 py-8 max-w-[1100px] mx-auto">
				<Button
					variant="outline"
					onClick={() => navigate("/browse")}
					className="mb-6 border-sky-200 bg-white text-neutral-700 hover:bg-sky-50"
				>
					<ArrowLeft className="mr-1 size-4" /> Back to Listings
				</Button>

				{loading && (
					<div className="grid grid-cols-1 gap-8 md:grid-cols-2">
						<div className="h-96 w-full animate-pulse rounded-xl bg-sky-100" />
						<div className="space-y-4">
							<div className="h-8 w-3/4 animate-pulse rounded bg-sky-100" />
							<div className="h-6 w-1/3 animate-pulse rounded bg-sky-100" />
							<div className="h-24 w-full animate-pulse rounded bg-sky-100" />
						</div>
					</div>
				)}

				{!loading && error && (
					<div className="rounded-lg border border-red-200 bg-white p-8 text-center shadow-sm">
						<p className="mb-4 text-neutral-700">{error}</p>
						<Button
							onClick={loadListing}
							className="bg-red-600 text-white hover:bg-red-700"
						>
							Try Again
						</Button>
					</div>
				)}

				{!loading && !error && !listing && (
					<div className="rounded-lg border border-sky-200 bg-white p-12 text-center shadow-sm">
						<p className="mb-1 text-lg font-medium text-neutral-900">
							Listing not found
						</p>
						<p className="mb-6 text-sm text-neutral-500">
							It may have been removed by the seller.
						</p>
						<Button
							onClick={() => navigate("/browse")}
							className="bg-red-600 text-white hover:bg-red-700"
						>
							Back to Listings
						</Button>
					</div>
				)}

				{!loading && !error && listing && (
					<div className="grid grid-cols-1 gap-8 md:grid-cols-2">
						{/* Photo */}
						<DetailImage imageUrl={listing.imageUrl} title={listing.title} />

						{/* Product info */}
						<div>
							<h1 className="mb-2 text-3xl font-black text-neutral-900">
								{listing.title}
							</h1>
							<p className="mb-4 text-2xl font-bold text-neutral-900">
								{formatPrice(listing.price)}
							</p>

							<div className="mb-6 flex flex-wrap gap-2">
								{listing.category && (
									<Badge
										variant="secondary"
										className="bg-sky-100 text-neutral-700 font-normal rounded-md px-2 py-1"
									>
										{labelFor(CATEGORIES, listing.category)}
									</Badge>
								)}
								{listing.condition && (
									<Badge
										variant="secondary"
										className="bg-sky-100 text-neutral-700 font-normal rounded-md px-2 py-1"
									>
										{labelFor(CONDITIONS, listing.condition)}
									</Badge>
								)}
								{listing.location && (
									<Badge
										variant="secondary"
										className="bg-sky-100 text-neutral-700 font-normal rounded-md px-2 py-1"
									>
										{labelFor(LOCATIONS, listing.location)}
									</Badge>
								)}
							</div>

							<h2 className="mb-2 text-sm font-semibold text-neutral-900">
								Description
							</h2>
							<p className="mb-6 whitespace-pre-line text-neutral-700">
								{listing.description || "No description provided."}
							</p>

							{listing.createdAt && (
								<p className="mb-6 text-sm text-neutral-500">
									Posted {formatDate(listing.createdAt)}
								</p>
							)}

							{/* Seller contact - there is no messaging feature, so this
							    is how a buyer reaches the seller */}
							<SellerContactCard seller={seller} failed={sellerFailed} />
						</div>
					</div>
				)}
			</div>
		</div>
	);
}

function SellerContactCard({ seller, failed }) {
	return (
		<Card className="border-sky-200 bg-white shadow-sm">
			<CardContent className="p-6">
				<h2 className="mb-1 text-lg font-bold text-neutral-900">
					Seller Contact Info
				</h2>
				<p className="mb-5 text-sm text-neutral-500">
					Campus Exchange has no messaging — contact this seller directly.
				</p>

				{failed || !seller ? (
					<p className="text-sm text-neutral-600">
						{failed
							? "Seller info unavailable right now."
							: "This listing has no seller on file."}
					</p>
				) : (
					<div className="flex items-center gap-4">
						<SellerAvatar seller={seller} />
						<div>
							<p className="font-medium text-neutral-900">
								{seller.studentName}
							</p>
							{seller.phone ? (
								<a
									href={`tel:${seller.phone}`}
									className="mt-1 flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700"
								>
									<Phone className="size-4" strokeWidth={2} />
									{seller.phone}
								</a>
							) : (
								<p className="mt-1 flex items-center gap-2 text-sm text-neutral-500">
									<Phone className="size-4" strokeWidth={2} />
									Phone not provided
								</p>
							)}
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
}

// Profile picture, falling back to the seller's initials.
function SellerAvatar({ seller }) {
	const [failed, setFailed] = useState(false);

	if (seller.photoURL && !failed) {
		return (
			<img
				src={seller.photoURL}
				alt={seller.studentName}
				onError={() => setFailed(true)}
				className="size-16 rounded-full object-cover"
			/>
		);
	}

	return (
		<div className="flex size-16 items-center justify-center rounded-full bg-sky-100 text-xl font-bold text-sky-700">
			{initialsOf(seller.studentName)}
		</div>
	);
}

function DetailImage({ imageUrl, title }) {
	const [failed, setFailed] = useState(false);

	if (!imageUrl || failed) {
		return (
			<div className="flex h-96 w-full items-center justify-center rounded-xl bg-sky-100">
				<ImageIcon
					className="size-20 text-sky-300 opacity-50"
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
			className="h-96 w-full rounded-xl object-cover"
		/>
	);
}

function initialsOf(name) {
	if (!name) return "?";
	return name
		.split(" ")
		.filter(Boolean)
		.slice(0, 2)
		.map((part) => part[0].toUpperCase())
		.join("");
}

function formatDate(isoString) {
	const date = new Date(isoString);
	if (Number.isNaN(date.getTime())) return isoString;
	return date.toLocaleDateString();
}
