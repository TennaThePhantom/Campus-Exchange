
import { Button } from "@/components/ui/button";

export default function Dashboard() {
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
            </div>
        </div>
    )
}