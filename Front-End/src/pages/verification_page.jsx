// working for clear photo ID haven't tested it with damage IDS yet - Tennessee
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { db } from "../firebase/firebase";
import { collection, addDoc } from "firebase/firestore";

const VerificationPage = () => {
	const navigate = useNavigate();
	const [image, setImage] = useState(null);
	const [loading, setLoading] = useState(false);
	const [result, setResult] = useState(null);
	const [error, setError] = useState("");
	const [userCreated, setUserCreated] = useState(false);
	const [confirmationStep, setConfirmationStep] = useState(false);

	// Account creation states
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [phoneNumber, setPhoneNumber] = useState("");
	const [authLoading, setAuthLoading] = useState(false);
	const [authError, setAuthError] = useState("");

	// Handle image upload, validate file type, and convert to base64
	const handleImageUpload = (e) => {
		const file = e.target.files[0];
		if (!file) return;

		// Check if the file is PNG or JPEG
		const validTypes = ["image/png", "image/jpeg", "image/jpg"];
		if (!validTypes.includes(file.type)) {
			setError("❌ Please upload a PNG or JPEG image only.");
			e.target.value = ""; // Clear the file input
			return;
		}

		// Check file size limit to 5MB
		if (file.size > 5 * 1024 * 1024) {
			setError("❌ Image size must be less than 5MB.");
			e.target.value = "";
			return;
		}

		// Clear any previous errors
		setError("");

		const reader = new FileReader();
		reader.onload = (event) => {
			const base64String = event.target.result.split(",")[1];
			setImage(base64String);
			console.log("✅ Image converted to base64");
		};
		reader.onerror = (error) => {
			console.error("Error reading file:", error);
			setError("Failed to read image file");
		};
		reader.readAsDataURL(file);
	};

	// Get the correct function URL based on environment
	const getFunctionUrl = () => {
		if (
			window.location.hostname === "localhost" ||
			window.location.hostname === "127.0.0.1"
		) {
			return "http://127.0.0.1:5001/campus-exchange-d47f4/us-central1/scanStudentId";
		}
		return "https://us-central1-campus-exchange-d47f4.cloudfunctions.net/scanStudentId";
	};

	// Get the createAccount function URL
	const getCreateAccountUrl = () => {
		if (
			window.location.hostname === "localhost" ||
			window.location.hostname === "127.0.0.1"
		) {
			return "http://127.0.0.1:5001/campus-exchange-d47f4/us-central1/createAccount";
		}
		return "https://us-central1-campus-exchange-d47f4.cloudfunctions.net/createAccount";
	};

	// Send the base64 image to the Cloud Function for scanning
	const handleScanID = async () => {
		if (!image) {
			setError("Please select an image first");
			return;
		}

		setLoading(true);
		setError("");
		setResult(null);
		setUserCreated(false);
		setConfirmationStep(false);
		setAuthError("");

		try {
			const response = await fetch(getFunctionUrl(), {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					image: image,
				}),
			});

			const data = await response.json();

			if (response.ok) {
				setResult(data);
				console.log(" Scan result:", data);

				if (data.verified) {
					setConfirmationStep(true);
				} else {
					console.log(" Verification failed. Please try again.");
				}
			} else {
				setError(data.error || "Scan failed");
			}
		} catch (err) {
			console.error("Network error:", err);
			setError("Failed to connect to the server");
		} finally {
			setLoading(false);
		}
	};

	// Create user account with username, password, and phone number
	const finalizeAccount = async () => {
		if (!username || !password || !phoneNumber) {
			setAuthError("Please fill in all fields.");
			return;
		}

		if (username.length < 3) {
			setAuthError("Username must be at least 3 characters long.");
			return;
		}

		if (password.length < 6) {
			setAuthError("Password must be at least 6 characters long.");
			return;
		}

		// Basic phone number validation (must be at least 10 digits)
		const phoneDigits = phoneNumber.replace(/\D/g, "");
		if (phoneDigits.length < 10) {
			setAuthError(
				"Please enter a valid phone number with at least 10 digits.",
			);
			return;
		}

		setAuthLoading(true);
		setAuthError("");

		try {
			const response = await fetch(getCreateAccountUrl(), {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					username: username,
					password: password,
					phoneNumber: phoneNumber,
					studentName: result.extractedName,
					studentId: result.extractedId,
				}),
			});

			const data = await response.json();

			if (data.success) {
				setUserCreated(true);
				setConfirmationStep(false);
				console.log("✅ Account created successfully!");
			} else {
				setAuthError(data.error || "Account creation failed.");
			}
		} catch (err) {
			console.error("Network error:", err);
			setAuthError("Failed to connect to the server. Please try again.");
		} finally {
			setAuthLoading(false);
		}
	};

	// Handle user confirmation
	const handleConfirmation = (isCorrect) => {
		if (isCorrect) {
			// User confirmed, show account creation form
			setConfirmationStep(false);
			// result is already set, so we show the account form
		} else {
			setConfirmationStep(false);
			setResult(null);
			setImage(null);
			setError("Please upload a clearer photo of your ID.");
		}
	};

	return (
		<div className="flex min-h-screen flex-col items-center justify-center p-4 bg-background"
		style={{
                backgroundImage:
                "linear-gradient(rgba(219,234,254,0.3), rgba(191,219,254,0.6)), url('/hero-placeholder.jpg')",
                backgroundColor: "#bfdbfe",
                }}
                >
			<div className="max-w-md w-full space-y-6">
				{/* Header */}
				<div className="text-center">
					<h1 className="text-2xl font-bold text-black">Verify Your UML ID</h1>
					<p className="text-sm mt-1 text-black">
						Upload a clear photo of your UML student ID card
					</p>
					<p className="text-xs text-black mt-1">
						Accepted formats: PNG, JPEG (Max 5MB)
					</p>
				</div>

				{/* Image Upload Section */}
				{!confirmationStep && !userCreated && !result?.verified && (
					<div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors">
						{image ? (
							<div className="space-y-2">
								<img
									src={`data:image/jpeg;base64,${image}`}
									alt="ID Preview"
									className="max-h-48 mx-auto rounded shadow-md"
								/>
								<p className="text-sm text-green-600 font-medium">
									✅ Image ready for scanning
								</p>
								<label className="text-sm text-primary cursor-pointer hover:underline">
									Change photo
									<input
										type="file"
										accept="image/png, image/jpeg, image/jpg"
										onChange={handleImageUpload}
										className="hidden"
									/>
								</label>
							</div>
						) : (
							<div>
								<div className="text-4xl mb-2">📸</div>
								<p className="text-black mb-2">
									Drag & drop your ID photo here
								</p>
								<p className="text-xs text-black mb-4">
									or click to browse
								</p>
								<input
									type="file"
									accept="image/png, image/jpeg, image/jpg"
									onChange={handleImageUpload}
									className="text-sm cursor-pointer text-black"
								/>
							</div>
						)}
					</div>
				)}

				{/* Scan Button */}
				{!confirmationStep && !userCreated && !result?.verified && (
					<Button
						onClick={handleScanID}
						disabled={!image || loading}
						className="w-full"
						size="lg"
					>
						{loading ? (
							<>
								<span className="mr-2 animate-spin">⏳</span>
								Scanning...
							</>
						) : (
							"Scan My ID"
						)}
					</Button>
				)}

				{/* Confirmation Step */}
				{confirmationStep && result && (
					<div className="bg-muted p-6 rounded-lg space-y-6">
						<h3 className="font-semibold text-center text-lg">
							Is this information correct?
						</h3>

						<div className="space-y-3 bg-background p-4 rounded-lg">
							<div className="flex justify-between items-center border-b pb-2">
								<span className="text-muted-foreground font-medium">Name:</span>
								<span className="font-semibold">
									{result.extractedName || "Not found"}
								</span>
							</div>
							<div className="flex justify-between items-center border-b pb-2">
								<span className="text-muted-foreground font-medium">
									Student ID:
								</span>
								<span className="font-semibold font-mono">
									{result.extractedId || "Not found"}
								</span>
							</div>
							<div className="flex justify-between items-center">
								<span className="text-muted-foreground font-medium">
									University:
								</span>
								<span className="font-semibold">
									University of Massachusetts Lowell
								</span>
							</div>
						</div>

						<div className="flex gap-4">
							<Button
								onClick={handleConfirmation}
								className="flex-1 bg-green-600 hover:bg-green-700"
							>
								✅ Yes, That's Me
							</Button>
							<Button
								onClick={() => handleConfirmation(false)}
								variant="outline"
								className="flex-1 border-destructive text-destructive hover:bg-destructive/10"
							>
								❌ No, Try Again
							</Button>
						</div>

						<p className="text-xs text-muted-foreground text-center">
							If the information is incorrect, click "No" and upload a clearer
							photo.
						</p>
					</div>
				)}

				{/* Account Creation Formits shown after ID is verified */}
				{result?.verified && !userCreated && !confirmationStep && (
					<div className="bg-muted p-6 rounded-lg space-y-4">
						<h2 className="text-xl font-bold text-center">
							Create Your Account
						</h2>
						<p className="text-sm text-muted-foreground text-center">
							Your ID has been verified! Fill in the details below to create
							your account.
						</p>

						<div className="space-y-4">
							<div>
								<label className="label">
									<span className="label-text">Choose a Username</span>
								</label>
								<input
									type="text"
									placeholder="e.g., john.doe"
									className="input input-bordered w-full bg-black"
									value={username}
									onChange={(e) => setUsername(e.target.value)}
								/>
								<p className="text-xs text-muted-foreground mt-1">
									This will be used to log in. Must be at least 3 characters.
								</p>
							</div>

							<div>
								<label className="label">
									<span className="label-text">Password</span>
								</label>
								<input
									type="password"
									placeholder="Choose a strong password"
									className="input input-bordered w-full bg-black"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
								/>
								<p className="text-xs text-muted-foreground mt-1">
									Must be at least 6 characters long.
								</p>
							</div>

							<div>
								<label className="label">
									<span className="label-text">Phone Number</span>
								</label>
								<input
									type="tel"
									placeholder="(123) 456-7890"
									className="input input-bordered w-full bg-black"
									value={phoneNumber}
									onChange={(e) => setPhoneNumber(e.target.value)}
								/>
								<p className="text-xs text-muted-foreground mt-1">
									Your phone number will be used for contact purposes.
								</p>
							</div>

							<Button
								className="w-full"
								onClick={finalizeAccount}
								disabled={authLoading || !username || !password || !phoneNumber}
							>
								{authLoading
									? "Creating Account..."
									: "Create Account & Continue"}
							</Button>

							{/* Display name from the ID scan */}
							<div className="text-center text-sm text-muted-foreground">
								Verified as:{" "}
								<span className="font-semibold">{result.extractedName}</span>
							</div>
						</div>

						{authError && (
							<p className="text-sm text-destructive text-center">
								{authError}
							</p>
						)}
					</div>
				)}

				{/* Success Message */}
				{userCreated && (
					<div className="bg-green-100 dark:bg-green-900/20 border border-green-300 dark:border-green-700 rounded-lg p-4 text-center">
						<div className="text-3xl mb-2">🎉</div>
						<h3 className="font-bold text-green-700 dark:text-green-400">
							Account Created!
						</h3>
						<p className="text-sm text-green-600 dark:text-green-300 mt-1">
							Your account has been created successfully. You can now log in
							with your username and password.
						</p>
						<Button
							className="mt-4"
							variant="outline"
							onClick={() => navigate("/signin")}
						>
							Go to Login
						</Button>
					</div>
				)}

				{/* Error Display */}
				{error && !confirmationStep && !result?.verified && (
					<div className="bg-destructive/10 border border-destructive rounded-lg p-3">
						<p className="text-sm text-destructive">{error}</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default VerificationPage;
