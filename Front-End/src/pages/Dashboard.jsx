import { Button } from "@/components/ui/button";
import { ShoppingBag, Plus } from "lucide-react";

export default function Dashboard({ setPage }) {
  return (
    <div className="min-h-screen bg-gray-100 p-10">

      {/* Welcome Section */}
      <h1 className="text-6xl font-bold text-sky-200">
        Welcome Back!
      </h1>

      <p className="mt-2 mb-10 text-2xl text-gray-600">
        What would you like to do today?
      </p>

      {/* Cards */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">

        {/* Browse Marketplace Card */}
        <div className="rounded-3xl bg-white p-10 shadow-lg text-center">

          <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
            <ShoppingBag size={42} className="text-green-700" />
          </div>

          <h2 className="text-5xl font-bold text-sky-200">
            Browse Marketplace
          </h2>

          <p className="mt-6 text-2xl text-gray-600">
            Explore textbooks, electronics, furniture, bikes,
            clothing, and more posted by UML students.
          </p>

          <Button
            onClick={() => setPage("browse")}
            className="mt-10 rounded-full bg-green-600 px-8 py-6 text-lg hover:bg-green-700"
          >
            Start Shopping →
          </Button>

        </div>

        {/* Sell Item Card */}
        <div className="rounded-3xl bg-white p-10 shadow-lg text-center">

          <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-yellow-100">
            <Plus size={42} className="text-yellow-700" />
          </div>

          <h2 className="text-5xl font-bold text-sky-200">
            Sell an Item
          </h2>

          <p className="mt-6 text-2xl text-gray-600">
            List your unused items quickly and safely for other UML
            students.
          </p>

          <Button
            onClick={() => setPage("sell")}
            className="mt-10 rounded-full bg-yellow-500 px-8 py-6 text-lg text-black hover:bg-yellow-600"
          >
            Create Listing →
          </Button>

        </div>

      </div>

      {/* Statistics */}
      <div className="mt-12 grid grid-cols-3 overflow-hidden rounded-3xl bg-white shadow-lg">

        <div className="border-r p-8 text-center">
          <h3 className="text-5xl font-bold text-green-700">10</h3>
          <p className="mt-2 text-gray-500">Active Listings</p>
        </div>

        <div className="border-r p-8 text-center">
          <h3 className="text-5xl font-bold text-green-700">5</h3>
          <p className="mt-2 text-gray-500">Verified Students</p>
        </div>

        <div className="p-8 text-center">
          <h3 className="text-5xl font-bold text-green-700">3</h3>
          <p className="mt-2 text-gray-500">Items Sold This Month</p>
        </div>

      </div>

    </div>
  );
}
