import { Routes, Route, Navigate } from "react-router-dom";

import LandingPage from "@/pages/landing_page";
import RegisterPage from "@/pages/register_page";
import UserSignIn from "@/pages/user_sign_in";
import Dashboard from "@/pages/Dashboard";
import SellItem from "@/pages/sell_item";
import VerificationPage from "@/pages/verification_page";
import BrowseListings from "@/pages/browseListingsPage";
import ProductDetail from "./pages/productDetailPage";

function App() {
	return (
		<Routes>
			{/* Landing Page */}
			<Route path="/" element={<LandingPage />} />

			{/* Authentication */}
			<Route path="/register" element={<RegisterPage />} />
			<Route path="/signin" element={<UserSignIn />} />
			<Route path="/verification" element={<VerificationPage />} />

			{/* Dashboard */}
			<Route path="/dashboard" element={<Dashboard />} />

			{/* Marketplace */}
			<Route path="/browse" element={<BrowseListings />} />
			<Route path="/sell" element={<SellItem />} />

			{/* If URL doesn't exist, go back to landing page */}
			<Route path="*" element={<Navigate to="/" replace />} />

			<Route path="/detail/:listingId" element={<ProductDetail />} />
		</Routes>
	);
}

export default App;
