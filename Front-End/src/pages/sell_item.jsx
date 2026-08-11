import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Camera, X, CheckCircle, AlertCircle } from "lucide-react";
import { auth, storage } from "../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { createListing } from "../firebase/listings";
import { LOCATIONS, CATEGORIES, CONDITIONS } from "@/lib/listingOptions";

function SellItem() {
	const navigate = useNavigate();
	const [currentUser, setCurrentUser] = useState(null);
	const [authLoading, setAuthLoading] = useState(true);
	const [loading, setLoading] = useState(false);
	const [formData, setFormData] = useState({
		title: "",
		price: "",
		location: "",
		category: "",
		condition: "",
		description: "",
	});

	const [imagePreview, setImagePreview] = useState(null);
	const [imageFile, setImageFile] = useState(null);
	const [uploadProgress, setUploadProgress] = useState(0);

	// Toast state
	const [toast, setToast] = useState({
		visible: false,
		type: "", // "success", "error", "warning"
		message: "",
	});

	const showToast = (type, message) => {
		setToast({ visible: true, type, message });
		setTimeout(() => {
			setToast({ visible: false, type: "", message: "" });
		}, 4000);
	};

	// Get the currently logged-in user
	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			if (user) {
				setCurrentUser(user);
				console.log("✅ User authenticated:", user.uid);
			} else {
				setCurrentUser(null);
				console.log("❌ No user logged in");
			}
			setAuthLoading(false);
		});
		return () => unsubscribe();
	}, []);

	// Redirect to sign in if not authenticated
	useEffect(() => {
		if (!authLoading && !currentUser) {
			showToast("warning", "Please sign in to create a listing.");
			setTimeout(() => {
				navigate("/signin");
			}, 1500);
		}
	}, [currentUser, authLoading, navigate]);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (!file) return;

		// Validate file type
		const validTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
		if (!validTypes.includes(file.type)) {
			showToast("warning", "Please upload a PNG, JPEG, or WebP image.");
			e.target.value = "";
			return;
		}

		// Validate file size (max 5MB)
		if (file.size > 5 * 1024 * 1024) {
			showToast("warning", "Image size must be less than 5MB.");
			e.target.value = "";
			return;
		}

		setImageFile(file);
		const reader = new FileReader();
		reader.onload = (event) => setImagePreview(event.target.result);
		reader.readAsDataURL(file);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		// Check if user is authenticated
		if (!currentUser) {
			showToast("warning", "You must be logged in to create a listing.");
			return;
		}

		// Validate all required fields
		if (
			!formData.title.trim() ||
			!formData.price ||
			!formData.location ||
			!formData.category ||
			!formData.condition ||
			!formData.description.trim()
		) {
			showToast("warning", "Please fill out all required fields.");
			return;
		}

		if (!imageFile) {
			showToast("warning", "Please upload an image.");
			return;
		}

		setLoading(true);
		setUploadProgress(0);

		try {
			//  Upload image to Firebase Storage
			let imageUrl = "";
			if (imageFile) {
				const fileExtension = imageFile.name.split(".").pop();
				const imageRef = ref(
					storage,
					`listings/${Date.now()}_${currentUser.uid}.${fileExtension}`,
				);
				const snapshot = await uploadBytes(imageRef, imageFile);
				imageUrl = await getDownloadURL(snapshot.ref);
				setUploadProgress(100);
			}

			// Create listing using the listings.js helper
			const listingId = await createListing({
				title: formData.title.trim(),
				price: formData.price === "" ? null : parseFloat(formData.price),
				description: formData.description.trim(),
				imageUrl: imageUrl,
				category: formData.category,
				condition: formData.condition,
				location: formData.location,
				sellerId: currentUser.uid, // ✅ Uses the authenticated user's UID
			});

			console.log("✅ Listing created with ID:", listingId);

			// Reset form
			setFormData({
				title: "",
				price: "",
				location: "",
				category: "",
				condition: "",
				description: "",
			});
			setImageFile(null);
			setImagePreview(null);
			setUploadProgress(0);

			showToast("success", "✅ Listing created successfully!");
			setTimeout(() => {
				navigate("/browse");
			}, 1500);
		} catch (error) {
			console.error("❌ Error creating listing:", error);
			showToast("error", "Failed to create listing. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	// Show loading while checking auth
	if (authLoading) {
		return (
			<div className="min-h-screen bg-sky-50 flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto"></div>
					<p className="mt-4 text-neutral-600">Loading...</p>
				</div>
			</div>
		);
	}

	return (
		<div
			className="min-h-screen bg-base-200"
			style={{
				backgroundImage:
					"linear-gradient(rgba(219,234,254,0.3), rgba(191,219,254,0.6))",
				backgroundColor: "#bfdbfe",
			}}
		>
			{/* Toast Notification */}
			{toast.visible && (
				<div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md animate-in slide-in-from-top-2 duration-300">
					<div
						className={`p-4 rounded-lg shadow-lg flex items-center gap-3 ${
							toast.type === "success"
								? "bg-green-100 border border-green-300 text-green-800"
								: toast.type === "error"
									? "bg-red-100 border border-red-300 text-red-800"
									: "bg-yellow-100 border border-yellow-300 text-yellow-800"
						}`}
					>
						{toast.type === "success" && (
							<CheckCircle className="h-5 w-5 flex-shrink-0" />
						)}
						{toast.type === "error" && (
							<AlertCircle className="h-5 w-5 flex-shrink-0" />
						)}
						{toast.type === "warning" && (
							<AlertCircle className="h-5 w-5 flex-shrink-0" />
						)}
						<p className="text-sm font-medium flex-1">{toast.message}</p>
						<button
							onClick={() =>
								setToast({ visible: false, type: "", message: "" })
							}
							className="flex-shrink-0 hover:opacity-70"
						>
							<X className="h-4 w-4" />
						</button>
					</div>
				</div>
			)}

			<nav className="navbar bg-base-100 shadow-md px-8">
				<button
					type="button"
					className="btn-ghost text-xl"
					onClick={() => navigate("/dashboard")}
				>
					Home
				</button>
			</nav>

			<form onSubmit={handleSubmit}>
				<div className="max-w-4xl ml-8 pt-8">
					<h1 className="text-3xl font-bold mb-6 text-black">
						Create New Listing
					</h1>
					{currentUser && (
						<p className="text-sm text-neutral-600 mb-4">
							Creating listing as:{" "}
							<span className="font-semibold">
								{currentUser.displayName || currentUser.email}
							</span>
						</p>
					)}
				</div>

				<div className="flex flex-col lg:flex-row items-start gap-50">
					<div className="flex flex-col gap-3">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							{/* Title */}
							<div className="pt-8 pl-8 w-full max-w-md flex flex-col">
								<label className="label">
									<span className="label-text text-black">Title *</span>
								</label>
								<input
									type="text"
									name="title"
									value={formData.title}
									onChange={handleInputChange}
									placeholder="Example: TI-84 Calculator"
									className="input input-bordered w-full bg-white text-black"
									required
								/>
							</div>

							{/* Price */}
							<div className="pt-8 pl-8 w-full min-w-0 flex flex-col">
								<label className="label">
									<span className="label-text text-black">Price *</span>
								</label>
								<div className="flex items-center border rounded-lg px-3">
									<span className="mr-2 text-gray-500">$</span>
									<input
										type="number"
										name="price"
										value={formData.price}
										onChange={handleInputChange}
										placeholder="0"
										min="0"
										step="0.01"
										className="input input-bordered w-full bg-white text-black"
										required
									/>
								</div>
							</div>

							{/* Location */}
							<div className="pt-8 pl-8 w-full min-w-0">
								<label className="label">
									<span className="label-text text-black">Location *</span>
								</label>
								<select
									name="location"
									value={formData.location}
									onChange={handleInputChange}
									className="select select-bordered w-full bg-white text-black"
									required
								>
									<option value="" disabled>
										Select a Location
									</option>
									{Object.entries(LOCATIONS).map(([code, label]) => (
										<option key={code} value={label}>
											{label}
										</option>
									))}
								</select>
							</div>

							{/* Category */}
							<div className="pt-8 pl-8 w-full min-w-0">
								<label className="label">
									<span className="label-text text-black">Category *</span>
								</label>
								<select
									name="category"
									value={formData.category}
									onChange={handleInputChange}
									className="select select-bordered w-full bg-white text-black"
									required
								>
									<option value="" disabled>
										Select Category
									</option>
									{Object.entries(CATEGORIES).map(([code, label]) => (
										<option key={code} value={label}>
											{label}
										</option>
									))}
								</select>
							</div>

							{/* Condition */}
							<div className="pt-8 pl-8 w-full">
								<label className="label">
									<span className="label-text text-black">Condition *</span>
								</label>
								<select
									name="condition"
									value={formData.condition}
									onChange={handleInputChange}
									className="select select-bordered w-full bg-white text-black"
									required
								>
									<option value="" disabled>
										Select Condition
									</option>
									{Object.entries(CONDITIONS).map(([code, label]) => (
										<option key={code} value={label}>
											{label}
										</option>
									))}
								</select>
							</div>
						</div>

						{/* Image Upload */}
						<label className="flex flex-col h-[350px] w-full max-w-2xl cursor-pointer border-2 border-dashed rounded-lg ml-8 items-center justify-center bg-white text-black overflow-hidden">
							{imagePreview ? (
								<img
									src={imagePreview}
									alt="Preview"
									className="h-full w-full object-contain"
								/>
							) : (
								<>
									<Camera className="h-12 w-12 text-primary" />
									<p className="mt-3">Upload Images</p>
									<p className="text-xs text-neutral-500">
										PNG, JPEG, WebP (Max 5MB)
									</p>
								</>
							)}
							<input
								type="file"
								accept="image/png, image/jpeg, image/jpg, image/webp"
								onChange={handleImageChange}
								className="hidden"
							/>
						</label>

						{/* Upload Progress */}
						{uploadProgress > 0 && uploadProgress < 100 && (
							<div className="w-full bg-gray-200 rounded-full h-2.5 ml-8">
								<div
									className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
									style={{ width: `${uploadProgress}%` }}
								></div>
							</div>
						)}
					</div>

					{/* Description */}
					<div className="w-full max-w-xl">
						<label className="label">
							<span className="label-text text-black">Description *</span>
						</label>
						<textarea
							name="description"
							value={formData.description}
							onChange={handleInputChange}
							placeholder="Please enter a detailed description of your listed item."
							className="textarea textarea-bordered w-full h-[450px] bg-white text-black"
							required
						></textarea>

						<div className="flex flex-col sm:flex-row gap-4 mt-6 pl-15">
							<button
								type="submit"
								className="btn btn-primary w-70"
								disabled={loading || !currentUser}
							>
								{loading ? "Creating..." : "List Item"}
							</button>
							{!currentUser && (
								<p className="text-sm text-red-600 mt-2">
									You must be signed in to create a listing.
								</p>
							)}
						</div>
					</div>
				</div>
			</form>
		</div>
	);
}

export default SellItem;
