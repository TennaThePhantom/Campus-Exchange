
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function Dashboard({ setPage }) {
    return (
        <div className="min-h-screen bg-gray-100">

            <h1 className="font-bold text-red-700">
                Campus Exchange
            </h1>

            {/* Marketplace Browsing Card */}

            <div className="rounded-xl bg-white p-8 shadow">
                <h2 className="mt-6 text-center text-2xl font-bold">
                    Browse Marketplace
                </h2>

                <p className = "mt-4 text-center text-gray-500">
                    Browse items posted by UML students
                </p>

                <div className = "mt-8 text-center">
                    <Button className = "bg-green-600 hover:bg-green-700">
                        Start Shopping
                    </Button>
                </div>

                {/* Sell Card */}
                <div className="rounded-xl bg-white p-8 shadow">

                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-yellow-100">
                        <Plus className="text-yellow-600" size={35} />
                    </div>

                    <h2 className="mt-6 text-center text-2xl font-bold">
                        Sell an Item
                    </h2>

                    <p className="mt-4 text-center text-gray-500">
                        Create a listing and sell to other students.
                    </p>

                    <div className="mt-8 text-center">
                        <Button className="bg-yellow-500 hover:bg-yellow-600"
                            onClick={() => setPage("sell")}
                            >
                            Create Listing
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}