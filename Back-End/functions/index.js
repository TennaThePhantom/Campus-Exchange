const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

initializeApp();

exports.createUser = onRequest(async (req, res) => {
	// Get data from the request
	// Expecting a JSON from the frontend: { studentId, studentName, ucard, umass, umassLowell, student, sixteenDigitNumber } can change later
	const {
		studentId,
		studentName,
		ucard,
		umass,
		umassLowell,
		student,
		sixteenDigitNumber,
	} = req.body;

	// Basic validation: Ensure the StudentID is provided(for right now)
	if (!studentId) {
		return res.status(400).send({ error: "StudentID is required." });
	}

	const db = getFirestore();

	// Create a document in the "users" collection
	// The document ID is set to the StudentID for fast look up.
	const userRef = db.collection("users").doc(studentId);
	const userData = {
		studentName: studentName || "", // Use empty string as fallback(going to remove it was just for testing)
		studentId: studentId,
		ucard: ucard || false,
		umass: umass || false,
		umassLowell: umassLowell || false,
		student: student || false,
		sixteenDigitNumber: sixteenDigitNumber || "",
		createdAt: new Date().toISOString(), // Timestamp for when the account was created
	};

	try {
		// Write the data to Firestore
		await userRef.set(userData);
		logger.info(`User created successfully: ${studentId}`);
		return res
			.status(200)
			.send({ success: true, message: `User ${studentName} created.` });
	} catch (error) {
		logger.error("Error creating user:", error);
		return res.status(500).send({ error: "Failed to create user." });
	}
});
