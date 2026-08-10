// user_sign_in.jsx
/*
  Notes from Daniyal:
  I made the UI for this page, but didn't implement any security
  stuff. I did link the "create an account" button to the register page though
  Besides that, everything should be good, just needs the backend stuff for signing in
  and everything
*/

// Notes from Diya 08/02 :
/*
  React Router Update

  This page now uses React Router instead of prop-based navigation.
  The useNavigate hook is used to move between pages.

  Navigation:
  - Back → Landing Page (/)
  - Sign In → Dashboard (/dashboard)
  - Create an Account → Register Page (/register)

*/

// Notes from Tennessee 08/09 :
/*
  Firebase Authentication Added
  - Sign in with username and password
  - Username is converted to email format for Firebase Auth
  - Error handling for invalid credentials
  - Redirects to dashboard on success
*/
/*
  Notes from Daniyal 8/9:
  I removed the "forgot password" button, since we don't have a forgot password page or
  anything that we can do to make a page for it
*/


import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase";

function UserSignIn() {
	const navigate = useNavigate();

	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();

		// Validate inputs
		if (!username || !password) {
			setError("Please enter both username and password.");
			return;
		}

		setError("");
		setLoading(true);

		try {
			// Convert username to email format for Firebase Auth
			// Username becomes: username@campus-exchange.local
			const email = `${username}@campus-exchange.local`;

			// Sign in with Firebase Auth
			const userCredential = await signInWithEmailAndPassword(
				auth,
				email,
				password,
			);

			console.log("✅ User signed in successfully:", userCredential.user.uid);

			// Redirect to dashboard on success
			navigate("/dashboard");
		} catch (err) {
			console.error("❌ Login error:", err);

			// Handle specific Firebase Auth errors
			switch (err.code) {
				case "auth/user-not-found":
					setError(
						"Username not found. Please check your username or create an account.",
					);
					break;
				case "auth/wrong-password":
					setError("Incorrect password. Please try again.");
					break;
				case "auth/invalid-email":
					setError(
						"Invalid username format. Please use letters and numbers only.",
					);
					break;
				case "auth/too-many-requests":
					setError("Too many failed attempts. Please try again later.");
					break;
				default:
					setError(
						"Failed to sign in. Please check your username and password.",
					);
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="grid min-h-svh grid-cols-1 bg-sky-50 md:grid-cols-2">

			{/* Left side - UMass Lowell campus image */}
			<div
				className="hidden min-h-svh w-full bg-cover bg-center bg-no-repeat md:block"
				style={{
					backgroundImage: "url('/uml-campus.webp')",
				}}
			/>

			<div className="flex items-center justify-center px-6 py-12">
				<div className="w-full max-w-sm">
					{/* Back Button */}
					<Button
						variant="ghost"
						onClick={() => navigate("/")}
						className="mb-4"
					>
						← Back
					</Button>

					<h1 className="mb-6 text-2xl font-bold text-neutral-900">
						Please enter your username and password.
					</h1>

					<form
						onSubmit={handleSubmit}
						className="rounded-lg border border-sky-200 bg-white p-6"
					>
						<label
							className="mb-1 block text-sm font-medium"
							htmlFor="username"
						>
							Username
						</label>

						<input
							id="username"
							type="text"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							className="mb-4 w-full rounded-lg border border-sky-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300"
							placeholder="Username"
							autoComplete="username"
						/>

						<label
							className="mb-1 block text-sm font-medium"
							htmlFor="password"
						>
							Password
						</label>

						<input
							id="password"
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="mb-4 w-full rounded-lg border border-sky-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300"
							placeholder="Password"
							autoComplete="current-password"
						/>

						{/* Error Display */}
						{error && (
							<div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3">
								<p className="text-sm text-red-600">{error}</p>
							</div>
						)}

						<Button
							type="submit"
							className="w-full bg-red-600 text-white hover:bg-red-700"
							disabled={loading}
						>
							{loading ? "Signing In..." : "Sign In"}
						</Button>

						<div className="mt-4 flex items-center justify-between">

							<Button
								type="button"
								variant="link"
								size="sm"
								onClick={() => navigate("/register")}
								className="text-red-600"
							>
								Create an Account
							</Button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}

export default UserSignIn;
