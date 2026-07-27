// landing_page.jsx
/* 
  Notes from Daniyal: 
  I made the UI for this page, but didn't implement any security
  stuff. I did link the two buttons to the respective pages too. I made the background to
  be a light blue with red buttons, kinda uml colors. Feel free to change the background colors or buttons if 
  you guys don't like them though.
*/ 
import { Button } from "@/components/ui/button";
 
function LandingPage({ onRegisterClick, onSignInClick }) {
  return (
    <div
      className="relative flex min-h-svh flex-col items-center justify-end bg-cover bg-center px-4 pb-20 text-center"
      style={{
        backgroundImage:
          "linear-gradient(rgba(219,234,254,0.3), rgba(191,219,254,0.6)), url('/hero-placeholder.jpg')",
        backgroundColor: "#bfdbfe"
      }}
    >
      <h1 className="mb-2 text-6xl font-black text-neutral-900 drop-shadow-sm">
        Campus Exchange
      </h1>
      <p className="mb-8 text-lg font-semibold text-neutral-900">
        Buy, Sell, and Trade with Verified Students!
      </p>

      {/* buttons section */}
      <div className="flex gap-4">
        <Button
          size="lg"
          variant="secondary"
          onClick={onRegisterClick}
          className="bg-red-600 hover:bg-red-700 text-white"
        >
          Register
        </Button>
        <Button
          size="lg"
          variant="secondary"
          onClick={onRegisterClick}
          className="bg-red-600 hover:bg-red-700 text-white"
        >
        Sign In
        </Button>
      </div>
    </div>
  );
}
 
export default LandingPage;
 
