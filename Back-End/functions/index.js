const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const vision = require("@google-cloud/vision");

// Initialize Firebase Admin SDK
initializeApp();

// Initialize Google Cloud Vision client
const visionClient = new vision.ImageAnnotatorClient({
	keyFilename: "./CampusExchangeAPI.json",
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
		invoker: "public", // Allows unauthenticated calls
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
		invoker: "public", // Allows unauthenticated calls
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
