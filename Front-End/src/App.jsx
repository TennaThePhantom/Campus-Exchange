import { useState } from "react";
import LandingPage from "@/pages/landing_page";
import RegisterPage from "@/pages/register_page";
import UserSignIn from "@/pages/user_sign_in";

function App() {
  const [page, setPage] = useState("landing");

  if (page === "register") {
    return (
      <RegisterPage
        onRegistered={() => alert("Account created! (welcome page not built yet)")}
        onSignInClick={() => setPage("signin")}
      />
    );
  }

  if (page === "signin") {
    return (
      <UserSignIn
        onSignedIn={() => alert("Signed in! (welcome page not built yet)")}
        onCreateAccountClick={() => setPage("register")}
      />
    );
  }

  return (
    <LandingPage
      onRegisterClick={() => setPage("register")}
      onSignInClick={() => setPage("signin")}
    />
  );
}

export default App;
