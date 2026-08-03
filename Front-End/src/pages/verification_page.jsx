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

	// Handle image upload and convert to base64
	const handleImageUpload = (e) => {
		const file = e.target.files[0];
		if (!file) return;

		const reader = new FileReader();
		reader.onload = (event) => {
			const base64String = event.target.result.split(",")[1];
			setImage(base64String);
			console.log("Image converted to base64");
		};
		reader.onerror = (error) => {
			console.error("Error reading file:", error);
			setError("Failed to read image file");
		};
		reader.readAsDataURL(file);
	};

	// Get the correct function URL based on environment
	const getFunctionUrl = () => {
		// Check if we're in local development
		if (
			window.location.hostname === "localhost" ||
			window.location.hostname === "127.0.0.1"
		) {
			return "http://127.0.0.1:5001/campus-exchange-d47f4/us-central1/scanStudentId";
		}
		// Production URL
		return "https://us-central1-campus-exchange-d47f4.cloudfunctions.net/scanStudentId";
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

	// Create user in Firestore using verified data
	const createVerifiedUser = async () => {
		try {
			const docRef = await addDoc(collection(db, "users"), {
				studentId: result.extractedId,
				studentName: result.extractedName,
				ucard: true,
				umass: true,
				umassLowell: true,
				student: true,
				sixteenDigitNumber: result.sixteenDigitNumber || "",
				verifiedAt: new Date().toISOString(),
			});
			setUserCreated(true);
			setConfirmationStep(false);
			console.log(" User created successfully with ID: ", docRef.id);
		} catch (error) {
			console.error(" Error creating user:", error);
			setError("Failed to create user in database");
		}
	};

	// Handle user confirmation
	const handleConfirmation = (isCorrect) => {
		if (isCorrect) {
			createVerifiedUser();
		} else {
			setConfirmationStep(false);
			setResult(null);
			setImage(null);
			setError("Please upload a clearer photo of your ID.");
		}
	};

	return (
		<div className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
			<div className="max-w-md w-full space-y-6">
				{/* Header */}
				<div className="text-center">
					<h1 className="text-2xl font-bold">Verify Your UML ID</h1>
					<p className="text-muted-foreground text-sm mt-1">
						Upload a clear photo of your UML student ID card
					</p>
				</div>

				{/* Image Upload Section Only show if not in confirmation step */}
				{!confirmationStep && !userCreated && (
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
										accept="image/*"
										onChange={handleImageUpload}
										className="hidden"
									/>
								</label>
							</div>
						) : (
							<div>
								<div className="text-4xl mb-2">📸</div>
								<p className="text-muted-foreground mb-2">
									Drag & drop your ID photo here
								</p>
								<p className="text-xs text-muted-foreground mb-4">
									or click to browse
								</p>
								<input
									type="file"
									accept="image/*"
									onChange={handleImageUpload}
									className="text-sm cursor-pointer"
								/>
							</div>
						)}
					</div>
				)}

				{/* Scan Button - Only show if not in confirmation step */}
				{!confirmationStep && !userCreated && (
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

				{/* Confirmation Step Show the ID when it is verified */}
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
								onClick={() => handleConfirmation(true)}
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

				{/* Success Message */}
				{userCreated && (
					<div className="bg-green-100 dark:bg-green-900/20 border border-green-300 dark:border-green-700 rounded-lg p-4 text-center">
						<div className="text-3xl mb-2">🎉</div>
						<h3 className="font-bold text-green-700 dark:text-green-400">
							You're Verified!
						</h3>
						<p className="text-sm text-green-600 dark:text-green-300 mt-1">
							Your UML ID has been verified and your account is ready to use.
						</p>
						<Button
							className="mt-4"
							variant="outline"
							onClick={() => navigate("/dashboard")}
						>
							Continue to Dashboard
						</Button>
					</div>
				)}

				{/* Error Display */}
				{error && !confirmationStep && (
					<div className="bg-destructive/10 border border-destructive rounded-lg p-3">
						<p className="text-sm text-destructive">{error}</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default VerificationPage;
