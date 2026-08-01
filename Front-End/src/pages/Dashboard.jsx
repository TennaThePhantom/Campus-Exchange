import { Button } from "@/components/ui/button";
import { ShoppingBag, Plus, User } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100">

      {/* Navbar */}

      <nav className="bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-4">

          <h1 className="text-3xl font-bold text-red-700">
            Campus Exchange
          </h1>

          <div className="flex items-center gap-8">

            <button className="font-medium hover:text-red-600">
              Home
            </button>

            <button className="font-medium hover:text-red-600">
              Browse
            </button>

            <button className="font-medium hover:text-red-600">
              Activity
            </button>

            <User
              size={30}
              className="cursor-pointer text-blue-500"
            />

          </div>
        </div>
      </nav>

      {/* Main */}

      <div className="mx-auto max-w-7xl px-8 py-10">

        <h2 className="text-5xl font-bold text-sky-200">
          Welcome Back!
        </h2>

        <p className="mt-2 text-gray-600">
          What would you like to do today?
        </p>

        {/* Cards */}

        <div className="mt-10 grid gap-8 md:grid-cols-2">

          {/* Browse */}

          <div className="rounded-3xl bg-white p-10 shadow-lg">

            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-green-100">

              <ShoppingBag
                size={38}
                className="text-green-700"
              />

            </div>

            <h3 className="mt-8 text-center text-3xl font-bold text-sky-200">
              Browse Marketplace
            </h3>

            <p className="mt-4 text-center text-gray-500">
              Explore textbooks, electronics, furniture,
              bikes, clothing, and more posted by UML students.
            </p>

            <div className="mt-8 flex justify-center">

              <Button className="rounded-full bg-green-700 hover:bg-green-800">
                Start Shopping →
              </Button>

            </div>

          </div>

          {/* Sell */}

          <div className="rounded-3xl bg-white p-10 shadow-lg">

            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-yellow-100">

              <Plus
                size={40}
                className="text-yellow-600"
              />

            </div>

            <h3 className="mt-8 text-center text-3xl font-bold text-sky-200">
              Sell an Item
            </h3>

            <p className="mt-4 text-center text-gray-500">
              List your unused items quickly and safely
              for other UML students.
            </p>

            <div className="mt-8 flex justify-center">

              <Button className="rounded-full bg-yellow-400 text-black hover:bg-yellow-500">
                Create Listing →
              </Button>

            </div>

          </div>

        </div>

        {/* Statistics */}

        <div className="mt-10 rounded-2xl bg-white shadow-lg">

          <div className="grid grid-cols-3 divide-x text-center">

            <div className="py-8">
              <h3 className="text-3xl font-bold text-green-700">
                1,250
              </h3>

              <p className="text-gray-500">
                Active Listings
              </p>
            </div>

            <div className="py-8">
              <h3 className="text-3xl font-bold text-green-700">
                950
              </h3>

              <p className="text-gray-500">
                Verified Students
              </p>
            </div>

            <div className="py-8">
              <h3 className="text-3xl font-bold text-green-700">
                320
              </h3>

              <p className="text-gray-500">
                Items Sold This Month
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

