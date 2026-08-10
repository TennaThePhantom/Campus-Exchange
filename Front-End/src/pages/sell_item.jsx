import { useNavigate } from "react-router-dom";
import { Camera, X, CheckCircle, AlertCircle } from "lucide-react";
import { db, storage } from "../firebase/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

function SellItem() {
	const navigate = useNavigate();
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

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (!file) return;
		setImageFile(file);
		const reader = new FileReader();
		reader.onload = (event) => setImagePreview(event.target.result);
		reader.readAsDataURL(file);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (
			!formData.title ||
			!formData.price ||
			!formData.location ||
			!formData.category ||
			!formData.condition ||
			!formData.description
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
			const imageRef = ref(storage, `listings/${Date.now()}_${imageFile.name}`);
			const uploadTask = await uploadBytes(imageRef, imageFile);
			const imageUrl = await getDownloadURL(uploadTask.ref);

			const listingData = {
				title: formData.title,
				price: parseFloat(formData.price),
				location: formData.location,
				category: formData.category,
				condition: formData.condition,
				description: formData.description,
				imageUrl: imageUrl,
				sellerId: "test_user",
				sellerName: "Test User",
				createdAt: serverTimestamp(),
				status: "active",
			};

			const docRef = await addDoc(collection(db, "listings"), listingData);
			console.log("✅ Listing created with ID:", docRef.id);

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
			setUploadProgress(100);

			showToast("success", "✅ Listing created successfully!");
			setTimeout(() => {
				navigate("/browse");
			}, 1500);
		} catch (error) {
			console.error("❌ Error creating listing:", error);
			showToast("error", "Failed to create listing. Please try again.");
		} finally {
			setLoading(false);
			setTimeout(() => setUploadProgress(0), 3000);
		}
	};

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
					className="btn-ghost text-xl cuursor-pointer hover:text-blue-800"
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
				</div>

				<div className="flex flex-col lg:flex-row items-start gap-50">
					<div className="flex flex-col gap-3">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
									<option value="Fox Hall (East Campus)">
										Fox Hall (East Campus)
									</option>
									<option value="Leitch Hall (East Campus)">
										Leitch Hall (East Campus)
									</option>
									<option value="Bougeois Hall (East Campus)">
										Bougeois Hall (East Campus)
									</option>
									<option value="Donahue Hall (East Campus)">
										Donahue Hall (East Campus)
									</option>
									<option value="River Suites East (East Campus)">
										River Suites East (East Campus)
									</option>
									<option value="University Suites (East Campus)">
										University Suites (East Campus)
									</option>
									<option value="Concordia Hall (South Campus)">
										Concordia Hall (South Campus)
									</option>
									<option value="Sheehy Hall (South Campus)">
										Sheehy Hall (South Campus)
									</option>
									<option value="River Suites West (South Campus)">
										River Suites West (South Campus)
									</option>
									<option value="Starbucks (North Campus)">
										Starbucks (North Campus)
									</option>
								</select>
							</div>

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
									<option value="Books">Books</option>
									<option value="Electronics">Electronics</option>
									<option value="Furniture">Furniture</option>
									<option value="Clothing">Clothing</option>
									<option value="Appliances">Appliances</option>
                                    <option value="Other">Other / Miscellaneous</option>
								</select>
							</div>

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
									<option value="New">New</option>
									<option value="Slightly Used">Slightly Used</option>
									<option value="Used">Used</option>
									<option value="Damaged">Damaged</option>
								</select>
							</div>
						</div>

						<label className="flex flex-col h-[350px] w-full maxs-w-2xl cursor-pointer border-2 border-dashed rounded-lg ml-8 items-center justify-center bg-white text-black overflow-hidden">
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
								</>
							)}
							<input
								type="file"
								accept="image/*"
								onChange={handleImageChange}
								className="hidden"
							/>
						</label>

						{uploadProgress > 0 && uploadProgress < 100 && (
							<div className="w-full bg-gray-200 rounded-full h-2.5 ml-8">
								<div
									className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
									style={{ width: `${uploadProgress}%` }}
								></div>
							</div>
						)}
					</div>

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

						<div className="flex justify-center mt-6">
							<button
								type="submit"
								className="btn btn-primary w-70"
								disabled={loading}
							>
								{loading ? "Creating..." : "List Item"}
							</button>
						</div>
					</div>
				</div>
			</form>
		</div>
	);
}

export default SellItem;