const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const cors = require("cors")({ origin: true });
const vision = require("@google-cloud/vision");

// Initialize Firebase Admin SDK
initializeApp();

// Initialize Google Cloud Vision client
const visionClient = new vision.ImageAnnotatorClient({
	keyFilename: "./CampusExchangeAPI.json",
});

// Your existing createUser function
exports.createUser = onRequest((req, res) => {
	cors(req, res, async () => {
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
	});
});

// ID Scanning function with Vision API
exports.scanStudentId = onRequest((req, res) => {
	cors(req, res, async () => {
		try {
			const { image } = req.body; // No studentId needed - extracted from image

			// --- 1. Validate request ---
			if (!image) {
				return res.status(400).send({ error: "No image provided." });
			}

			// --- 2. Call Google Cloud Vision API ---
			logger.info("Calling Google Cloud Vision API...");

			const [result] = await visionClient.textDetection({
				image: { content: image }, // image is base64 string
			});

			// --- 3. Extract text and confidence ---
			const detections = result.textAnnotations;
			if (detections.length === 0) {
				return res.status(400).send({
					success: false,
					error:
						"No text detected in the image. Please upload a clearer photo.",
				});
			}

			// Full extracted text (first annotation contains all text)
			const fullText = detections[0].description;
			logger.info(`Extracted text: ${fullText.substring(0, 200)}...`);

			// --- 4. Parse text for required information ---
			// Extract 8-digit Student ID (matches pattern like 12345678)
			const idRegex = /\b(\d{8})\b/;
			const idMatch = fullText.match(idRegex);
			const extractedId = idMatch ? idMatch[1] : null;

			// Extract Student Name - captures the name immediately before "ID#"
			const nameRegex = /([A-Za-z]+(?:\s+[A-Za-z]+){1,3})\s*ID#/i;
			const nameMatch = fullText.match(nameRegex);
			let extractedName = nameMatch ? nameMatch[1].trim() : null;

			// --- Clean the extracted name ---
			if (extractedName) {
				// Remove "Student" if it appears at the start of the name
				extractedName = extractedName.replace(/^Student\s*/i, "");
				// Remove any remaining newlines or extra spaces
				extractedName = extractedName.replace(/[\n\r]+/g, " ").trim();
			}

			// Check for keywords
			const hasUcard = /UCARD/i.test(fullText);
			const hasUmass = /UMASS/i.test(fullText);
			const hasUmassLowell =
				/University of Massachusetts Lowell|UMASSLOWELL|UMASS LOWELL|UML/i.test(
					fullText,
				);
			const hasStudent = /STUDENT/i.test(fullText);

			// Extract 16-digit number
			const sixteenDigitRegex = /\b(\d{16})\b/;
			const sixteenMatch = fullText.match(sixteenDigitRegex);
			const sixteenDigitNumber = sixteenMatch ? sixteenMatch[1] : null;

			// --- 5. Calculate confidence score ---
			let confidence = 0;
			if (extractedId) confidence += 40;
			if (extractedName) confidence += 30;
			if (hasUcard) confidence += 10;
			if (hasUmassLowell) confidence += 10;
			if (hasStudent) confidence += 10;

			// --- 6. Verify - only check confidence (no ID comparison needed) ---
			const verified = confidence >= 90;

			logger.info(
				`🔍 Extracted ID: "${extractedId}", Name: "${extractedName}", Confidence: ${confidence}%`,
			);
			logger.info(`🔍 Verified: ${verified}`);

			// --- 7. Prepare response ---
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
	});
});
