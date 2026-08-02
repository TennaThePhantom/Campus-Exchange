import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div
      className="relative flex min-h-svh flex-col items-center justify-end bg-cover bg-center px-4 pb-20 text-center"
      style={{
        backgroundImage:
          "linear-gradient(rgba(219,234,254,0.3), rgba(191,219,254,0.6)), url('/hero-placeholder.jpg')",
        backgroundColor: "#bfdbfe",
      }}
    >
      <h1 className="mb-2 text-6xl font-black text-neutral-900 drop-shadow-sm">
        Campus Exchange
      </h1>

      <p className="mb-8 text-lg font-semibold text-neutral-900">
        Buy, Sell, and Trade with Verified Students!
      </p>

      {/* Buttons */}
      <div className="flex gap-4">
        <Button
          size="lg"
          variant="secondary"
          onClick={() => navigate("/register")}
          className="bg-red-600 text-white hover:bg-red-700"
        >
          Register
        </Button>

        <Button
          size="lg"
          variant="secondary"
          onClick={() => navigate("/signin")}
          className="bg-red-600 text-white hover:bg-red-700"
        >
          Sign In
        </Button>

        <Button
          size="lg"
          variant="secondary"
          onClick={() => navigate("/dashboard")}
          className="bg-neutral-800 text-white hover:bg-neutral-900"
        >
          Demo
        </Button>
      </div>
    </div>
  );
}

export default LandingPage;
