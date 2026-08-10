// sell_item.jsx
/*
    Notes from Daniyal 8/8:
    I added an "other/misc" category. No other changes were made. This was done to 
    match up the other keyword in the browse listings page for "other/misc"
*/
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Camera, ArrowUp, IdCard } from "lucide-react";

function SellItem({setPage}) {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen bg-base-200"
            style={{
                backgroundImage:
                "linear-gradient(rgba(219,234,254,0.3), rgba(191,219,254,0.6)), url('/hero-placeholder.jpg')",
                backgroundColor: "#bfdbfe",
                }}
                >
            <nav className="navbar bg-base-100 shadow-md px-8">
                <button
                type="button"
                className="btn-ghost text-xl cursor-pointer hover:text-blue-800"
                onClick={() => navigate("/dashboard")}
                >
                    Home
                </button>
        </nav>
            <div className="max-w-4xl ml-8 pt-8">
                <h1 className="text-3xl font-bold mb-6 text-black">Create New Listing</h1>
            </div>
            

<div className="flex flex-col lg:flex-row items-start gap-50">
    <div className="flex flex-col gap-3"> 

        <div className ="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="pt-8 pl-8 w-full max-w-md flex flex-col">
                <label className="label" >
                    <span className="label-text text-black">Title </span>
                    </label>
                    <input
                    type="text"
                    placeholder="Example: TI-84 Calculator"
                    className="input input-bordered w-full bg-white text-black"
                    />
                    </div>

             <div className="pt-8 pl-8 w-full min-w-0 flex flex-col">
                <label className="label">
                    <span className="label-text text-black">Price</span>
                    </label>

            <div className="flex items-center border rounded-lg px-3">
                <span className="mr-2 text-gray-500">$</span>
                    <input
                     type="number"
                     placeholder="0"
                     min="0"
                     step="0.01"
                     className="input input-bordered w-full bg-white text-black"
                     />
                     </div>
                     </div>


            <div className="pt-8 pl-8 w-full min-w-0">
                <label className="label" >
                    <span className="label-text text-black">Location </span>
                </label>
                <select className="select select-bordered w-full bg-white text-black" defaultValue="">
                    <option value="" disabled>
                        Select a Location
                    </option>

                    <option value="FOX">Fox Hall (East Campus)</option>
                    <option value="LEI">Leitch Hall (East Campus)</option>
                    <option value="BOU">Bougeois Hall (East Campus)</option>
                    <option value="DON">Donahue Hall (East Campus)</option>
                    <option value="RIVE">River Suites East (East Campus)</option>
                    <option value="US">University Suites (East Campus)</option>
                    <option value="CON">Concordia Hall (South Campus)</option>
                    <option value="SHE">Sheehy Hall (South Campus)</option>
                    <option value="SHE">Sheehy Hall (South Campus)</option>
                    <option value="RIVW">River Suites West (South Campus)</option>
                    <option value="STAR">Starbucks (North Campus)</option>
                </select>
            </div>

            <div className="pt-8 pl-8 w-full min-w-0">
                <label className="label">
                    <span className="label-text text-black">Category </span>
                </label>
                <select className="select select-bordered w-full bg-white text-black" defaultValue="">
                    <option value="" disabled>
                        Select Category
                    </option>

                    <option value="B">Books</option>
                    <option value="E">Electronics</option>
                    <option value="F">Furniture</option>
                    <option value="C">Clothing</option>
                    <option value="A">Appliances</option>
                    <option value="O">Other / Miscellaneous</option>
                </select>
            </div>

            <div className="pt-8 pl-8 w-96">
                <label className="label">
                    <span className="label-text text-black">Condition </span>
                </label>
                <select className="select select-bordered w-full bg-white text-black" defaultValue="">
                    <option value="" disabled>
                       Select Condition 
                    </option>

                    <option value="N">New</option>
                    <option value="S">Slightly Used</option>
                    <option value="U">Used</option>
                    <option value="D">Damaged</option>
                </select>
            </div>
            
            </div>





            <label className=" flex flex-col h-[350px] w-full max-w-2xl cursor-pointer border-2 border-dashed rounded-lg ml-8  items-center justify-center bg-white text-black">
            <Camera className="h-12 w-12 text-primary" />
            <p className="mt-3">Upload Images</p>
            <input
            type="file"
            accept="image/*"
            className="hidden"
            />
            </label>
</div>
            <div className="w-full max-w-xl">
                <label className="label" >
                    <span className="label-text text-black">Description</span>
                </label>
                <textarea
        
                placeholder="Please enter a detailed description of your listed item."
                className="textarea textarea-bordered w-full h-[450px] bg-white text-black"
                ></textarea>
                
                <div className="flex justify-center mt-6">
                 <button type="submit" className=" btn btn-primary w-70">
                        List Item
                    </button>
                    </div>
                </div>
        </div>
    </div>
        
    );
}

export default SellItem;

