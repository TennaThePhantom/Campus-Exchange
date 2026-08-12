const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const { getAuth } = require("firebase-admin/auth");
const { onRequest } = require("firebase-functions/v2/https");
const { onInit } = require("firebase-functions/v2/core");
const logger = require("firebase-functions/logger");
const vision = require("@google-cloud/vision");

const admin = require("firebase-admin");

// Initialize Firebase Admin SDK
initializeApp({
	credential: admin.credential.cert(require("./CampusExchangeAPI.json")),
});
// Initialize Google Cloud Vision client
let visionClient;

// since this is something outside needs to be at the end when everything else is finished
onInit(async () => {
	logger.info("🚀 Initializing Vision Client...");
	visionClient = new vision.ImageAnnotatorClient({
		keyFilename: "./CampusExchangeAPI.json",
	});
	logger.info("Vision Client Initialized.");
});

// createUser with v2 CORS options and public access
exports.createUser = onRequest(
	{
		cors: [
			"http://localhost:5173",
			"http://127.0.0.1:5173",
			"https://campus-exchange-d47f4.web.app",
			"https://campus-exchange-d47f4.firebaseapp.com",
		],
		invoker: "public",
	},
	async (req, res) => {
		const {
			studentId,
			studentName,
			ucard,
			umass,
			umassLowell,
			student,
			sixteenDigitNumber,
		} = req.body;

		if (!studentId) {
			return res.status(400).send({ error: "StudentID is required." });
		}

		const db = getFirestore();
		const userRef = db.collection("users").doc(studentId);
		const userData = {
			studentName: studentName || "",
			studentId: studentId,
			ucard: ucard || false,
			umass: umass || false,
			umassLowell: umassLowell || false,
			student: student || false,
			sixteenDigitNumber: sixteenDigitNumber || "",
			createdAt: new Date().toISOString(),
		};

		try {
			await userRef.set(userData);
			logger.info(`User created successfully: ${studentId}`);
			return res.status(200).send({
				success: true,
				message: `User ${studentName} created.`,
			});
		} catch (error) {
			logger.error("Error creating user:", error);
			return res.status(500).send({ error: "Failed to create user." });
		}
	},
);

// scanStudentId with v2 CORS options and public access
exports.scanStudentId = onRequest(
	{
		cors: [
			"http://localhost:5173",
			"http://127.0.0.1:5173",
			"https://campus-exchange-d47f4.web.app",
			"https://campus-exchange-d47f4.firebaseapp.com",
		],
		invoker: "public",
	},
	async (req, res) => {
		try {
			const { image } = req.body;

			if (!image) {
				return res.status(400).send({ error: "No image provided." });
			}

			logger.info("Calling Google Cloud Vision API...");

			const [result] = await visionClient.textDetection({
				image: { content: image },
			});

			const detections = result.textAnnotations;
			if (detections.length === 0) {
				return res.status(400).send({
					success: false,
					error:
						"No text detected in the image. Please upload a clearer photo.",
				});
			}

			const fullText = detections[0].description;
			logger.info(`Extracted text: ${fullText.substring(0, 200)}...`);

			const idRegex = /\b(\d{8})\b/;
			const idMatch = fullText.match(idRegex);
			const extractedId = idMatch ? idMatch[1] : null;

			const nameRegex = /([A-Za-z]+(?:\s+[A-Za-z]+){1,3})\s*ID#/i;
			const nameMatch = fullText.match(nameRegex);
			let extractedName = nameMatch ? nameMatch[1].trim() : null;

			if (extractedName) {
				extractedName = extractedName.replace(/^Student\s*/i, "");
				extractedName = extractedName.replace(/[\n\r]+/g, " ").trim();
			}

			const hasUcard = /UCARD/i.test(fullText);
			const hasUmass = /UMASS/i.test(fullText);
			const hasUmassLowell =
				/University of Massachusetts Lowell|UMASSLOWELL|UMASS LOWELL|UML/i.test(
					fullText,
				);
			const hasStudent = /STUDENT/i.test(fullText);

			const sixteenDigitRegex = /\b(\d{16})\b/;
			const sixteenMatch = fullText.match(sixteenDigitRegex);
			const sixteenDigitNumber = sixteenMatch ? sixteenMatch[1] : null;

			let confidence = 0;
			if (extractedId) confidence += 40;
			if (extractedName) confidence += 30;
			if (hasUcard) confidence += 10;
			if (hasUmassLowell) confidence += 10;
			if (hasStudent) confidence += 10;

			const verified = confidence >= 90;

			logger.info(
				`🔍 Extracted ID: "${extractedId}", Name: "${extractedName}", Confidence: ${confidence}%`,
			);
			logger.info(`🔍 Verified: ${verified}`);

			const responseData = {
				success: true,
				verified: verified,
				confidence: confidence,
				extractedName: extractedName || "Not detected",
				extractedId: extractedId || "Not detected",
				hasUcard: hasUcard,
				hasUmass: hasUmass,
				hasUmassLowell: hasUmassLowell,
				hasStudent: hasStudent,
				sixteenDigitNumber: sixteenDigitNumber || "Not detected",
				fullText: fullText.substring(0, 500),
				message: verified
					? "✅ ID verified successfully!"
					: "❌ Verification failed. Please try again with a clearer photo.",
			};

			logger.info(
				`Scan complete. Verified: ${verified}, Confidence: ${confidence}%`,
			);
			return res.status(200).send(responseData);
		} catch (error) {
			logger.error("Error scanning ID:", error);
			return res.status(500).send({
				success: false,
				error: "Failed to scan ID. Please try again later.",
			});
		}
	},
);

// Create Account Cloud Function
exports.createAccount = onRequest(
	{
		cors: [
			"http://localhost:5173",
			"http://127.0.0.1:5173",
			"https://campus-exchange-d47f4.web.app",
			"https://campus-exchange-d47f4.firebaseapp.com",
		],
		invoker: "public",
	},
	async (req, res) => {
		const { username, password, phoneNumber, studentName, studentId } =
			req.body;

		// Validate required fields
		if (!username || !password || !phoneNumber || !studentName || !studentId) {
			return res.status(400).send({
				error:
					"Missing required fields. Please provide username, password, phoneNumber, studentName, and studentId.",
			});
		}

		// Validate username length
		if (username.length < 3) {
			return res.status(400).send({
				error: "Username must be at least 3 characters long.",
			});
		}

		// Validate password strength (minimum 6 characters)
		if (password.length < 6) {
			return res.status(400).send({
				error: "Password must be at least 6 characters long.",
			});
		}

		// Basic phone number validation (remove non-digits, check length)
		const phoneDigits = phoneNumber.replace(/\D/g, "");
		if (phoneDigits.length < 10) {
			return res.status(400).send({
				error: "Please enter a valid phone number with at least 10 digits.",
			});
		}

		try {
			// Create the user in Firebase Authentication
			const email = `${username}@campus-exchange.local`;

			const userRecord = await getAuth().createUser({
				email: email,
				password: password,
				displayName: studentName,
			});

			logger.info(`✅ Firebase Auth user created: ${userRecord.uid}`);

			// Save the user's profile to Firestore using UID as document ID
			const db = getFirestore();
			const userData = {
				username: username,
				studentName: studentName,
				studentId: studentId,
				phoneNumber: phoneNumber,
				ucard: true,
				umass: true,
				umassLowell: true,
				student: true,
				createdAt: new Date().toISOString(),
				uid: userRecord.uid,
			};

			await db.collection("users").doc(userRecord.uid).set(userData);
			logger.info(`✅ Firestore user profile created for: ${userRecord.uid}`);

			return res.status(201).send({
				success: true,
				message: "Account created successfully. You can now log in.",
				uid: userRecord.uid,
			});
		} catch (error) {
			logger.error("❌ Error creating account:", error);

			if (error.code === "auth/email-already-exists") {
				return res.status(409).send({
					error:
						"This username is already taken. Please choose a different one.",
				});
			}
			if (error.code === "auth/invalid-email") {
				return res.status(400).send({
					error: "Invalid username. Please try again.",
				});
			}
			if (error.code === "auth/weak-password") {
				return res.status(400).send({
					error: "Password is too weak. Please choose a stronger password.",
				});
			}

			return res.status(500).send({
				error: error.message || "Failed to create account. Please try again.",
			});
		}
	},
);
