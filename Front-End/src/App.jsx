import { useState } from "react";
import LandingPage from "@/pages/landing_page";
import RegisterPage from "@/pages/register_page";
import UserSignIn from "@/pages/user_sign_in";
import Dashboard from "@/pages/Dashboard";
import SellItem from "@/pages/sell_item";
import VerificationPage from "./pages/verification_page";
import BrowseListings from "./pages/browseListingsPage";
import ProductDetail from "./pages/productDetailPage";

function App() {
	const [page, setPage] = useState("landing");
	// which listing the browse page handed us to show on the detail page
	const [selectedListingId, setSelectedListingId] = useState(null);
	// set once a student finishes ID verification, used to stamp new listings
	const [currentUser, setCurrentUser] = useState(null);

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
		return <VerificationPage setPage={setPage} onUserCreated={setCurrentUser} />;
	}
	if (page === "sell") {
		return <SellItem setPage={setPage} currentUser={currentUser} />;
	}
	if (page === "browse") {
		return (
			<BrowseListings
				setPage={setPage}
				onSelectListing={(listingId) => {
					setSelectedListingId(listingId);
					setPage("detail");
				}}
			/>
		);
	}
	if (page === "detail") {
		return <ProductDetail setPage={setPage} listingId={selectedListingId} />;
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
