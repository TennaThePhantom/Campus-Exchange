// sell_item.jsx


import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Camera, ArrowUp, IdCard } from "lucide-react";

function SellItem({setPage}) {
    return (
        <div className="min-h-screen bg-base-200">

            <nav className="navbar bg-base-100 shadow-md px-8">
                <button
                type="button"
                className="btn-ghost text-xl"
                onClick={() => setPage("dashboard")}
                >
                    Home
                </button>
        </nav>
            <div className="max-w-4xl ml-8 pt-8">
                <h1 className="text-3xl font-bold mb-6">Create New Listing</h1>
            </div>
            

<div className="flex items-start gap-100">
    <div className="flex flex-col gap-3"> 

        <div className ="grid grid-cols-2 gap-6">
            <div className="pt-8 pl-8 w-96 flex flex-col">
                <label className="label" >
                    <span className="label-text">Title </span>
                    </label>
                    <input
                    type="text"
                    placeholder="Example: TI-84 Calculator"
                    className="input input-bordered w-full"
                    />
                    </div>

             <div className="pt-8 pl-8 w-96 flex flex-col">
                <label className="label">
                    <span className="label-text">Price</span>
                    </label>

            <div className="flex items-center border rounded-lg px-3">
                <span className="mr-2 text-gray-500">$</span>
                    <input
                     type="number"
                     placeholder="0"
                     min="0"
                     step="0.01"
                     className="input input-bordered w-full"
                     />
                     </div>
                     </div>


            <div className="pt-8 pl-8 w-96">
                <label className="label" >
                    <span className="label-text">Location </span>
                </label>
                <select className="select select-bordered w-full" defaultValue="">
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

            <div className="pt-8 pl-8 w-96">
                <label className="label">
                    <span className="label-text">Category </span>
                </label>
                <select className="select select-borderd w-full" defaultValue="">
                    <option value="" disabled>
                        Select Category
                    </option>

                    <option value="B">Books</option>
                    <option value="E">Electronics</option>
                    <option value="F">Furniture</option>
                    <option value="C">Clothing</option>
                    <option value="A">Appliances</option>
                </select>
            </div>

            <div className="pt-8 pl-8 w-96">
                <label className="label">
                    <span className="label-text">Condition </span>
                </label>
                <select className="select select-borderd w-full" defaultValue="">
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





            <label className=" flex flex-col h-115 w-175 cursor-pointer border-2 border-dashed rounded-lg ml-8  items-center justify-center">
            <Camera className="h-12 w-12 text-primary" />
            <p className="mt-3">Upload Images</p>
            <input
            type="file"
            accept="image/*"
            className="hidden"
            />
            </label>
</div>
            <div className="flex flex-col">
                <label className="label" >
                    <span className="label-text">Description</span>
                </label>
                <textarea
        
                placeholder="Please enter a detailed description of your listed item."
                className="textarea textarea-bordered w-170 "
                ></textarea>
                
                <div className="flex gap-4 mt-6 pl-15">
                 <button type="submit" className=" btn btn-primary w-70">
                        List Item
                    </button>
            
                <button type="delete" className=" btn btn-primary w-70">
                       Draft
                    </button>
                    </div>
                </div>
        </div>
    </div>
        
    );
}

export default SellItem;

