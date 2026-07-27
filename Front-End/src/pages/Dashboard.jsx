import { Button } from "@/components/ui/button";

export default function Dashboard({setPage}) {
    return (
        <div className="min-h-screen bg-gray-100 p-10">

            {/* Header */}
            <h1 className="text-3xl font-bold text-red-700">
                Campus Exchange
            </h1>

            {/* Welcome Section */}
            <div className="mt-10">
                <h2 className="text-4xl font-bold">
                    Welcome Back!
                </h2>

                <p className="mt-2 text-gray-500">
                    What would you like to do today?
                </p>
            </div>

            {/* Cards */}
            <div className="mt-10 flex justify-center gap-8">

                {/* Browse Marketplace Card */}
                <div className="w-96 rounded-xl bg-white p-8 shadow-lg">

                    <div className="flex justify-center">
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-4xl">

                        </div>
                    </div>

                    <h2 className="mt-6 text-center text-2xl font-bold">
                        Browse Marketplace
                    </h2>

                    <p className="mt-4 text-center text-gray-500">
                        Explore textbooks, electronics, furniture, bikes,
                        clothing, and more posted by UML students.
                    </p>

                    <div className="mt-8 flex justify-center">
                        <Button className="bg-green-600 hover:bg-green-700"
                        onClick={() => setPage("browse")}>
                            Start Shopping
                        </Button>
                    </div>

                </div>

                {/* Sell Item Card */}
                <div className="w-96 rounded-xl bg-white p-8 shadow-lg">

                    <div className="flex justify-center">
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-yellow-100 text-4xl">

                        </div>
                    </div>

                    <h2 className="mt-6 text-center text-2xl font-bold">
                        Sell an Item
                    </h2>

                    <p className="mt-4 text-center text-gray-500">
                        List your unused items quickly and safely
                        for other UML students.
                    </p>

                    <div className="mt-8 flex justify-center">
                        <Button className="bg-yellow-500 hover:bg-yellow-600 text-black"
                        onClick={() => setPage("sell")}>
                            Create Listing
                        </Button>
                    </div>

                </div>

            </div>


        </div>
    );
}