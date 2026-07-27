import { useState } from "react";
import LandingPage from "@/pages/landing_page";
import RegisterPage from "@/pages/register_page";
import UserSignIn from "@/pages/user_sign_in";
import Dashboard from "@/pages/Dashboard";
import SellItem from "@/pages/sell_item";
import VerificationPage from "./pages/verification_page";
import BrowseListings from "./pages/browseListingsPage";

function App() {
	const [page, setPage] = useState("landing");

	if (page === "register") {
		return (
			<RegisterPage
				onRegistered={() => setPage("verification")}
				onSignInClick={() => setPage("signin")}
			/>
		);
	}

	if (page === "signin") {
		return (
			<UserSignIn
				onSignedIn={() => setPage("dashboard")}
				onCreateAccountClick={() => setPage("register")}
			/>
		);
	}

	if (page === "dashboard") {
		return <Dashboard setPage={setPage} />;
	}
	if (page === "verification") {
		return <VerificationPage setPage={setPage} />;
	}
	if (page === "sell") {
		return <SellItem setPage={setPage} />;
	}
	if (page === "browse") {
		return <BrowseListings setPage={setPage} />;
	}
	return (
		<LandingPage
			onRegisterClick={() => setPage("register")}
			onSignInClick={() => setPage("signin")}
			onDemoClick={() => setPage("dashboard")}
		/>
	);
}

export default App;
